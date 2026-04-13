from datetime import date, time
from uuid import UUID

from pydantic import BaseModel, Field


class SlotCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    start_time: time
    end_time: time
    capacity: int = Field(default=20, ge=1, le=200)
    trainer_id: UUID | None = None


class SlotView(SlotCreate):
    id: UUID
    gym_id: UUID


class SlotListFilters(BaseModel):
    trainer_id: UUID | None = None
    date: date | None = None
    limit: int = Field(default=50, ge=1, le=200)
    offset: int = Field(default=0, ge=0)
    sort: str = Field(default="start_time")
