from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class GymView(BaseModel):
    id: UUID
    name: str
    slug: str
    theme_primary: str
    theme_secondary: str
    status: str
    created_at: datetime
