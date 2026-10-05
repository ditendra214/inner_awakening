from datetime import datetime
from sqlalchemy import String, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class CharacterAppearance(Base):
    __tablename__ = "character_appearances"

    player_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("players.id", ondelete="CASCADE"),
        primary_key=True
    )
    gender: Mapped[str] = mapped_column(String(20), default="male", nullable=False)
    character_model: Mapped[str] = mapped_column(String(50), default="normal_man", nullable=False)
    skin_tone: Mapped[str] = mapped_column(String(30), default="medium", nullable=False)
    hair_color: Mapped[str] = mapped_column(String(30), default="#00f5ff", nullable=False)
    eye_color: Mapped[str] = mapped_column(String(30), default="#00d2ff", nullable=False)
    height_scale: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    muscle_scale: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)

    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    player: Mapped["Player"] = relationship("Player", back_populates="appearance")
