import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class ProgressionAuditLog(Base):
    __tablename__ = "progression_audit_logs"

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
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)  # 'RANK_UP', 'RANK_DOWN', 'XP_GRANT', 'REWARD_CLAIM'
    old_rank_id: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    new_rank_id: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    old_rp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    new_rp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    delta_rp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    old_level: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    new_level: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    source_reference: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g. 'WORKOUT:893271' or 'ADMIN:CLAIM'
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    player: Mapped["Player"] = relationship("Player", back_populates="audit_logs")
