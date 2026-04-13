from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext, require_auth_context
from app.core.database import get_db
from app.core.schemas import ApiResponse, success_response
from app.modules.billing.schema import BillingPayment, BillingPlan, BillingStatus, BillingView
from app.modules.billing.service import BillingService

router = APIRouter(prefix="/billing", tags=["billing"])


@router.get("", response_model=ApiResponse[BillingView])
async def get_billing(
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
):
    data = await BillingService(db).get_billing(auth)
    return success_response(data)


@router.get("/plans", response_model=ApiResponse[list[BillingPlan]])
async def list_plans(
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
):
    _ = auth
    data = BillingService(db).list_plans()
    return success_response(data)


@router.get("/payments", response_model=ApiResponse[list[BillingPayment]])
async def list_payments(
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
):
    billing = await BillingService(db).get_billing(auth)
    return success_response(billing.payments)


@router.get("/status", response_model=ApiResponse[BillingStatus])
async def billing_status(
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
):
    billing = await BillingService(db).get_billing(auth)
    return success_response(billing.status)
