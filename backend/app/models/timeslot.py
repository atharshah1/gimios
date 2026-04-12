import uuid
from datetime import time

from sqlalchemy import ForeignKey, Integer, String, Time
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class TimeSlot(Base):
    __tablename__ = "time_slots"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    gym_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("gyms.id"), nullable=False)
    trainer_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("trainers.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, default=20)

    gym = relationship("Gym", back_populates="time_slots")
    trainer = relationship("Trainer", foreign_keys=[trainer_id])
    attendances = relationship("Attendance", back_populates="slot")
