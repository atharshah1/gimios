from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class BillingPlan(BaseModel):
    id: str
    name: str
    amount: int
    interval: str


class BillingPayment(BaseModel):
    id: str
    amount: int
    status: str
    period_start: datetime | None
    period_end: datetime | None


class BillingStatus(BaseModel):
    gym_id: UUID
    subscription_status: str
    current_start: datetime | None
    current_end: datetime | None


class BillingView(BaseModel):
    status: BillingStatus
    plans: list[BillingPlan]
    payments: list[BillingPayment]
