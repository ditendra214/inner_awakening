from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_player
from app.models.player import Player
from app.schemas.leaderboard import LeaderboardResponse
from app.services.leaderboard_service import leaderboard_service

router = APIRouter()


@router.get(
    "",
    response_model=LeaderboardResponse,
    summary="Get Global Hunter Rank Leaderboard"
)
async def get_leaderboard_root(
    timeframe: str = Query("global", description="global, weekly, daily"),
    limit: int = Query(50, ge=1, le=100),
    current_player: Player = Depends(get_current_player),
    db: AsyncSession = Depends(get_db)
) -> LeaderboardResponse:
    """Returns top ranked fitness hunters worldwide and current player's standing."""
    return await leaderboard_service.get_leaderboard(
        db=db,
        timeframe=timeframe,
        limit=limit,
        current_player_id=current_player.id
    )


@router.get(
    "/global",
    response_model=LeaderboardResponse,
    summary="Get Global Ranked Leaderboard"
)
async def get_global_leaderboard(
    limit: int = Query(50, ge=1, le=100),
    current_player: Player = Depends(get_current_player),
    db: AsyncSession = Depends(get_db)
) -> LeaderboardResponse:
    """Returns worldwide server-authoritative leaderboard."""
    return await leaderboard_service.get_leaderboard(
        db=db,
        timeframe="global",
        limit=limit,
        current_player_id=current_player.id
    )


@router.get(
    "/regional",
    response_model=LeaderboardResponse,
    summary="Get Regional Ranked Leaderboard"
)
async def get_regional_leaderboard(
    region: str = Query("US", description="Region code e.g. US, EU, ASIA"),
    limit: int = Query(50, ge=1, le=100),
    current_player: Player = Depends(get_current_player),
    db: AsyncSession = Depends(get_db)
) -> LeaderboardResponse:
    """Returns region-specific ranked leaderboard."""
    return await leaderboard_service.get_leaderboard(
        db=db,
        timeframe=f"regional_{region.lower()}",
        limit=limit,
        current_player_id=current_player.id
    )


@router.get(
    "/friends",
    response_model=LeaderboardResponse,
    summary="Get Friends Ranked Leaderboard"
)
async def get_friends_leaderboard(
    limit: int = Query(50, ge=1, le=100),
    current_player: Player = Depends(get_current_player),
    db: AsyncSession = Depends(get_db)
) -> LeaderboardResponse:
    """Returns friends-filtered leaderboard."""
    return await leaderboard_service.get_leaderboard(
        db=db,
        timeframe="friends",
        limit=limit,
        current_player_id=current_player.id
    )


@router.get(
    "/seasonal",
    response_model=LeaderboardResponse,
    summary="Get Current Season Ranked Leaderboard"
)
async def get_seasonal_leaderboard(
    season_id: str = Query("season_1", description="Season identifier"),
    limit: int = Query(50, ge=1, le=100),
    current_player: Player = Depends(get_current_player),
    db: AsyncSession = Depends(get_db)
) -> LeaderboardResponse:
    """Returns active season leaderboard."""
    return await leaderboard_service.get_leaderboard(
        db=db,
        timeframe=f"season_{season_id}",
        limit=limit,
        current_player_id=current_player.id
    )
