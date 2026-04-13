from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel

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
