from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext
from app.core.events import event_bus
from app.models.timeslot import TimeSlot
from app.modules.slots.schema import SlotCreate, SlotView


class SlotService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, auth: AuthContext, payload: SlotCreate) -> SlotView:
        slot = TimeSlot(gym_id=auth.gym_id, **payload.model_dump())
        self.db.add(slot)
        await self.db.commit()
        await self.db.refresh(slot)
        event_bus.emit("slots:changed", str(auth.gym_id), str(slot.id), "created")
        return SlotView.model_validate(slot, from_attributes=True)

    async def list(self, auth: AuthContext) -> list[SlotView]:
        result = await self.db.execute(select(TimeSlot).where(TimeSlot.gym_id == auth.gym_id))
        return [SlotView.model_validate(slot, from_attributes=True) for slot in result.scalars().all()]
