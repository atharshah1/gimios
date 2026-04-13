from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext, require_auth_context
from app.core.database import get_db
from app.core.schemas import ApiResponse, success_response
from app.models.user import UserRole
from app.modules.roster.schema import RosterUserCreate, RosterUserView
from app.modules.roster.service import RosterService

router = APIRouter(tags=["roster"])


@router.get("/trainers", response_model=ApiResponse[list[RosterUserView]])
async def list_trainers(
    auth: Annotated[AuthContext, Depends(require_auth_context)], db: AsyncSession = Depends(get_db)
):
    data = await RosterService(db).list_by_role(auth, UserRole.trainer)
    return success_response(data)


@router.post("/trainers", response_model=ApiResponse[RosterUserView])
async def create_trainer(
    body: RosterUserCreate,
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
):
    if auth.role not in {UserRole.gym_owner, UserRole.super_admin}:
        raise HTTPException(status_code=403, detail="Forbidden")
    data = await RosterService(db).create_user(auth, UserRole.trainer, body)
    return success_response(data)


@router.get("/members", response_model=ApiResponse[list[RosterUserView]])
async def list_members(
    auth: Annotated[AuthContext, Depends(require_auth_context)], db: AsyncSession = Depends(get_db)
):
    data = await RosterService(db).list_by_role(auth, UserRole.member)
    return success_response(data)


@router.post("/members", response_model=ApiResponse[RosterUserView])
async def create_member(
    body: RosterUserCreate,
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
):
    if auth.role not in {UserRole.gym_owner, UserRole.super_admin, UserRole.trainer}:
        raise HTTPException(status_code=403, detail="Forbidden")
    data = await RosterService(db).create_user(auth, UserRole.member, body)
    return success_response(data)
