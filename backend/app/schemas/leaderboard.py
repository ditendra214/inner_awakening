from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class LeaderboardEntry(BaseModel):
    rank_position: int
    player_id: str
    username: str
    character_preset: str
    rank_tier: str
    rank_points: int
    level: int
    streak_days: int

    model_config = ConfigDict(from_attributes=True)


class LeaderboardResponse(BaseModel):
    timeframe: str
    total_participants: int
    entries: List[LeaderboardEntry]
    my_standing: Optional[LeaderboardEntry] = None
