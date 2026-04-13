from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class RosterUserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str


class RosterUserView(BaseModel):
    id: UUID
    gym_id: UUID | None
    email: EmailStr
    full_name: str
    role: str
    created_at: datetime
