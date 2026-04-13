from datetime import date
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext, require_auth_context
from app.core.database import get_db
from app.core.schemas import ApiResponse, success_response
from app.models.user import UserRole
from app.modules.slots.schema import SlotCreate, SlotListFilters, SlotView
from app.modules.slots.service import SlotService

router = APIRouter(prefix="/timeslots", tags=["timeslots"])


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
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
    trainer_id: UUID | None = Query(default=None),
    date_value: date | None = Query(default=None, alias="date"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    sort: str = Query(default="start_time"),
):
    filters = SlotListFilters(
        trainer_id=trainer_id,
        date=date_value,
        limit=limit,
        offset=offset,
        sort=sort,
    )
    data = await SlotService(db).list(auth, filters)
    return success_response(data)
