from sqlalchemy import Select, desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext
from app.core.events import event_bus
from app.models.timeslot import TimeSlot
from app.modules.slots.schema import SlotCreate, SlotListFilters, SlotSort, SlotView


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

    async def list(self, auth: AuthContext, filters: SlotListFilters) -> list[SlotView]:
        query: Select[tuple[TimeSlot]] = select(TimeSlot).where(TimeSlot.gym_id == auth.gym_id)

        if filters.trainer_id:
            query = query.where(TimeSlot.trainer_id == filters.trainer_id)
        if filters.date:
            query = query.where(TimeSlot.date == filters.date)

        sort_map = {
            SlotSort.date: TimeSlot.date,
            SlotSort.date_desc: desc(TimeSlot.date),
            SlotSort.start_time: TimeSlot.start_time,
            SlotSort.start_time_desc: desc(TimeSlot.start_time),
            SlotSort.name: TimeSlot.name,
            SlotSort.name_desc: desc(TimeSlot.name),
        }
        query = query.order_by(sort_map.get(filters.sort, TimeSlot.date), TimeSlot.start_time)
        query = query.offset(filters.offset).limit(filters.limit)
        result = await self.db.execute(query)
        return [SlotView.model_validate(slot, from_attributes=True) for slot in result.scalars().all()]
