from datetime import time
from uuid import UUID

from pydantic import BaseModel


class SlotCreate(BaseModel):
    name: str
    start_time: time
    end_time: time
    capacity: int = 20
    trainer_id: UUID | None = None


class SlotView(SlotCreate):
    id: UUID
    gym_id: UUID
