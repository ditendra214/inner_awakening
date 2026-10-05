from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict, Field


class AppearanceBase(BaseModel):
    gender: str = "male"
    character_model: str = "normal_man"
    skin_tone: str = "medium"
    hair_color: str = "#00f5ff"
    eye_color: str = "#00d2ff"
    height_scale: float = 1.0
    muscle_scale: float = 1.0


class AppearanceUpdate(BaseModel):
    skin_tone: Optional[str] = None
    hair_color: Optional[str] = None
    eye_color: Optional[str] = None
    height_scale: Optional[float] = Field(None, ge=0.7, le=1.3)
    muscle_scale: Optional[float] = Field(None, ge=0.7, le=1.3)


class AppearanceResponse(AppearanceBase):
    player_id: str
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class EquipmentSlotItem(BaseModel):
    slot: str
    item_id: str
    model_config = ConfigDict(from_attributes=True)


class PlayerSummaryResponse(BaseModel):
    id: str
    username: str
    character_preset: str
    level: int
    rank_tier: str
    rank_points: int
    streak_days: int

    model_config = ConfigDict(from_attributes=True)


class PlayerResponse(BaseModel):
    id: str
    username: str
    email: str
    character_preset: str
    level: int
    xp: int
    rank_points: int
    rank_tier: str
    fit_coins: int
    blue_crystals: int
    streak_days: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    appearance: Optional[AppearanceResponse] = None
    equipped_slots: Dict[str, str] = {}

    model_config = ConfigDict(from_attributes=True)


class DetailedProfileResponse(BaseModel):
    player: PlayerResponse
    level_progress: int
    level_threshold: int
    level_progress_percent: float
    stat_totals: Dict[str, int]
