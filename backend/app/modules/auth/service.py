from fastapi import HTTPException, status
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.redis import redis_client
from app.core.security import create_access_token, create_refresh_token, decode_token, verify_password
from app.models.gym import Gym
from app.models.user import User
from app.modules.auth.schema import LoginResponse, LoginUser


class AuthService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def login(self, email: str, password: str) -> LoginResponse:
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        gym_slug: str | None = None
        if user.gym_id:
            gym_result = await self.db.execute(select(Gym.slug).where(Gym.id == user.gym_id))
            gym_slug = gym_result.scalar_one_or_none()

        access_token = create_access_token(
            subject=str(user.id),
            extra={"role": user.role.value, "gym_id": str(user.gym_id) if user.gym_id else None},
        )
        refresh_token = create_refresh_token(subject=str(user.id))
        await redis_client.set(f"auth:refresh:{user.id}", refresh_token)
        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=LoginUser(
                id=str(user.id),
                role=user.role.value,
                gym_id=str(user.gym_id) if user.gym_id else None,
                gym_slug=gym_slug,
            ),
        )

    async def refresh(self, refresh_token: str) -> LoginResponse:
        try:
            payload = decode_token(refresh_token)
        except JWTError as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        token_in_store = await redis_client.get(f"auth:refresh:{user_id}")
        if token_in_store != refresh_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token revoked")

        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        gym_slug: str | None = None
        if user.gym_id:
            gym_result = await self.db.execute(select(Gym.slug).where(Gym.id == user.gym_id))
            gym_slug = gym_result.scalar_one_or_none()

        new_access = create_access_token(
            subject=str(user.id),
            extra={"role": user.role.value, "gym_id": str(user.gym_id) if user.gym_id else None},
        )
        new_refresh = create_refresh_token(subject=str(user.id))
        await redis_client.set(f"auth:refresh:{user.id}", new_refresh)
        return LoginResponse(
            access_token=new_access,
            refresh_token=new_refresh,
            user=LoginUser(
                id=str(user.id),
                role=user.role.value,
                gym_id=str(user.gym_id) if user.gym_id else None,
                gym_slug=gym_slug,
            ),
        )
