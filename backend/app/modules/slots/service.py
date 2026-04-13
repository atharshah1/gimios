from fastapi import HTTPException
from sqlalchemy import Select, and_, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext
from app.core.events import event_bus
from app.models.timeslot import TimeSlot
from app.modules.slots.schema import SlotCreate, SlotListFilters, SlotSort, SlotView


class SlotService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, auth: AuthContext, payload: SlotCreate) -> SlotView:
        overlap_query = select(TimeSlot).where(
            TimeSlot.gym_id == auth.gym_id,
            TimeSlot.date == payload.date,
            or_(TimeSlot.trainer_id == payload.trainer_id, payload.trainer_id is None),
            and_(TimeSlot.start_time < payload.end_time, TimeSlot.end_time > payload.start_time),
        )
        overlap_result = await self.db.execute(overlap_query)
        if overlap_result.scalar_one_or_none() is not None:
            raise HTTPException(status_code=409, detail="Overlapping slot exists for selected schedule")

        slot = TimeSlot(gym_id=auth.gym_id, **payload.model_dump())
        self.db.add(slot)
        await self.db.commit()
        await self.db.refresh(slot)
        await event_bus.emit("slots:changed", str(auth.gym_id), str(slot.id), "created")
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

    async def count(self, auth: AuthContext, filters: SlotListFilters) -> int:
        query = select(func.count(TimeSlot.id)).where(TimeSlot.gym_id == auth.gym_id)
        if filters.trainer_id:
            query = query.where(TimeSlot.trainer_id == filters.trainer_id)
        if filters.date:
            query = query.where(TimeSlot.date == filters.date)
        result = await self.db.execute(query)
        return int(result.scalar_one() or 0)
