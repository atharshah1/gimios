from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.schemas import ApiResponse, success_response
from app.modules.auth.schema import LoginRequest, LoginResponse, RefreshRequest
from app.modules.auth.service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=ApiResponse[LoginResponse])
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    data = await AuthService(db).login(body.email, body.password)
    return success_response(data)


@router.post("/refresh", response_model=ApiResponse[LoginResponse])
async def refresh(body: RefreshRequest, db: AsyncSession = Depends(get_db)):
    data = await AuthService(db).refresh(body.refresh_token)
    return success_response(data)
