import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    gym_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("gyms.id"), unique=True, nullable=False)
    razorpay_sub_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    plan_amount: Mapped[int] = mapped_column(Integer, default=1500000)  # paise
    status: Mapped[str] = mapped_column(String(50), default="created")
    current_start: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    current_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    gym = relationship("Gym", back_populates="subscription")
