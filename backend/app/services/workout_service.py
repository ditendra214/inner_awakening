import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Tuple
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.player import Player
from app.models.workout import WorkoutSession
from app.models.item import ItemDefinition
from app.models.player_item import PlayerItem
from app.models.audit import ProgressionAuditLog
from app.models.leaderboard import LeaderboardEntry
from app.schemas.workout import (
    WorkoutSubmitRequest,
    WorkoutSubmitResponse,
    UnlockedRewardItem
)
from app.services.xp_service import xp_service
from app.services.rank_service import rank_service
from app.services.reward_service import reward_service
from app.services.progression_service import progression_service

logger = logging.getLogger("inner_awakening.workout")


class WorkoutService:
    async def submit_workout(
        self,
        db: AsyncSession,
        player: Player,
        data: WorkoutSubmitRequest
    ) -> WorkoutSubmitResponse:
        """
        Authoritatively validates workout telemetry, computes rewards,
        updates player progression and stats, checks for level up / rank promo,
        unlocks eligible rewards, updates leaderboards, and logs progression audit.
        """
        # 1. Biomechanical Anti-Cheat Rate Limiting
        # Maximum physiologically possible rep velocity: ~1.8 reps per second
        if data.duration_seconds > 0:
            total_reps = data.detected_reps if data.detected_reps is not None else data.reps_completed
            rep_velocity = total_reps / data.duration_seconds
            if rep_velocity > 1.8:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Telemetry anomaly detected: Repetition cadence exceeds human physiological maximum."
                )

        # 2. Determine Valid Reps & Difficulty
        valid_reps = data.valid_reps if data.valid_reps is not None else data.reps_completed
        detected_reps = data.detected_reps if data.detected_reps is not None else data.reps_completed
        invalid_reps = data.invalid_reps if data.invalid_reps is not None else max(0, detected_reps - valid_reps)
        difficulty = (data.difficulty_level or "NORMAL").upper()

        # 3. Streak Updating
        now = datetime.now(timezone.utc)
        if player.last_workout_at:
            last_at = player.last_workout_at
            if last_at.tzinfo is None:
                last_at = last_at.replace(tzinfo=timezone.utc)
            delta = now - last_at
            if delta <= timedelta(hours=36):
                if delta >= timedelta(hours=18):
                    player.streak_days += 1
            else:
                player.streak_days = 1
        else:
            player.streak_days = 1
        player.last_workout_at = now

        # 4. Authoritative XP, RP, and Workout Score Calculations
        xp_earned = xp_service.calculate_workout_xp(
            valid_reps=valid_reps,
            form_score=data.form_accuracy,
            difficulty=difficulty,
            streak_days=player.streak_days
        )
        rp_earned = rank_service.calculate_workout_rp(
            valid_reps=valid_reps,
            form_score=data.form_accuracy,
            difficulty=difficulty,
            streak_days=player.streak_days
        )
        workout_score = valid_reps * 10 + int(data.form_accuracy * 5)
        coins_earned = int(valid_reps * 2)

        # 5. Fetch Authoritative Progression State
        progression = await progression_service.get_or_create_progression(db, player.id)
        rank_defs = await rank_service.get_all_ranks(db)

        old_level = progression.level
        old_rp = progression.rank_points
        old_rank_id = progression.current_rank_id

        # 6. Apply Progression Updates
        progression.current_xp += xp_earned
        progression.rank_points += rp_earned
        progression.total_workouts += 1
        progression.valid_reps += valid_reps
        progression.total_score += workout_score
        progression.calories_burned += data.calories_burned
        progression.current_streak = player.streak_days
        progression.best_streak = max(progression.best_streak, player.streak_days)

        # Sync back to Player table
        player.xp = progression.current_xp
        player.rank_points = progression.rank_points
        player.fit_coins += coins_earned

        # 7. Level Evaluation
        new_level, _, _, _ = xp_service.calculate_level_from_xp(progression.current_xp)
        level_up = new_level > old_level
        progression.level = new_level
        player.level = new_level
        if level_up:
            player.fit_coins += 200 * (new_level - old_level)
            player.blue_crystals += 10 * (new_level - old_level)

        # 8. Rank Transition Evaluation
        cur_rank_def, next_rank_def, rp_to_next, rank_progress_pct = rank_service.determine_rank_from_rp(
            progression.rank_points, rank_defs
        )
        rank_promoted = cur_rank_def.tier_order > (
            next((r.tier_order for r in rank_defs if r.id == old_rank_id), 1)
        )
        progression.current_rank_id = cur_rank_def.id
        player.rank_tier = cur_rank_def.id

        # 9. Audit Logging if rank or level changed
        if rank_promoted or level_up:
            audit = ProgressionAuditLog(
                player_id=player.id,
                event_type="RANK_UP" if rank_promoted else "LEVEL_UP",
                old_rank_id=old_rank_id,
                new_rank_id=cur_rank_def.id,
                old_rp=old_rp,
                new_rp=progression.rank_points,
                delta_rp=rp_earned,
                old_level=old_level,
                new_level=new_level,
                source_reference=f"WORKOUT:{data.session_id or 'SESSION'}"
            )
            db.add(audit)

        # 10. Unlock Eligible Rewards
        newly_unlocked = await reward_service.unlock_eligible_rewards(
            db=db,
            player_id=player.id,
            current_rank_id=cur_rank_def.id,
            current_level=new_level,
            rank_definitions=rank_defs
        )

        # Check legacy unlocked items from catalog for backwards compatibility
        unlocked_items: List[UnlockedRewardItem] = []
        if level_up:
            level_items_stmt = select(ItemDefinition).where(
                ItemDefinition.unlock_type == "LEVEL",
                ItemDefinition.is_active.is_(True)
            )
            res = await db.execute(level_items_stmt)
            for item in res.scalars().all():
                try:
                    req_level = int(item.unlock_value) if item.unlock_value else 999
                    if old_level < req_level <= new_level:
                        existing = await db.execute(
                            select(PlayerItem).where(
                                PlayerItem.player_id == player.id,
                                PlayerItem.item_id == item.item_id
                            )
                        )
                        if not existing.scalar_one_or_none():
                            db.add(PlayerItem(player_id=player.id, item_id=item.item_id))
                            unlocked_items.append(
                                UnlockedRewardItem(
                                    item_id=item.item_id,
                                    name=item.name,
                                    slot=item.slot,
                                    rarity=item.rarity
                                )
                            )
                except ValueError:
                    pass

        # 11. Record Workout Session
        session_id_val = data.session_id or f"session_{uuid.uuid4().hex[:12]}"
        workout_session = WorkoutSession(
            player_id=player.id,
            exercise_type=data.exercise_type,
            reps_completed=valid_reps,
            target_reps=data.target_reps,
            form_accuracy=data.form_accuracy,
            calories_burned=data.calories_burned,
            duration_seconds=data.duration_seconds,
            detected_reps=detected_reps,
            valid_reps=valid_reps,
            invalid_reps=invalid_reps,
            difficulty_level=difficulty,
            workout_score=workout_score,
            session_id=session_id_val,
            anti_cheat_status="PASSED",
            xp_earned=xp_earned,
            rp_earned=rp_earned,
            coins_earned=coins_earned,
            is_verified=True
        )
        db.add(workout_session)

        # 12. Update Leaderboard Entry (Backing store)
        lb_stmt = select(LeaderboardEntry).where(
            LeaderboardEntry.player_id == player.id,
            LeaderboardEntry.season_id == progression.season_id,
            LeaderboardEntry.leaderboard_type == "GLOBAL"
        )
        lb_res = await db.execute(lb_stmt)
        lb_entry = lb_res.scalar_one_or_none()
        if not lb_entry:
            lb_entry = LeaderboardEntry(
                season_id=progression.season_id,
                leaderboard_type="GLOBAL",
                region_code="GLOBAL",
                player_id=player.id,
                rank_points=progression.rank_points,
                total_score=progression.total_score,
                rank_tier=cur_rank_def.id,
                total_workouts=progression.total_workouts,
                avg_form_score=data.form_accuracy
            )
            db.add(lb_entry)
        else:
            lb_entry.rank_points = progression.rank_points
            lb_entry.total_score = progression.total_score
            lb_entry.rank_tier = cur_rank_def.id
            lb_entry.total_workouts = progression.total_workouts
            lb_entry.avg_form_score = round(
                (lb_entry.avg_form_score * (progression.total_workouts - 1) + data.form_accuracy) / progression.total_workouts,
                2
            )

        # 13. Commit Transaction
        await db.commit()
        await db.refresh(workout_session)

        # 14. Compile Unlocked Rewards Info
        unlocked_rewards_list = [
            {"reward_id": r.reward_id, "is_unlocked": True, "is_claimed": False}
            for r in newly_unlocked
        ]

        # 15. Progression Summary
        prog_summary = await progression_service.get_player_progression_summary(db, player.id)

        return WorkoutSubmitResponse(
            session_id=session_id_val,
            exercise_type=data.exercise_type,
            reps_completed=valid_reps,
            form_accuracy=data.form_accuracy,
            score=workout_score,
            xp_earned=xp_earned,
            rp_earned=rp_earned,
            coins_earned=coins_earned,
            level_up=level_up,
            old_level=old_level,
            new_level=new_level,
            rank_promoted=rank_promoted,
            old_rank=old_rank_id,
            new_rank=cur_rank_def.id,
            unlocked_items=unlocked_items,
            unlocked_rewards=unlocked_rewards_list,
            streak_days=player.streak_days,
            progression=prog_summary
        )

    async def get_history(
        self,
        db: AsyncSession,
        player_id: str,
        limit: int = 20
    ) -> List[WorkoutSession]:
        stmt = (
            select(WorkoutSession)
            .where(WorkoutSession.player_id == player_id)
            .order_by(WorkoutSession.created_at.desc())
            .limit(limit)
        )
        res = await db.execute(stmt)
        return list(res.scalars().all())


workout_service = WorkoutService()
