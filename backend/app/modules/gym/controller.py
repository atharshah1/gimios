from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext, require_auth_context
from app.core.database import get_db
from app.core.schemas import ApiResponse, success_response
from app.modules.gym.schema import GymView
from app.modules.gym.service import GymService

router = APIRouter(prefix="/gym", tags=["gym"])


@router.get("", response_model=ApiResponse[GymView])
async def get_current_gym(
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
):
    data = await GymService(db).current_gym(auth)
    return success_response(data)
