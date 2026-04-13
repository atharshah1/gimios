from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, create_refresh_token, verify_password
from app.models.user import User
from app.modules.auth.schema import LoginResponse


class AuthService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def login(self, email: str, password: str) -> LoginResponse:
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        access_token = create_access_token(
            subject=str(user.id),
            extra={"role": user.role.value, "gym_id": str(user.gym_id) if user.gym_id else None},
        )
        refresh_token = create_refresh_token(subject=str(user.id))
        return LoginResponse(access_token=access_token, refresh_token=refresh_token)
