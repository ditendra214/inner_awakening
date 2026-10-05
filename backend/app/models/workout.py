import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    player_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("players.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    exercise_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    reps_completed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    target_reps: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    form_accuracy: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    calories_burned: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    detected_reps: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    valid_reps: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    invalid_reps: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    difficulty_level: Mapped[str] = mapped_column(String(32), default="NORMAL", nullable=False)
    workout_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    session_id: Mapped[Optional[str]] = mapped_column(String(100), unique=True, nullable=True)
    anti_cheat_status: Mapped[str] = mapped_column(String(32), default="PASSED", nullable=False)

    # Rewards Computed Authoritatively
    xp_earned: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    rp_earned: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    coins_earned: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    player: Mapped["Player"] = relationship("Player", back_populates="workout_sessions")
