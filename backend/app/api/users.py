import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth import get_current_user
from app.core.database import get_db
from app.core.security import get_password_hash
from app.models.user import User, UserRole

router = APIRouter()


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: UserRole
    gym_id: uuid.UUID | None = None


@router.post("/")
async def create_user(
    body: UserCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    if current_user.role not in (UserRole.super_admin, UserRole.gym_owner):
        raise HTTPException(status_code=403, detail="Forbidden")

    existing = await db.execute(
        select(User).where(User.email == body.email, User.gym_id == body.gym_id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered in this gym")

    user = User(
        email=body.email,
        full_name=body.full_name,
        hashed_password=get_password_hash(body.password),
        role=body.role,
        gym_id=body.gym_id,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"id": user.id, "email": user.email, "role": user.role}


@router.get("/me")
async def get_me(current_user: Annotated[User, Depends(get_current_user)]):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "gym_id": current_user.gym_id,
    }


@router.get("/")
async def list_users(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    if current_user.role == UserRole.super_admin:
        result = await db.execute(select(User))
    else:
        result = await db.execute(select(User).where(User.gym_id == current_user.gym_id))
    users = result.scalars().all()
    return [{"id": u.id, "email": u.email, "full_name": u.full_name, "role": u.role} for u in users]
