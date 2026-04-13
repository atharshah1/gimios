from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel


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


class BillingPayment(BaseModel):
    id: str
    invoice_number: str
    amount: int
    status: PaymentStatusEnum
    paid_at: datetime | None
    created_at: datetime


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
