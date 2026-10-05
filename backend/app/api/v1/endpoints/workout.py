from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_player
from app.models.player import Player
from app.schemas.workout import (
    WorkoutSubmitRequest,
    WorkoutSubmitResponse,
    WorkoutSessionResponse
)
from app.services.workout_service import workout_service

router = APIRouter()


@router.post(
    "/submit",
    response_model=WorkoutSubmitResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit AI Exercise Session & Claim Progression Rewards"
)
async def submit_workout_session(
    data: WorkoutSubmitRequest,
    current_player: Player = Depends(get_current_player),
    db: AsyncSession = Depends(get_db)
) -> WorkoutSubmitResponse:
    """
    Authoritative workout reward endpoint:
    - Validates AI camera rep telemetry and anti-cheat rate limits
    - Computes exercise XP, Rank Points, and Fit Coins based on form accuracy
    - Checks level up thresholds and updates player level
    - Checks rank promotions and updates hunter tier
    - Automatically unlocks reward equipment and adds to player's inventory
    - Records persistent workout session
    """
    return await workout_service.submit_workout(db, current_player, data)


@router.get(
    "/history",
    response_model=List[WorkoutSessionResponse],
    summary="Get Hunter Workout History"
)
async def get_workout_history(
    limit: int = Query(20, ge=1, le=100),
    current_player: Player = Depends(get_current_player),
    db: AsyncSession = Depends(get_db)
) -> List[WorkoutSessionResponse]:
    """Retrieves authenticated hunter's exercise logs."""
    sessions = await workout_service.get_history(db, current_player.id, limit)
    return [WorkoutSessionResponse.model_validate(s) for s in sessions]
