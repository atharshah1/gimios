from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext
from app.core.events import event_bus
from app.models.subscription import Subscription
from app.modules.billing.schema import BillingPayment, BillingPlan, BillingStatus, BillingView


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
            event_bus.emit("billing:changed", str(auth.gym_id), str(subscription.id), "created")
        return subscription

    async def get_billing(self, auth: AuthContext) -> BillingView:
        subscription = await self._get_or_create_subscription(auth)
        return BillingView(
            status=BillingStatus(
                gym_id=subscription.gym_id,
                subscription_status=subscription.status,
                current_start=subscription.current_start,
                current_end=subscription.current_end,
            ),
            plans=self.list_plans(),
            payments=self.list_payments_from_subscription(subscription),
        )

    def list_plans(self) -> list[BillingPlan]:
        return [
            BillingPlan(id="gym-standard-monthly", name="Gym Standard", amount=1500000, interval="month"),
            BillingPlan(id="gym-standard-yearly", name="Gym Standard Yearly", amount=16200000, interval="year"),
        ]

    def list_payments_from_subscription(self, subscription: Subscription) -> list[BillingPayment]:
        return [
            BillingPayment(
                id=str(subscription.id),
                amount=subscription.plan_amount,
                status=subscription.status,
                period_start=subscription.current_start,
                period_end=subscription.current_end,
            )
        ]
