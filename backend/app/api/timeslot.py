import uuid
from datetime import date, time
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.timeslot import TimeSlot
from app.models.user import User, UserRole

router = APIRouter()


class TimeSlotCreate(BaseModel):
    date: date
    name: str
    start_time: time
    end_time: time
    capacity: int = Field(default=20, ge=1, le=200)
    trainer_id: uuid.UUID | None = None


@router.post("/")
async def create_slot(
    body: TimeSlotCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    if current_user.role not in (UserRole.super_admin, UserRole.gym_owner):
        raise HTTPException(status_code=403, detail="Forbidden")
    if current_user.gym_id is None:
        raise HTTPException(status_code=400, detail="User is not associated with a gym")

    slot = TimeSlot(gym_id=current_user.gym_id, **body.model_dump())
    db.add(slot)
    await db.commit()
    await db.refresh(slot)
    return slot


@router.get("/")
async def list_slots(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
    trainer_id: uuid.UUID | None = Query(default=None),
    date_value: date | None = Query(default=None, alias="date"),
):
    query = select(TimeSlot).where(TimeSlot.gym_id == current_user.gym_id)
    if trainer_id:
        query = query.where(TimeSlot.trainer_id == trainer_id)
    if date_value:
        query = query.where(TimeSlot.date == date_value)
    result = await db.execute(query)
    return result.scalars().all()


@router.delete("/{slot_id}")
async def delete_slot(
    slot_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    if current_user.role not in (UserRole.super_admin, UserRole.gym_owner):
        raise HTTPException(status_code=403, detail="Forbidden")

    result = await db.execute(
        select(TimeSlot).where(TimeSlot.id == slot_id, TimeSlot.gym_id == current_user.gym_id)
    )
    slot = result.scalar_one_or_none()
    if not slot:
        raise HTTPException(status_code=404, detail="Time slot not found")

    await db.delete(slot)
    await db.commit()
    return {"detail": "Slot deleted"}
