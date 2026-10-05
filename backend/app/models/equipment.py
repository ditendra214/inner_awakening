import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class PlayerEquipment(Base):
    __tablename__ = "player_equipment"
    __table_args__ = (
        UniqueConstraint("player_id", "slot", name="uq_player_equipment_slot"),
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
    slot: Mapped[str] = mapped_column(String(32), nullable=False)
    item_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("item_definitions.item_id", ondelete="CASCADE"),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    player: Mapped["Player"] = relationship("Player", back_populates="equipment")
    item_definition: Mapped["ItemDefinition"] = relationship("ItemDefinition", back_populates="equipped_instances")
