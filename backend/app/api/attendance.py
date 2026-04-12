import uuid
from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.attendance import Attendance, AttendanceStatus
from app.models.timeslot import TimeSlot
from app.models.user import User, UserRole

router = APIRouter()


class AttendanceMark(BaseModel):
    user_id: uuid.UUID
    slot_id: uuid.UUID
    date: date
    status: AttendanceStatus = AttendanceStatus.present


@router.post("/")
async def mark_attendance(
    body: AttendanceMark,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    if current_user.role not in (UserRole.super_admin, UserRole.gym_owner, UserRole.trainer):
        raise HTTPException(status_code=403, detail="Forbidden")
    if current_user.gym_id is None:
        raise HTTPException(status_code=400, detail="User is not associated with a gym")

    # Validate slot belongs to same gym
    slot_result = await db.execute(
        select(TimeSlot).where(
            TimeSlot.id == body.slot_id,
            TimeSlot.gym_id == current_user.gym_id,
        )
    )
    if not slot_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Time slot not found in your gym")

    record = Attendance(
        gym_id=current_user.gym_id,
        user_id=body.user_id,
        slot_id=body.slot_id,
        date=body.date,
        status=body.status,
        marked_by=current_user.id,
    )
    db.add(record)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=409, detail="Attendance already marked for this slot/date")
    await db.refresh(record)
    return record


@router.get("/")
async def list_attendance(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    if current_user.role == UserRole.member:
        result = await db.execute(
            select(Attendance).where(
                Attendance.gym_id == current_user.gym_id,
                Attendance.user_id == current_user.id,
            )
        )
    else:
        result = await db.execute(
            select(Attendance).where(Attendance.gym_id == current_user.gym_id)
        )
    return result.scalars().all()
