from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.wearable import WearableData, WearableSource
from app.models.user import User

router = APIRouter()


class WearableSync(BaseModel):
    date: date
    steps: int = 0
    calories: float = 0.0
    source: WearableSource


@router.post("/sync")
async def sync_wearable(
    body: WearableSync,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    if current_user.gym_id is None:
        raise HTTPException(status_code=400, detail="User is not associated with a gym")

    stmt = (
        insert(WearableData)
        .values(
            user_id=current_user.id,
            gym_id=current_user.gym_id,
            date=body.date,
            steps=body.steps,
            calories=body.calories,
            source=body.source,
        )
        .on_conflict_do_update(
            constraint="uq_wearable",
            set_={"steps": body.steps, "calories": body.calories},
        )
        .returning(WearableData)
    )
    result = await db.execute(stmt)
    await db.commit()
    return result.scalar_one()


@router.get("/")
async def get_wearable_data(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(WearableData).where(
            WearableData.user_id == current_user.id,
            WearableData.gym_id == current_user.gym_id,
        )
    )
    return result.scalars().all()
