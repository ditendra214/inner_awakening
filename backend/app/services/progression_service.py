import logging
from typing import Dict, Any, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.progression import PlayerProgression
from app.models.player import Player
from app.services.xp_service import xp_service
from app.services.rank_service import rank_service

logger = logging.getLogger("inner_awakening.progression")


class ProgressionService:
    @staticmethod
    def calculate_level_from_xp(total_xp: int):
        level, xp_into_level, xp_needed, _ = xp_service.calculate_level_from_xp(total_xp)
        return level, xp_into_level, xp_needed

    @staticmethod
    def get_xp_for_level(level: int) -> int:
        return xp_service.get_xp_for_level(level)

    @staticmethod
    def determine_rank_tier(rank_points: int) -> str:
        if rank_points >= 5000:
            return "MONARCH"
        elif rank_points >= 4000:
            return "NATIONAL"
        elif rank_points >= 3000:
            return "S"
        elif rank_points >= 2200:
            return "A"
        elif rank_points >= 1500:
            return "B"
        elif rank_points >= 1000:
            return "C"
        elif rank_points >= 500:
            return "D"
        return "E"
    @staticmethod
    async def get_or_create_progression(
        db: AsyncSession,
        player_id: str
    ) -> PlayerProgression:
        """
        Retrieves the authoritative PlayerProgression record, creating and initializing
        it from the player record if it does not yet exist.
        """
        stmt = (
            select(PlayerProgression)
            .where(PlayerProgression.player_id == player_id)
            .options(selectinload(PlayerProgression.rank_definition))
        )
        result = await db.execute(stmt)
        progression = result.scalar_one_or_none()

        if not progression:
            # Fetch player to seed progression values
            player_stmt = select(Player).where(Player.id == player_id)
            player_res = await db.execute(player_stmt)
            player = player_res.scalar_one_or_none()
            if not player:
                raise ValueError(f"Player {player_id} not found.")

            # Map old rank_tier string if necessary
            current_rank_id = player.rank_tier.replace("-RANK", "").strip().upper()
            if current_rank_id not in ("E", "D", "C", "B", "A", "S", "NATIONAL", "MONARCH"):
                current_rank_id = "E"

            progression = PlayerProgression(
                player_id=player_id,
                level=player.level,
                current_xp=player.xp,
                current_rank_id=current_rank_id,
                rank_points=player.rank_points,
                season_id="season_1",
                total_workouts=0,
                valid_reps=0,
                total_score=0,
                calories_burned=0.0,
                current_streak=player.streak_days,
                best_streak=player.streak_days
            )
            db.add(progression)
            await db.commit()
            await db.refresh(progression)

        return progression

    @classmethod
    async def get_player_progression_summary(
        cls,
        db: AsyncSession,
        player_id: str
    ) -> Dict[str, Any]:
        """
        Generates the comprehensive, unified PlayerProgression state consumed
        by the Rank Page, Lobby, Profile, and Leaderboards.
        """
        progression = await cls.get_or_create_progression(db, player_id)
        
        # Player identity
        player_stmt = select(Player).where(Player.id == player_id)
        player_res = await db.execute(player_stmt)
        player = player_res.scalar_one_or_none()
        username = player.username if player else "Hunter"

        # 1. Level & XP Calculations
        level, xp_into_level, xp_needed, xp_progress_pct = xp_service.calculate_level_from_xp(progression.current_xp)

        # 2. Rank & RP Calculations
        rank_defs = await rank_service.get_all_ranks(db)
        cur_rank, next_rank, rp_to_next, rank_progress_pct = rank_service.determine_rank_from_rp(
            progression.rank_points, rank_defs
        )

        return {
            "player_id": progression.player_id,
            "username": username,
            "character_preset": player.character_preset if player else "normal_man",
            # General Progression
            "level": level,
            "current_xp": progression.current_xp,
            "xp_into_level": xp_into_level,
            "xp_required_for_next_level": xp_needed,
            "level_progress_percentage": xp_progress_pct,
            # Competitive Rank Progression
            "current_rank_id": cur_rank.id,
            "current_rank_name": cur_rank.name,
            "current_rank_order": cur_rank.tier_order,
            "rank_color_hex": cur_rank.color_hex,
            "rank_points": progression.rank_points,
            "rank_floor_rp": cur_rank.min_rp,
            "rank_ceiling_rp": cur_rank.max_rp,
            "next_rank_id": next_rank.id if next_rank else None,
            "next_rank_name": next_rank.name if next_rank else None,
            "rp_to_next_rank": rp_to_next,
            "rank_progress_percentage": rank_progress_pct,
            # Season & Fitness Stats
            "season_id": progression.season_id,
            "total_workouts": progression.total_workouts,
            "valid_reps": progression.valid_reps,
            "total_score": progression.total_score,
            "calories_burned": round(progression.calories_burned, 1),
            "current_streak": progression.current_streak,
            "best_streak": progression.best_streak,
            # Currencies
            "fit_coins": player.fit_coins if player else 0,
            "blue_crystals": player.blue_crystals if player else 0,
            "updated_at": progression.updated_at.isoformat() if progression.updated_at else None
        }

    @staticmethod
    def calculate_stat_totals(equipped_items: list) -> Dict[str, int]:
        """Calculates aggregated stat bonuses from currently equipped gear."""
        totals = {
            "strength": 0,
            "agility": 0,
            "stamina": 0,
            "mana": 0
        }
        for eq in equipped_items:
            if eq.item_definition:
                totals["strength"] += eq.item_definition.strength_bonus
                totals["agility"] += eq.item_definition.agility_bonus
                totals["stamina"] += eq.item_definition.stamina_bonus
                totals["mana"] += eq.item_definition.mana_bonus
        return totals


progression_service = ProgressionService()
