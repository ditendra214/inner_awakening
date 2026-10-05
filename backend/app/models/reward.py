import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class RewardDefinition(Base):
    __tablename__ = "reward_definitions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    reward_type: Mapped[str] = mapped_column(String(32), nullable=False)  # 'COSMETIC', 'CURRENCY', 'XP', 'TITLE', 'BADGE'
    item_id: Mapped[Optional[str]] = mapped_column(
        String(64),
        ForeignKey("item_definitions.item_id", ondelete="SET NULL"),
        nullable=True
    )
    currency_type: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)  # 'FIT_COINS', 'BLUE_CRYSTALS'
    currency_amount: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    unlock_rank_id: Mapped[Optional[str]] = mapped_column(
        String(32),
        ForeignKey("rank_definitions.id", ondelete="SET NULL"),
        nullable=True
    )
    unlock_level: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    season_id: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    icon_asset_key: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    item_definition: Mapped[Optional["ItemDefinition"]] = relationship("ItemDefinition")
    rank_definition: Mapped[Optional["RankDefinition"]] = relationship("RankDefinition")


class PlayerReward(Base):
    __tablename__ = "player_rewards"
    __table_args__ = (
        UniqueConstraint("player_id", "reward_id", name="uq_player_reward"),
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
    reward_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("reward_definitions.id", ondelete="CASCADE"),
        nullable=False
    )
    is_unlocked: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_claimed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    unlocked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    claimed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    idempotency_key: Mapped[Optional[str]] = mapped_column(String(100), unique=True, nullable=True)

    # Relationships
    player: Mapped["Player"] = relationship("Player", back_populates="rewards")
    reward_definition: Mapped["RewardDefinition"] = relationship("RewardDefinition")
