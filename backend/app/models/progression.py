from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, BigInteger, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class PlayerProgression(Base):
    __tablename__ = "player_progression"

    player_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("players.id", ondelete="CASCADE"),
        primary_key=True
    )
    level: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    current_xp: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    current_rank_id: Mapped[str] = mapped_column(
        String(32),
        ForeignKey("rank_definitions.id"),
        default="E",
        nullable=False
    )
    rank_points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    season_id: Mapped[str] = mapped_column(String(50), default="season_1", nullable=False)
    
    total_workouts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    valid_reps: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_score: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    calories_burned: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    current_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    best_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_workout_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relationships
    player: Mapped["Player"] = relationship("Player", back_populates="progression")
    rank_definition: Mapped["RankDefinition"] = relationship("RankDefinition")
