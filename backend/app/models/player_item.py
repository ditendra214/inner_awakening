import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class PlayerItem(Base):
    __tablename__ = "player_items"
    __table_args__ = (
        UniqueConstraint("player_id", "item_id", name="uq_player_item"),
    )

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
    item_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("item_definitions.item_id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    acquired_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    player: Mapped["Player"] = relationship("Player", back_populates="inventory_items")
    item_definition: Mapped["ItemDefinition"] = relationship("ItemDefinition", back_populates="player_items")
