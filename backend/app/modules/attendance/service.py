from collections import defaultdict

from fastapi import HTTPException
from sqlalchemy import Select, desc, select
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

    async def list(self, auth: AuthContext, filters: AttendanceListFilters) -> list[AttendanceView]:
        query: Select[tuple[Attendance]] = select(Attendance).where(Attendance.gym_id == auth.gym_id)
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

        sort_map = {
            "date": Attendance.date,
            "-date": desc(Attendance.date),
            "created_at": Attendance.created_at,
            "-created_at": desc(Attendance.created_at),
        }
        query = query.order_by(sort_map.get(filters.sort, desc(Attendance.date)))
        query = query.offset(filters.offset).limit(filters.limit)
        result = await self.db.execute(query)
        return [AttendanceView.model_validate(row, from_attributes=True) for row in result.scalars().all()]

    async def overview(self, auth: AuthContext, filters: AttendanceListFilters) -> AttendanceOverview:
        rows = await self.list(auth, AttendanceListFilters(**{**filters.model_dump(), "limit": 500, "offset": 0}))
        total = len(rows)
        present = sum(1 for r in rows if r.status == AttendanceStatus.present)
        absent = total - present
        slot_buckets: dict = defaultdict(lambda: {"total": 0, "present": 0, "absent": 0})
        for row in rows:
            bucket = slot_buckets[row.slot_id]
            bucket["total"] += 1
            if row.status == AttendanceStatus.present:
                bucket["present"] += 1
            else:
                bucket["absent"] += 1

        by_slot = [
            SlotAttendanceSummary(
                slot_id=slot_id,
                total=stats["total"],
                present=stats["present"],
                absent=stats["absent"],
            )
            for slot_id, stats in slot_buckets.items()
        ]
        attendance_rate = (present / total) * 100 if total else 0.0
        return AttendanceOverview(
            total_records=total,
            present_count=present,
            absent_count=absent,
            attendance_rate=round(attendance_rate, 2),
            by_slot=by_slot,
        )
