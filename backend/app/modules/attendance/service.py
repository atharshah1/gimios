from fastapi import HTTPException
from sqlalchemy import Select, case, desc, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext
from app.core.events import event_bus
from app.models.attendance import Attendance, AttendanceStatus
from app.models.timeslot import TimeSlot
from app.models.user import UserRole
from app.modules.attendance.schema import (
    AttendanceCreate,
    AttendanceListFilters,
    AttendanceOverview,
    AttendanceSort,
    AttendanceView,
    SlotAttendanceSummary,
)


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

    def _base_query(self, auth: AuthContext, filters: AttendanceListFilters) -> Select:
        query: Select = select(Attendance).where(Attendance.gym_id == auth.gym_id)
        if auth.role == UserRole.member:
            query = query.where(Attendance.user_id == auth.user_id)
        elif filters.member_id:
            query = query.where(Attendance.user_id == filters.member_id)

        if filters.trainer_id:
            query = query.join(TimeSlot, TimeSlot.id == Attendance.slot_id).where(
                TimeSlot.trainer_id == filters.trainer_id
            )

        if filters.date:
            query = query.where(Attendance.date == filters.date)
        return query

    async def list(self, auth: AuthContext, filters: AttendanceListFilters) -> list[AttendanceView]:
        query = self._base_query(auth, filters)

        sort_map = {
            AttendanceSort.date: Attendance.date,
            AttendanceSort.date_desc: desc(Attendance.date),
            AttendanceSort.created_at: Attendance.created_at,
            AttendanceSort.created_at_desc: desc(Attendance.created_at),
        }
        query = query.order_by(sort_map.get(filters.sort, desc(Attendance.date)))
        query = query.offset(filters.offset).limit(filters.limit)
        result = await self.db.execute(query)
        return [AttendanceView.model_validate(row, from_attributes=True) for row in result.scalars().all()]

    async def overview(self, auth: AuthContext, filters: AttendanceListFilters) -> AttendanceOverview:
        present_case = case((Attendance.status == AttendanceStatus.present, 1), else_=0)
        absent_case = case((Attendance.status == AttendanceStatus.absent, 1), else_=0)

        total_query = self._base_query(auth, filters).with_only_columns(
            func.count(Attendance.id),
            func.coalesce(func.sum(present_case), 0),
            func.coalesce(func.sum(absent_case), 0),
        )
        total_result = await self.db.execute(total_query)
        total_records, present_count, absent_count = total_result.one()

        by_slot_query = self._base_query(auth, filters).with_only_columns(
            Attendance.slot_id,
            func.count(Attendance.id).label("total"),
            func.coalesce(func.sum(present_case), 0).label("present"),
            func.coalesce(func.sum(absent_case), 0).label("absent"),
        ).group_by(Attendance.slot_id)
        by_slot_result = await self.db.execute(by_slot_query)

        by_slot = [
            SlotAttendanceSummary(slot_id=row.slot_id, total=row.total, present=row.present, absent=row.absent)
            for row in by_slot_result
        ]
        attendance_rate = (present_count / total_records) * 100 if total_records else 0.0

        return AttendanceOverview(
            total_records=total_records,
            present_count=present_count,
            absent_count=absent_count,
            attendance_rate=round(attendance_rate, 2),
            by_slot=by_slot,
        )
