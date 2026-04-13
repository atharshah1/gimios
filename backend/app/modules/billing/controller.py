from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.middlewares.auth_context import AuthContext, require_auth_context
from app.core.database import get_db
from app.core.schemas import ApiResponse, success_response
from app.modules.billing.schema import (
    BillingPayment,
    BillingPlan,
    BillingStatus,
    BillingView,
    CheckoutSessionRequest,
    CheckoutSessionResponse,
    PaymentStatusUpdate,
)
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
    service = BillingService(db)
    payments = await service.list_payments(auth)
    return success_response(payments, meta={"total": len(payments)})


@router.patch("/payments/{payment_id}", response_model=ApiResponse[BillingPayment])
async def update_payment_status(
    payment_id: str,
    body: PaymentStatusUpdate,
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
):
    payment = await BillingService(db).update_payment_status(auth, payment_id, body.status)
    return success_response(payment)


@router.post("/checkout-session", response_model=ApiResponse[CheckoutSessionResponse])
async def create_checkout_session(
    body: CheckoutSessionRequest,
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
):
    checkout = await BillingService(db).create_checkout_session(auth, body)
    return success_response(checkout)


@router.post("/webhooks/razorpay", response_model=ApiResponse[dict])
async def razorpay_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    x_razorpay_signature: str = Header(alias="X-Razorpay-Signature"),
    x_razorpay_event_id: str | None = Header(default=None, alias="X-Razorpay-Event-Id"),
    db: AsyncSession = Depends(get_db),
):
    raw_body = (await request.body()).decode("utf-8")
    payload = await request.json()

    service = BillingService(db)
    background_tasks.add_task(service.process_razorpay_webhook, x_razorpay_signature, raw_body, payload, x_razorpay_event_id)
    return success_response({"accepted": True})


@router.get("/status", response_model=ApiResponse[BillingStatus])
async def billing_status(
    auth: Annotated[AuthContext, Depends(require_auth_context)],
    db: AsyncSession = Depends(get_db),
):
    billing = await BillingService(db).get_billing(auth)
    return success_response(billing.status)
