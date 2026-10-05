import logging
from typing import List, Dict, Any, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.reward import RewardDefinition, PlayerReward
from app.models.rank import RankDefinition

logger = logging.getLogger("inner_awakening.rewards")


class RewardService:
    @staticmethod
    async def unlock_eligible_rewards(
        db: AsyncSession,
        player_id: str,
        current_rank_id: str,
        current_level: int,
        rank_definitions: List[RankDefinition]
    ) -> List[PlayerReward]:
        """
        Evaluates all active RewardDefinitions and creates unlocked PlayerReward
        records for any rewards the player qualifies for (by rank or level).
        """
        # Build set of achieved rank orders
        rank_order_map = {r.id: r.tier_order for r in rank_definitions}
        current_order = rank_order_map.get(current_rank_id, 1)

        # Get all active rewards
        stmt = select(RewardDefinition).where(RewardDefinition.is_active.is_(True))
        result = await db.execute(stmt)
        all_rewards = result.scalars().all()

        # Get existing unlocked rewards for this player
        existing_stmt = select(PlayerReward).where(PlayerReward.player_id == player_id)
        existing_result = await db.execute(existing_stmt)
        existing_map = {pr.reward_id: pr for pr in existing_result.scalars().all()}

        newly_unlocked: List[PlayerReward] = []

        for rdef in all_rewards:
            qualifies = False

            # Check rank requirement
            if rdef.unlock_rank_id:
                req_order = rank_order_map.get(rdef.unlock_rank_id, 999)
                if current_order >= req_order:
                    qualifies = True

            # Check level requirement
            if rdef.unlock_level is not None and current_level >= rdef.unlock_level:
                qualifies = True

            if qualifies:
                if rdef.id not in existing_map:
                    new_pr = PlayerReward(
                        player_id=player_id,
                        reward_id=rdef.id,
                        is_unlocked=True,
                        is_claimed=False
                    )
                    db.add(new_pr)
                    newly_unlocked.append(new_pr)
                    logger.info(f"Unlocked reward {rdef.name} ({rdef.id}) for player {player_id}")

        if newly_unlocked:
            await db.flush()

        return newly_unlocked

    @staticmethod
    async def get_player_rewards_catalog(
        db: AsyncSession,
        player_id: str
    ) -> List[Dict[str, Any]]:
        """Returns the full catalog of rewards with this player's unlock and claim status."""
        stmt = (
            select(RewardDefinition)
            .where(RewardDefinition.is_active.is_(True))
            .options(
                selectinload(RewardDefinition.item_definition),
                selectinload(RewardDefinition.rank_definition)
            )
        )
        result = await db.execute(stmt)
        rewards = result.scalars().all()

        pr_stmt = select(PlayerReward).where(PlayerReward.player_id == player_id)
        pr_result = await db.execute(pr_stmt)
        player_rewards = {pr.reward_id: pr for pr in pr_result.scalars().all()}

        catalog: List[Dict[str, Any]] = []
        for r in rewards:
            pr = player_rewards.get(r.id)
            is_unlocked = pr.is_unlocked if pr else False
            is_claimed = pr.is_claimed if pr else False

            item_info = None
            if r.item_definition:
                item_info = {
                    "item_id": r.item_definition.item_id,
                    "name": r.item_definition.name,
                    "category": r.item_definition.category,
                    "slot": r.item_definition.slot,
                    "rarity": r.item_definition.rarity,
                    "icon": r.item_definition.icon
                }

            catalog.append({
                "reward_id": r.id,
                "name": r.name,
                "reward_type": r.reward_type,
                "currency_type": r.currency_type,
                "currency_amount": r.currency_amount,
                "unlock_rank_id": r.unlock_rank_id,
                "unlock_rank_name": r.rank_definition.name if r.rank_definition else None,
                "unlock_level": r.unlock_level,
                "icon_asset_key": r.icon_asset_key,
                "is_unlocked": is_unlocked,
                "is_claimed": is_claimed,
                "claimed_at": pr.claimed_at.isoformat() if (pr and pr.claimed_at) else None,
                "item": item_info
            })

        return catalog


reward_service = RewardService()
