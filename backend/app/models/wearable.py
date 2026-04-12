import enum
import uuid
from datetime import date, datetime, timezone

from sqlalchemy import Date, DateTime, Enum, Float, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class WearableSource(str, enum.Enum):
    google_fit = "google_fit"
    apple_health = "apple_health"


class WearableData(Base):
    __tablename__ = "wearable_data"
    __table_args__ = (UniqueConstraint("user_id", "date", "source", name="uq_wearable"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    gym_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("gyms.id"), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    steps: Mapped[int] = mapped_column(Integer, default=0)
    calories: Mapped[float] = mapped_column(Float, default=0.0)
    source: Mapped[WearableSource] = mapped_column(Enum(WearableSource), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", foreign_keys=[user_id])
