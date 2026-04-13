from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext
from app.core.events import event_bus
from app.models.payment import Payment
from app.models.subscription import Subscription
from app.modules.billing.schema import (
    BillingPayment,
    BillingPlan,
    BillingStatus,
    BillingView,
    PaymentStatusEnum,
)


class BillingService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def _get_or_create_subscription(self, auth: AuthContext) -> Subscription:
        result = await self.db.execute(select(Subscription).where(Subscription.gym_id == auth.gym_id))
        subscription = result.scalar_one_or_none()
        if subscription is None:
            now = datetime.now(timezone.utc)
            subscription = Subscription(
                gym_id=auth.gym_id,
                status="created",
                current_start=now,
                current_end=now,
            )
            self.db.add(subscription)
            await self.db.commit()
            await self.db.refresh(subscription)
            await self._ensure_initial_payment(subscription)
            event_bus.emit("billing:changed", str(auth.gym_id), str(subscription.id), "created")
        return subscription

    async def _ensure_initial_payment(self, subscription: Subscription) -> None:
        existing = await self.db.execute(select(Payment).where(Payment.subscription_id == subscription.id))
        if existing.scalar_one_or_none():
            return
        payment = Payment(
            gym_id=subscription.gym_id,
            subscription_id=subscription.id,
            invoice_number=f"INV-{str(subscription.id)[:8]}-001",
            amount=subscription.plan_amount,
            status=PaymentStatusEnum.pending.value,
        )
        self.db.add(payment)
        await self.db.commit()

    async def get_billing(self, auth: AuthContext) -> BillingView:
        subscription = await self._get_or_create_subscription(auth)
        payments = await self.list_payments(auth)
        return BillingView(
            status=BillingStatus(
                gym_id=subscription.gym_id,
                subscription_status=subscription.status,
                current_start=subscription.current_start,
                current_end=subscription.current_end,
            ),
            plans=self.list_plans(),
            payments=payments,
        )

    def list_plans(self) -> list[BillingPlan]:
        return [
            BillingPlan(id="gym-standard-monthly", name="Gym Standard", amount=1500000, interval="month"),
            BillingPlan(id="gym-standard-yearly", name="Gym Standard Yearly", amount=16200000, interval="year"),
        ]

    async def list_payments(self, auth: AuthContext) -> list[BillingPayment]:
        await self._get_or_create_subscription(auth)
        result = await self.db.execute(
            select(Payment).where(Payment.gym_id == auth.gym_id).order_by(Payment.created_at.desc())
        )
        rows = result.scalars().all()
        return [
            BillingPayment(
                id=str(row.id),
                invoice_number=row.invoice_number,
                amount=row.amount,
                status=PaymentStatusEnum(row.status),
                paid_at=row.paid_at,
                created_at=row.created_at,
            )
            for row in rows
        ]

    async def update_payment_status(
        self,
        auth: AuthContext,
        payment_id: str,
        status: PaymentStatusEnum,
    ) -> BillingPayment:
        result = await self.db.execute(select(Payment).where(Payment.id == payment_id, Payment.gym_id == auth.gym_id))
        payment = result.scalar_one_or_none()
        if payment is None:
            raise HTTPException(status_code=404, detail="Payment not found")
        payment.status = status.value
        if status == PaymentStatusEnum.paid:
            payment.paid_at = datetime.now(timezone.utc)
        await self.db.commit()
        await self.db.refresh(payment)
        event_bus.emit("billing:changed", str(auth.gym_id), str(payment.id), "updated")
        return BillingPayment(
            id=str(payment.id),
            invoice_number=payment.invoice_number,
            amount=payment.amount,
            status=PaymentStatusEnum(payment.status),
            paid_at=payment.paid_at,
            created_at=payment.created_at,
        )
