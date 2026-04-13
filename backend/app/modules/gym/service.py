from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext
from app.models.gym import Gym
from app.modules.gym.schema import GymView


class GymService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def current_gym(self, auth: AuthContext) -> GymView:
        if auth.gym_id is None:
            raise HTTPException(status_code=400, detail="gym_id is required")

        result = await self.db.execute(select(Gym).where(Gym.id == auth.gym_id))
        gym = result.scalar_one_or_none()
        if gym is None:
            raise HTTPException(status_code=404, detail="Gym not found")
        return GymView.model_validate(gym, from_attributes=True)
