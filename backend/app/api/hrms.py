import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.trainer import Trainer
from app.models.user import User, UserRole

router = APIRouter()


class TrainerCreate(BaseModel):
    user_id: uuid.UUID
    specialization: str | None = None
    bio: str | None = None


@router.post("/")
async def add_trainer(
    body: TrainerCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    if current_user.role not in (UserRole.super_admin, UserRole.gym_owner):
        raise HTTPException(status_code=403, detail="Forbidden")
    if current_user.gym_id is None:
        raise HTTPException(status_code=400, detail="User is not associated with a gym")

    trainer = Trainer(
        user_id=body.user_id,
        gym_id=current_user.gym_id,
        specialization=body.specialization,
        bio=body.bio,
    )
    db.add(trainer)
    await db.commit()
    await db.refresh(trainer)
    return trainer


@router.get("/")
async def list_trainers(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Trainer).where(Trainer.gym_id == current_user.gym_id, Trainer.is_active.is_(True))
    )
    return result.scalars().all()


@router.delete("/{trainer_id}")
async def deactivate_trainer(
    trainer_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    if current_user.role not in (UserRole.super_admin, UserRole.gym_owner):
        raise HTTPException(status_code=403, detail="Forbidden")

    result = await db.execute(
        select(Trainer).where(Trainer.id == trainer_id, Trainer.gym_id == current_user.gym_id)
    )
    trainer = result.scalar_one_or_none()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")

    trainer.is_active = False
    await db.commit()
    return {"detail": "Trainer deactivated"}
