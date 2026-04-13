from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext, require_auth_context
from app.core.database import get_db
from app.core.schemas import ApiResponse, success_response
from app.models.user import UserRole
from app.modules.slots.schema import SlotCreate, SlotView
from app.modules.slots.service import SlotService

router = APIRouter(prefix="/slots", tags=["slots"])


@router.post("", response_model=ApiResponse[SlotView])
async def create_slot(
    body: SlotCreate,
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
):
    if auth.role not in {UserRole.gym_owner, UserRole.super_admin, UserRole.trainer}:
        raise HTTPException(status_code=403, detail="Forbidden")
    data = await SlotService(db).create(auth, body)
    return success_response(data)


@router.get("", response_model=ApiResponse[list[SlotView]])
async def list_slots(
    auth: Annotated[AuthContext, Depends(require_auth_context)], db: AsyncSession = Depends(get_db)
):
    data = await SlotService(db).list(auth)
    return success_response(data)
