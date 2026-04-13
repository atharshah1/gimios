from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class BillingView(BaseModel):
    id: UUID
    gym_id: UUID
    plan_amount: int
    status: str
    current_start: datetime | None
    current_end: datetime | None
    created_at: datetime
