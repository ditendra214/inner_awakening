from datetime import datetime
from typing import Optional, List, Literal, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class WorkoutSubmitRequest(BaseModel):
    exercise_type: Literal["pushup", "squat", "plank", "jumping_jack", "burpee"]
    reps_completed: int = Field(..., ge=0, le=500, description="Count of completed repetitions")
    target_reps: int = Field(..., ge=0, le=500, description="Target repetition goal")
    form_accuracy: float = Field(..., ge=0.0, le=100.0, description="AI Pose tracking accuracy percentage")
    calories_burned: float = Field(..., ge=0.0, le=2000.0)
    duration_seconds: int = Field(..., ge=1, le=7200, description="Duration of exercise in seconds")
    
    # Advanced AI telemetry fields
    detected_reps: Optional[int] = Field(None, ge=0, description="Raw detected repetitions by AI")
    valid_reps: Optional[int] = Field(None, ge=0, description="Biomechanically validated repetitions")
    invalid_reps: Optional[int] = Field(None, ge=0, description="Invalid form repetitions")
    difficulty_level: Optional[str] = Field("NORMAL", description="EASY, NORMAL, HARD, EXTREME")
    session_id: Optional[str] = Field(None, description="Unique client session nonce")
    telemetry_hash: Optional[str] = Field(None, description="Cryptographic hash of camera pose telemetry")


class UnlockedRewardItem(BaseModel):
    item_id: str
    name: str
    slot: str
    rarity: str


class WorkoutSubmitResponse(BaseModel):
    session_id: str
    exercise_type: str
    reps_completed: int
    form_accuracy: float
    score: int = 0
    xp_earned: int
    rp_earned: int
    coins_earned: int
    level_up: bool
    old_level: int
    new_level: int
    rank_promoted: bool
    old_rank: str
    new_rank: str
    unlocked_items: List[UnlockedRewardItem] = []
    unlocked_rewards: List[Dict[str, Any]] = []
    streak_days: int
    progression: Optional[Dict[str, Any]] = None


class WorkoutSessionResponse(BaseModel):
    id: str
    player_id: str
    exercise_type: str
    reps_completed: int
    target_reps: int
    form_accuracy: float
    calories_burned: float
    duration_seconds: int
    xp_earned: int
    rp_earned: int
    coins_earned: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
