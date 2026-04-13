from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext, require_auth_context
from app.core.database import get_db
from app.core.schemas import ApiResponse, success_response
from app.modules.billing.schema import BillingView
from app.modules.billing.service import BillingService

router = APIRouter(prefix="/billing", tags=["billing"])


@router.get("", response_model=ApiResponse[BillingView])
async def get_billing(
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
):
    data = await BillingService(db).get_or_create(auth)
    return success_response(data)
