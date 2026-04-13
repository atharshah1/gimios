from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class PaymentStatusEnum(str, Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"
    refunded = "refunded"


class BillingPlan(BaseModel):
    id: str
    name: str
    amount: int
    interval: str
    currency: str = "INR"


class BillingPayment(BaseModel):
    id: str
    invoice_number: str
    amount: int
    currency: str
    status: PaymentStatusEnum
    paid_at: datetime | None
    created_at: datetime
    gateway_order_id: str | None = None
    gateway_payment_id: str | None = None


class BillingStatus(BaseModel):
    gym_id: UUID
    subscription_status: str
    current_start: datetime | None
    current_end: datetime | None


class BillingView(BaseModel):
    status: BillingStatus
    plans: list[BillingPlan]
    payments: list[BillingPayment]


class PaymentStatusUpdate(BaseModel):
    status: PaymentStatusEnum


class CheckoutSessionRequest(BaseModel):
    amount: int = Field(ge=100)
    currency: str = Field(default="INR", min_length=3, max_length=8)
    plan_id: str | None = None


class CheckoutSessionResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    key_id: str


class RazorpayWebhookPayload(BaseModel):
    event: str
    payload: dict
