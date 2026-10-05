import math
from typing import Tuple, Dict

# Cumulative XP curve constant: XP(L) = round(120 * (L - 1)^1.75)
XP_EXPONENT = 1.75
XP_MULTIPLIER = 120

DIFFICULTY_MULTIPLIERS: Dict[str, float] = {
    "EASY": 0.8,
    "NORMAL": 1.0,
    "HARD": 1.3,
    "EXTREME": 1.6
}


class XPService:
    @staticmethod
    def get_xp_for_level(level: int) -> int:
        """Returns the cumulative XP required to reach a given level."""
        if level <= 1:
            return 0
        return int(round(XP_MULTIPLIER * math.pow(level - 1, XP_EXPONENT)))

    @classmethod
    def calculate_level_from_xp(cls, total_xp: int) -> Tuple[int, int, int, float]:
        """
        Calculates level metrics from total XP.
        Returns: (current_level, xp_into_current_level, xp_required_for_next, progress_percent)
        """
        if total_xp < 0:
            total_xp = 0

        level = 1
        while True:
            xp_next = cls.get_xp_for_level(level + 1)
            if total_xp < xp_next:
                break
            level += 1

        xp_current_base = cls.get_xp_for_level(level)
        xp_next_base = cls.get_xp_for_level(level + 1)
        xp_into_level = total_xp - xp_current_base
        xp_needed_for_next = xp_next_base - xp_current_base
        
        progress_pct = 0.0
        if xp_needed_for_next > 0:
            progress_pct = round(min(100.0, max(0.0, (xp_into_level / xp_needed_for_next) * 100.0)), 2)

        return level, xp_into_level, xp_needed_for_next, progress_pct

    @classmethod
    def calculate_workout_xp(
        cls,
        valid_reps: int,
        form_score: float,
        difficulty: str = "NORMAL",
        streak_days: int = 0
    ) -> int:
        """
        Calculates authoritatively awarded XP from verified workout telemetry.
        Base XP: 4 XP per valid rep
        Multipliers: Form accuracy (form_score / 100), Difficulty weight, Streak bonus.
        Completion bonus: +50 XP if valid reps >= 5.
        """
        if valid_reps <= 0:
            return 0

        diff_mult = DIFFICULTY_MULTIPLIERS.get(difficulty.upper(), 1.0)
        streak_bonus = 1.0 + min(0.25, streak_days * 0.05)  # Max +25% streak bonus
        form_factor = max(0.0, min(100.0, form_score)) / 100.0

        base_xp = valid_reps * 4.0
        earned_xp = int(round(base_xp * form_factor * diff_mult * streak_bonus))

        # Completion bonus
        if valid_reps >= 5 and form_score >= 50.0:
            earned_xp += 50

        return max(0, earned_xp)


xp_service = XPService()
