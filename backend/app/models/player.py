import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, BigInteger, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Player(Base):
    __tablename__ = "players"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Character Selection: 'normal_man' or 'michelle'
    character_preset: Mapped[str] = mapped_column(String(50), default="normal_man", nullable=False)

    # RPG & Fitness Progression
    level: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    xp: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    rank_points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    rank_tier: Mapped[str] = mapped_column(String(20), default="E-RANK", nullable=False)
    
    # In-game Currencies
    fit_coins: Mapped[int] = mapped_column(BigInteger, default=500, nullable=False)
    blue_crystals: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    
    # Workout Streak
    streak_days: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_workout_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    appearance: Mapped["CharacterAppearance"] = relationship("CharacterAppearance", back_populates="player", uselist=False, cascade="all, delete-orphan")
    inventory_items: Mapped[List["PlayerItem"]] = relationship("PlayerItem", back_populates="player", cascade="all, delete-orphan")
    equipment: Mapped[List["PlayerEquipment"]] = relationship("PlayerEquipment", back_populates="player", cascade="all, delete-orphan")
    workout_sessions: Mapped[List["WorkoutSession"]] = relationship("WorkoutSession", back_populates="player", cascade="all, delete-orphan")
    progression: Mapped[Optional["PlayerProgression"]] = relationship("PlayerProgression", back_populates="player", uselist=False, cascade="all, delete-orphan")
    rewards: Mapped[List["PlayerReward"]] = relationship("PlayerReward", back_populates="player", cascade="all, delete-orphan")
    audit_logs: Mapped[List["ProgressionAuditLog"]] = relationship("ProgressionAuditLog", back_populates="player", cascade="all, delete-orphan")
