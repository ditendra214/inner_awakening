from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_player
from app.models.player import Player
from app.repositories.player_repo import player_repository
from app.schemas.player import (
    PlayerResponse,
    DetailedProfileResponse,
    AppearanceUpdate,
    AppearanceResponse,
    PlayerSummaryResponse
)
from app.services.auth_service import serialize_player
from app.services.progression_service import progression_service
from app.services.rank_service import rank_service

router = APIRouter()


@router.get(
    "/me",
    response_model=PlayerResponse,
    summary="Get Current Player Profile"
)
async def get_my_profile(
    current_player: Player = Depends(get_current_player)
) -> PlayerResponse:
    return serialize_player(current_player)


@router.get(
    "/me/profile",
    response_model=DetailedProfileResponse,
    summary="Get Detailed Hunter Profile & Progression Telemetry"
)
async def get_my_detailed_profile(
    current_player: Player = Depends(get_current_player)
) -> DetailedProfileResponse:
    # 1. Calculate level progression metrics
    level, xp_into_level, xp_needed = progression_service.calculate_level_from_xp(current_player.xp)
    percent = round((xp_into_level / xp_needed) * 100, 2) if xp_needed > 0 else 100.0

    # 2. Calculate equipped stat totals
    stat_totals = progression_service.calculate_stat_totals(current_player.equipment)

    return DetailedProfileResponse(
        player=serialize_player(current_player),
        level_progress=xp_into_level,
        level_threshold=xp_needed,
        level_progress_percent=percent,
        stat_totals=stat_totals
    )


@router.put(
    "/me/appearance",
    response_model=AppearanceResponse,
    summary="Customize Character 3D Appearance"
)
async def update_appearance(
    appearance_in: AppearanceUpdate,
    current_player: Player = Depends(get_current_player),
    db: AsyncSession = Depends(get_db)
) -> AppearanceResponse:
    """Updates cosmetic appearance for the player's 3D character."""
    appearance = current_player.appearance
    if not appearance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character appearance record not found."
        )

    if appearance_in.skin_tone is not None:
        appearance.skin_tone = appearance_in.skin_tone
    if appearance_in.hair_color is not None:
        appearance.hair_color = appearance_in.hair_color
    if appearance_in.eye_color is not None:
        appearance.eye_color = appearance_in.eye_color
    if appearance_in.height_scale is not None:
        appearance.height_scale = appearance_in.height_scale
    if appearance_in.muscle_scale is not None:
        appearance.muscle_scale = appearance_in.muscle_scale

    await db.commit()
    await db.refresh(appearance)
    return AppearanceResponse.model_validate(appearance)


@router.get(
    "/progression",
    summary="Get Authoritative Player Progression State (Single Source of Truth)",
    response_model=Dict[str, Any]
)
async def get_player_progression(
    db: AsyncSession = Depends(get_db),
    current_player: Player = Depends(get_current_player)
) -> Dict[str, Any]:
    """
    Returns unified player progression: Level, XP, Rank, RP, streaks,
    and season workout statistics consumed by Rank Page, Lobby, and Profile.
    """
    return await progression_service.get_player_progression_summary(db, current_player.id)


@router.get(
    "/rank",
    summary="Get Detailed Rank Hierarchy and Player Position",
    response_model=Dict[str, Any]
)
async def get_player_rank_details(
    db: AsyncSession = Depends(get_db),
    current_player: Player = Depends(get_current_player)
) -> Dict[str, Any]:
    """
    Returns player's current rank tier, next milestone, progress %,
    and the full 8-tier hierarchy ladder for visual rendering.
    """
    summary = await progression_service.get_player_progression_summary(db, current_player.id)
    rank_defs = await rank_service.get_all_ranks(db)
    
    ladder = [
        {
            "id": r.id,
            "name": r.name,
            "tier_order": r.tier_order,
            "min_rp": r.min_rp,
            "max_rp": r.max_rp,
            "color_hex": r.color_hex,
            "icon_asset_key": r.icon_asset_key,
            "is_current": r.id == summary["current_rank_id"],
            "is_unlocked": r.tier_order <= summary["current_rank_order"]
        }
        for r in rank_defs
    ]
    
    return {
        "progression": summary,
        "rank_ladder": ladder
    }


@router.get(
    "/stats",
    summary="Get Player Fitness and Workout Statistics",
    response_model=Dict[str, Any]
)
async def get_player_stats(
    db: AsyncSession = Depends(get_db),
    current_player: Player = Depends(get_current_player)
) -> Dict[str, Any]:
    summary = await progression_service.get_player_progression_summary(db, current_player.id)
    return {
        "total_workouts": summary["total_workouts"],
        "valid_reps": summary["valid_reps"],
        "total_score": summary["total_score"],
        "calories_burned": summary["calories_burned"],
        "current_streak": summary["current_streak"],
        "best_streak": summary["best_streak"],
        "level": summary["level"],
        "rank_points": summary["rank_points"],
        "current_rank_name": summary["current_rank_name"]
    }


@router.get(
    "/{player_id}",
    response_model=PlayerSummaryResponse,
    summary="Inspect Another Hunter"
)
async def get_player_by_id(
    player_id: str,
    db: AsyncSession = Depends(get_db)
) -> PlayerSummaryResponse:
    """Public lookup for hunter status cards."""
    player = await player_repository.get_by_id(db, player_id)
    if not player or not player.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hunter not found."
        )
    return PlayerSummaryResponse.model_validate(player)
