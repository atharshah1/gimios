from datetime import datetime, timezone

from fastapi import HTTPException
from razorpay import Client
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext
from app.core.config import settings
from app.core.events import event_bus
from app.core.redis import redis_client
from app.models.payment import Payment, PaymentStatus
from app.models.subscription import Subscription
from app.modules.billing.schema import (
    BillingPayment,
    BillingPlan,
    BillingStatus,
    BillingView,
    CheckoutSessionRequest,
    CheckoutSessionResponse,
    PaymentStatusEnum,
)


class BillingService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.client = None
        if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
            self.client = Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

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
            await event_bus.emit("billing:changed", str(auth.gym_id), str(subscription.id), "created")
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
            currency="INR",
            status=PaymentStatus.pending,
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
            BillingPlan(id="gym-standard-monthly", name="Gym Standard", amount=1500000, interval="month", currency="INR"),
            BillingPlan(id="gym-standard-yearly", name="Gym Standard Yearly", amount=16200000, interval="year", currency="INR"),
            BillingPlan(id="gym-international-monthly", name="Gym Global", amount=20000, interval="month", currency="USD"),
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
                currency=row.currency,
                status=PaymentStatusEnum(row.status.value),
                paid_at=row.paid_at,
                created_at=row.created_at,
                gateway_order_id=row.gateway_order_id,
                gateway_payment_id=row.gateway_payment_id,
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
        payment.status = PaymentStatus(status.value)
        if status == PaymentStatusEnum.paid:
            payment.paid_at = datetime.now(timezone.utc)
        await self.db.commit()
        await self.db.refresh(payment)
        await event_bus.emit("billing:changed", str(auth.gym_id), str(payment.id), "updated")
        return BillingPayment(
            id=str(payment.id),
            invoice_number=payment.invoice_number,
            amount=payment.amount,
            currency=payment.currency,
            status=PaymentStatusEnum(payment.status.value),
            paid_at=payment.paid_at,
            created_at=payment.created_at,
            gateway_order_id=payment.gateway_order_id,
            gateway_payment_id=payment.gateway_payment_id,
        )

    async def create_checkout_session(self, auth: AuthContext, body: CheckoutSessionRequest) -> CheckoutSessionResponse:
        if self.client is None:
            raise HTTPException(status_code=503, detail="Razorpay is not configured")
        subscription = await self._get_or_create_subscription(auth)
        receipt = f"gym-{auth.gym_id}-{int(datetime.now(timezone.utc).timestamp())}"
        order = self.client.order.create(
            {
                "amount": body.amount,
                "currency": body.currency.upper(),
                "receipt": receipt,
                "notes": {"gym_id": str(auth.gym_id), "plan_id": body.plan_id or "custom"},
            }
        )

        payment = Payment(
            gym_id=subscription.gym_id,
            subscription_id=subscription.id,
            invoice_number=f"INV-{receipt}",
            amount=body.amount,
            currency=body.currency.upper(),
            status=PaymentStatus.pending,
            gateway_order_id=order["id"],
        )
        self.db.add(payment)
        await self.db.commit()

        return CheckoutSessionResponse(
            order_id=order["id"],
            amount=order["amount"],
            currency=order["currency"],
            key_id=settings.RAZORPAY_KEY_ID,
        )

    async def process_razorpay_webhook(self, signature: str, raw_body: str, payload: dict, event_id: str | None = None) -> bool:
        if self.client is None:
            raise HTTPException(status_code=503, detail="Razorpay is not configured")

        dedupe_key = f"webhook:razorpay:{event_id}" if event_id else None
        if dedupe_key:
            is_new = await redis_client.set(dedupe_key, "1", ex=60 * 60 * 24, nx=True)
            if not is_new:
                return False

        body = payload if isinstance(payload, dict) else {}
        try:
            self.client.utility.verify_webhook_signature(raw_body, signature, settings.RAZORPAY_WEBHOOK_SECRET)
        except Exception as exc:
            raise HTTPException(status_code=400, detail="Invalid webhook signature") from exc

        entity = body.get("payload", {}).get("payment", {}).get("entity", {})
        order_id = entity.get("order_id")
        payment_id = entity.get("id")
        status = entity.get("status", "").lower()
        if not order_id:
            return True

        result = await self.db.execute(select(Payment).where(Payment.gateway_order_id == order_id))
        payment = result.scalar_one_or_none()
        if payment is None:
            return True

        mapped = PaymentStatus.pending
        if status == "captured":
            mapped = PaymentStatus.paid
            payment.paid_at = datetime.now(timezone.utc)
        elif status == "failed":
            mapped = PaymentStatus.failed

        payment.status = mapped
        payment.gateway_payment_id = payment_id
        await self.db.commit()
        await event_bus.emit("billing:changed", str(payment.gym_id), str(payment.id), "updated")
        return True
