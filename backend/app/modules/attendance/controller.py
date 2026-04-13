from datetime import date
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext, require_auth_context
from app.core.database import get_db
from app.core.schemas import ApiResponse, success_response
from app.models.user import UserRole
from app.modules.attendance.schema import (
    AttendanceCreate,
    AttendanceListFilters,
    AttendanceOverview,
    AttendanceSort,
    AttendanceView,
)
from app.modules.attendance.service import AttendanceService

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post("", response_model=ApiResponse[AttendanceView])
async def mark_attendance(
    body: AttendanceCreate,
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
):
    if auth.role not in {UserRole.gym_owner, UserRole.super_admin, UserRole.trainer}:
        raise HTTPException(status_code=403, detail="Forbidden")
    data = await AttendanceService(db).mark(auth, body)
    return success_response(data)


@router.get("", response_model=ApiResponse[list[AttendanceView]])
async def list_attendance(
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
    member_id: UUID | None = Query(default=None),
    trainer_id: UUID | None = Query(default=None),
    date_value: date | None = Query(default=None, alias="date"),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    sort: AttendanceSort = Query(default=AttendanceSort.date_desc),
):
    filters = AttendanceListFilters(
        member_id=member_id,
        trainer_id=trainer_id,
        date=date_value,
        limit=limit,
        offset=offset,
        sort=sort,
    )
    data = await AttendanceService(db).list(auth, filters)
    return success_response(data)


@router.get("/overview", response_model=ApiResponse[AttendanceOverview])
async def attendance_overview(
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
    trainer_id: UUID | None = Query(default=None),
    date_value: date | None = Query(default=None, alias="date"),
):
    if auth.role not in {UserRole.gym_owner, UserRole.super_admin}:
        raise HTTPException(status_code=403, detail="Forbidden")
    filters = AttendanceListFilters(trainer_id=trainer_id, date=date_value)
    data = await AttendanceService(db).overview(auth, filters)
    return success_response(data)
