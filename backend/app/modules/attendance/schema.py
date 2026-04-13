from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.attendance import AttendanceStatus


class AttendanceCreate(BaseModel):
    user_id: UUID
    slot_id: UUID
    date: date
    status: AttendanceStatus = AttendanceStatus.present


class AttendanceView(BaseModel):
    id: UUID
    gym_id: UUID
    user_id: UUID
    slot_id: UUID
    date: date
    status: AttendanceStatus
    marked_by: UUID | None
    created_at: datetime


class AttendanceListFilters(BaseModel):
    member_id: UUID | None = None
    trainer_id: UUID | None = None
    date: date | None = None
    limit: int = Field(default=100, ge=1, le=500)
    offset: int = Field(default=0, ge=0)
    sort: str = Field(default="-date")


class SlotAttendanceSummary(BaseModel):
    slot_id: UUID
    total: int
    present: int
    absent: int


class AttendanceOverview(BaseModel):
    total_records: int
    present_count: int
    absent_count: int
    attendance_rate: float
    by_slot: list[SlotAttendanceSummary]
