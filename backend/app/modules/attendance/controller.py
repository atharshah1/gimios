from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext, require_auth_context
from app.core.database import get_db
from app.core.schemas import ApiResponse, success_response
from app.models.user import UserRole
from app.modules.attendance.schema import AttendanceCreate, AttendanceView
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
    auth: Annotated[AuthContext, Depends(require_auth_context)], db: AsyncSession = Depends(get_db)
):
    data = await AttendanceService(db).list(auth)
    return success_response(data)
