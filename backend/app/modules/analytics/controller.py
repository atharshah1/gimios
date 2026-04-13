from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext, require_auth_context
from app.core.database import get_db
from app.core.schemas import ApiResponse, success_response
from app.modules.analytics.schema import DashboardMetrics
from app.modules.analytics.service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard", response_model=ApiResponse[DashboardMetrics])
async def dashboard(
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
):
    data = await AnalyticsService(db).dashboard(auth)
    return success_response(data)
