from datetime import datetime
from sqlalchemy import String, Integer, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class RankDefinition(Base):
    __tablename__ = "rank_definitions"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)  # 'E', 'D', 'C', 'B', 'A', 'S', 'NATIONAL', 'MONARCH'
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    tier_order: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)  # 1 to 8
    min_rp: Mapped[int] = mapped_column(Integer, nullable=False)
    max_rp: Mapped[int] = mapped_column(Integer, nullable=False)
    icon_asset_key: Mapped[str] = mapped_column(String(100), nullable=False)
    color_hex: Mapped[str] = mapped_column(String(16), nullable=False)
    demotion_allowed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    demotion_floor_rp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
