from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, Boolean, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class ItemDefinition(Base):
    __tablename__ = "item_definitions"

    item_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    slot: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    rarity: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    icon: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    model_path: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    material_variant: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    
    # RPG Stat Modifiers
    strength_bonus: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    agility_bonus: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    stamina_bonus: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    mana_bonus: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    # Unlock Requirements
    unlock_type: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)  # 'DEFAULT', 'LEVEL', 'RANK', 'WORKOUT', 'SHOP'
    unlock_value: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    unlock_label: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    player_items: Mapped[List["PlayerItem"]] = relationship("PlayerItem", back_populates="item_definition")
    equipped_instances: Mapped[List["PlayerEquipment"]] = relationship("PlayerEquipment", back_populates="item_definition")
