import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.gym import Gym, GymStatus
from app.models.user import User, UserRole

router = APIRouter()


class GymCreate(BaseModel):
    name: str
    slug: str
    theme_primary: str = "#000000"
    theme_secondary: str = "#ffffff"


class GymUpdate(BaseModel):
    name: str | None = None
    theme_primary: str | None = None
    theme_secondary: str | None = None


@router.post("/")
async def create_gym(
    body: GymCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(select(Gym).where(Gym.slug == body.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Slug already taken")

    gym = Gym(**body.model_dump())
    db.add(gym)
    await db.commit()
    await db.refresh(gym)
    return gym


@router.get("/{gym_id}")
async def get_gym(
    gym_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Gym).where(Gym.id == gym_id))
    gym = result.scalar_one_or_none()
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    return gym


@router.patch("/{gym_id}")
async def update_gym(
    gym_id: uuid.UUID,
    body: GymUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Gym).where(Gym.id == gym_id))
    gym = result.scalar_one_or_none()
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    if current_user.role not in (UserRole.super_admin, UserRole.gym_owner):
        raise HTTPException(status_code=403, detail="Forbidden")
    if current_user.role == UserRole.gym_owner and current_user.gym_id != gym_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(gym, field, value)

    await db.commit()
    await db.refresh(gym)
    return gym
