import math
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.rank import RankDefinition

DIFFICULTY_RP_MULTIPLIERS: Dict[str, float] = {
    "EASY": 0.8,
    "NORMAL": 1.0,
    "HARD": 1.3,
    "EXTREME": 1.6
}

# Fallback in-memory ranks if database definitions are not yet queried
DEFAULT_RANKS: List[Dict[str, Any]] = [
    {"id": "E", "name": "E-Rank", "tier_order": 1, "min_rp": 0, "max_rp": 499, "color_hex": "#CD7F32", "demotion_allowed": False, "demotion_floor_rp": 0},
    {"id": "D", "name": "D-Rank", "tier_order": 2, "min_rp": 500, "max_rp": 999, "color_hex": "#8A9EA7", "demotion_allowed": False, "demotion_floor_rp": 0},
    {"id": "C", "name": "C-Rank", "tier_order": 3, "min_rp": 1000, "max_rp": 1499, "color_hex": "#00E676", "demotion_allowed": False, "demotion_floor_rp": 0},
    {"id": "B", "name": "B-Rank", "tier_order": 4, "min_rp": 1500, "max_rp": 2199, "color_hex": "#00B0FF", "demotion_allowed": True, "demotion_floor_rp": 1450},
    {"id": "A", "name": "A-Rank", "tier_order": 5, "min_rp": 2200, "max_rp": 2999, "color_hex": "#B388FF", "demotion_allowed": True, "demotion_floor_rp": 2150},
    {"id": "S", "name": "S-Rank", "tier_order": 6, "min_rp": 3000, "max_rp": 3999, "color_hex": "#FFD700", "demotion_allowed": True, "demotion_floor_rp": 2950},
    {"id": "NATIONAL", "name": "National Rank", "tier_order": 7, "min_rp": 4000, "max_rp": 4999, "color_hex": "#00E5FF", "demotion_allowed": True, "demotion_floor_rp": 3950},
    {"id": "MONARCH", "name": "Monarch", "tier_order": 8, "min_rp": 5000, "max_rp": 999999, "color_hex": "#FFA000", "demotion_allowed": False, "demotion_floor_rp": 4950}
]


class RankService:
    @staticmethod
    def calculate_workout_rp(
        valid_reps: int,
        form_score: float,
        difficulty: str = "NORMAL",
        streak_days: int = 0
    ) -> int:
        """
        Calculates authoritative Rank Points awarded from verified workout.
        Rules:
        - Must have at least 5 valid reps and form_score >= 50.0 to earn RP.
        - RP formula: round(valid_reps * 1.5 * (form_score/100)^1.5 * diff_mult * streak_bonus)
        """
        if valid_reps < 5 or form_score < 50.0:
            return 0

        form_ratio = max(0.0, min(100.0, form_score)) / 100.0
        form_multiplier = math.pow(form_ratio, 1.5)

        diff_mult = DIFFICULTY_RP_MULTIPLIERS.get(difficulty.upper(), 1.0)
        streak_bonus = 1.0 + min(0.25, streak_days * 0.05)

        base_rp = valid_reps * 1.5
        earned_rp = int(round(base_rp * form_multiplier * diff_mult * streak_bonus))

        return max(0, earned_rp)

    @staticmethod
    async def get_all_ranks(db: AsyncSession) -> List[RankDefinition]:
        """Fetch all rank definitions ordered by tier_order ascending."""
        stmt = select(RankDefinition).order_by(RankDefinition.tier_order.asc())
        result = await db.execute(stmt)
        ranks = list(result.scalars().all())
        return ranks

    @classmethod
    def determine_rank_from_rp(
        cls,
        rank_points: int,
        rank_definitions: List[RankDefinition]
    ) -> Tuple[RankDefinition, Optional[RankDefinition], int, float]:
        """
        Given RP and rank definitions, returns:
        (current_rank, next_rank, rp_to_next_rank, rank_progress_percentage)
        """
        if not rank_definitions:
            raise ValueError("No rank definitions provided.")

        sorted_ranks = sorted(rank_definitions, key=lambda r: r.tier_order)
        current_rank = sorted_ranks[0]
        next_rank: Optional[RankDefinition] = None

        for rank in sorted_ranks:
            if rank.min_rp <= rank_points:
                current_rank = rank
            else:
                next_rank = rank
                break

        # Calculate progress within tier towards next tier
        if next_rank:
            tier_rp_span = next_rank.min_rp - current_rank.min_rp
            rp_in_tier = rank_points - current_rank.min_rp
            rp_to_next = max(0, next_rank.min_rp - rank_points)
            progress_pct = round(min(100.0, max(0.0, (rp_in_tier / tier_rp_span) * 100.0)), 2)
        else:
            # At apex rank (MONARCH)
            rp_to_next = 0
            progress_pct = 100.0

        return current_rank, next_rank, rp_to_next, progress_pct

    @classmethod
    def check_rank_transition(
        cls,
        old_rp: int,
        new_rp: int,
        rank_definitions: List[RankDefinition]
    ) -> Tuple[bool, bool, RankDefinition, RankDefinition]:
        """
        Determines if an RP delta resulted in a promotion or demotion.
        Returns: (is_rank_up, is_rank_down, old_rank, new_rank)
        """
        old_rank, _, _, _ = cls.determine_rank_from_rp(old_rp, rank_definitions)
        new_rank, _, _, _ = cls.determine_rank_from_rp(new_rp, rank_definitions)

        is_rank_up = new_rank.tier_order > old_rank.tier_order
        is_rank_down = new_rank.tier_order < old_rank.tier_order and old_rank.demotion_allowed

        return is_rank_up, is_rank_down, old_rank, new_rank


rank_service = RankService()
