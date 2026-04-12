import uuid
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.gym import Gym, GymStatus
from app.models.subscription import Subscription
from app.models.user import User, UserRole

router = APIRouter()


def require_super_admin(current_user: User) -> None:
    if current_user.role != UserRole.super_admin:
        raise HTTPException(status_code=403, detail="Super admin only")


@router.get("/gyms")
async def list_all_gyms(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    require_super_admin(current_user)
    result = await db.execute(select(Gym))
    gyms = result.scalars().all()
    return gyms


@router.post("/gyms/{gym_id}/activate-trial")
async def activate_trial(
    gym_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    require_super_admin(current_user)

    result = await db.execute(select(Gym).where(Gym.id == gym_id))
    gym = result.scalar_one_or_none()
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")

    now = datetime.now(timezone.utc)
    gym.trial_start = now
    gym.trial_end = now + timedelta(days=15)
    gym.status = GymStatus.trial

    await db.commit()
    await db.refresh(gym)
    return gym


@router.get("/stats")
async def platform_stats(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    require_super_admin(current_user)

    total_gyms = await db.scalar(select(func.count()).select_from(Gym))
    active_subs = await db.scalar(
        select(func.count()).select_from(Subscription).where(Subscription.status == "active")
    )
    trial_gyms = await db.scalar(
        select(func.count()).select_from(Gym).where(Gym.status == GymStatus.trial)
    )

    return {
        "total_gyms": total_gyms,
        "active_subscriptions": active_subs,
        "gyms_on_trial": trial_gyms,
    }
