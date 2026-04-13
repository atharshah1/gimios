from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext
from app.core.events import event_bus
from app.models.subscription import Subscription
from app.modules.billing.schema import BillingView


class BillingService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_or_create(self, auth: AuthContext) -> BillingView:
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

        return BillingView.model_validate(subscription, from_attributes=True)
