import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, BigInteger, Float, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class LeaderboardEntry(Base):
    __tablename__ = "leaderboard_entries"
    __table_args__ = (
        UniqueConstraint("season_id", "leaderboard_type", "region_code", "player_id", name="uq_leaderboard_player"),
    )

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    season_id: Mapped[str] = mapped_column(String(50), default="season_1", nullable=False, index=True)
    leaderboard_type: Mapped[str] = mapped_column(String(32), default="GLOBAL", nullable=False, index=True)
    region_code: Mapped[str] = mapped_column(String(16), default="GLOBAL", nullable=False, index=True)
    player_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("players.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    rank_points: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)
    total_score: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    rank_tier: Mapped[str] = mapped_column(String(32), default="E", nullable=False)
    total_workouts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    avg_form_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    rank_position: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relationships
    player: Mapped["Player"] = relationship("Player")
