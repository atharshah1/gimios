from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext
from app.core.events import event_bus
from app.models.attendance import Attendance
from app.models.timeslot import TimeSlot
from app.models.user import UserRole
from app.modules.attendance.schema import AttendanceCreate, AttendanceView


class AttendanceService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def mark(self, auth: AuthContext, payload: AttendanceCreate) -> AttendanceView:
        slot_result = await self.db.execute(
            select(TimeSlot).where(TimeSlot.id == payload.slot_id, TimeSlot.gym_id == auth.gym_id)
        )
        if slot_result.scalar_one_or_none() is None:
            raise HTTPException(status_code=404, detail="Slot not found")

        record = Attendance(
            gym_id=auth.gym_id,
            user_id=payload.user_id,
            slot_id=payload.slot_id,
            date=payload.date,
            status=payload.status,
            marked_by=auth.user_id,
        )
        self.db.add(record)
        try:
            await self.db.commit()
        except IntegrityError as exc:
            await self.db.rollback()
            raise HTTPException(status_code=409, detail="Attendance already exists") from exc
        await self.db.refresh(record)
        event_bus.emit("attendance:changed", str(auth.gym_id), str(record.id), "created")
        return AttendanceView.model_validate(record, from_attributes=True)

    async def list(self, auth: AuthContext) -> list[AttendanceView]:
        query = select(Attendance).where(Attendance.gym_id == auth.gym_id)
        if auth.role == UserRole.member:
            query = query.where(Attendance.user_id == auth.user_id)
        result = await self.db.execute(query)
        return [AttendanceView.model_validate(row, from_attributes=True) for row in result.scalars().all()]
