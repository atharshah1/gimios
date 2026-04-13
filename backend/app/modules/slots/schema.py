from datetime import date, time
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field, model_validator


class SlotCreate(BaseModel):
    date: date
    name: str = Field(min_length=2, max_length=100)
    start_time: time
    end_time: time
    capacity: int = Field(default=20, ge=1, le=200)
    trainer_id: UUID | None = None

    @model_validator(mode="after")
    def validate_time_window(self):
        if self.end_time <= self.start_time:
            raise ValueError("end_time must be greater than start_time")
        return self


class SlotView(SlotCreate):
    id: UUID
    gym_id: UUID


class SlotSort(str, Enum):
    date = "date"
    date_desc = "-date"
    start_time = "start_time"
    start_time_desc = "-start_time"
    name = "name"
    name_desc = "-name"


class SlotListFilters(BaseModel):
    trainer_id: UUID | None = None
    date: date | None = None
    limit: int = Field(default=50, ge=1, le=200)
    offset: int = Field(default=0, ge=0)
    sort: SlotSort = SlotSort.date
