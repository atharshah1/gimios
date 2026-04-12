import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.workout import Workout
from app.models.user import User, UserRole

router = APIRouter()


class WorkoutCreate(BaseModel):
    assigned_to: uuid.UUID
    title: str
    description: str | None = None


@router.post("/")
async def create_workout(
    body: WorkoutCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    if current_user.role not in (UserRole.super_admin, UserRole.gym_owner, UserRole.trainer):
        raise HTTPException(status_code=403, detail="Forbidden")
    if current_user.gym_id is None:
        raise HTTPException(status_code=400, detail="User is not associated with a gym")

    workout = Workout(
        gym_id=current_user.gym_id,
        assigned_to=body.assigned_to,
        assigned_by=current_user.id,
        title=body.title,
        description=body.description,
    )
    db.add(workout)
    await db.commit()
    await db.refresh(workout)
    return workout


@router.get("/")
async def list_workouts(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    if current_user.role == UserRole.member:
        result = await db.execute(
            select(Workout).where(
                Workout.gym_id == current_user.gym_id,
                Workout.assigned_to == current_user.id,
            )
        )
    else:
        result = await db.execute(
            select(Workout).where(Workout.gym_id == current_user.gym_id)
        )
    return result.scalars().all()
