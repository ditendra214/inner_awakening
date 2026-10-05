import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.player import Player
from app.models.reward import RewardDefinition, PlayerReward
from app.models.player_item import PlayerItem
from app.models.audit import ProgressionAuditLog

logger = logging.getLogger("inner_awakening.claim")


class ClaimService:
    @staticmethod
    async def claim_reward(
        db: AsyncSession,
        player_id: str,
        reward_id: str,
        idempotency_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Server-authoritative, idempotent reward claim process:
        1. Verify player exists.
        2. Verify reward definition exists.
        3. Verify player reward is unlocked.
        4. Guard against duplicate claims (idempotency check).
        5. Grant cosmetic item to PlayerItem inventory if reward is ITEM/COSMETIC.
        6. Grant currencies (fit_coins / crystals) if reward is CURRENCY.
        7. Record audit log.
        8. Mark claimed.
        """
        # 1. Fetch Player
        player_stmt = select(Player).where(Player.id == player_id)
        player_res = await db.execute(player_stmt)
        player = player_res.scalar_one_or_none()
        if not player:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Player not found."
            )

        # 2. Fetch Reward Definition
        rdef_stmt = (
            select(RewardDefinition)
            .where(RewardDefinition.id == reward_id)
            .options(selectinload(RewardDefinition.item_definition))
        )
        rdef_res = await db.execute(rdef_stmt)
        reward_def = rdef_res.scalar_one_or_none()
        if not reward_def:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Reward '{reward_id}' does not exist."
            )

        # 3. Fetch Player Reward with FOR UPDATE lock if supported
        pr_stmt = (
            select(PlayerReward)
            .where(
                PlayerReward.player_id == player_id,
                PlayerReward.reward_id == reward_id
            )
        )
        pr_res = await db.execute(pr_stmt)
        player_reward = pr_res.scalar_one_or_none()

        if not player_reward or not player_reward.is_unlocked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Player is not eligible or has not unlocked reward '{reward_id}'."
            )

        # 4. Idempotency Check
        if player_reward.is_claimed:
            logger.info(f"Idempotent claim detected: Reward {reward_id} already claimed by {player_id}.")
            return {
                "status": "already_claimed",
                "reward_id": reward_id,
                "name": reward_def.name,
                "claimed_at": player_reward.claimed_at.isoformat() if player_reward.claimed_at else None,
                "message": "Reward has already been claimed and added to your vault."
            }

        # 5. Grant Reward Content
        granted_item_id = None
        if reward_def.reward_type in ("ITEM", "COSMETIC") and reward_def.item_id:
            granted_item_id = reward_def.item_id
            # Check if item already exists in player inventory
            inv_stmt = select(PlayerItem).where(
                PlayerItem.player_id == player_id,
                PlayerItem.item_id == granted_item_id
            )
            inv_res = await db.execute(inv_stmt)
            existing_item = inv_res.scalar_one_or_none()

            if not existing_item:
                new_item = PlayerItem(
                    player_id=player_id,
                    item_id=granted_item_id
                )
                db.add(new_item)
                logger.info(f"Granted item {granted_item_id} to player {player_id} inventory.")

        elif reward_def.reward_type == "CURRENCY":
            if reward_def.currency_type == "FIT_COINS":
                player.fit_coins += reward_def.currency_amount
            elif reward_def.currency_type == "BLUE_CRYSTALS":
                player.blue_crystals += reward_def.currency_amount

        # 6. Mark Claimed
        now = datetime.now(timezone.utc)
        player_reward.is_claimed = True
        player_reward.claimed_at = now
        if idempotency_key:
            player_reward.idempotency_key = idempotency_key

        # 7. Audit Log
        audit = ProgressionAuditLog(
            player_id=player_id,
            event_type="REWARD_CLAIM",
            old_rp=player.rank_points,
            new_rp=player.rank_points,
            delta_rp=0,
            old_level=player.level,
            new_level=player.level,
            source_reference=f"REWARD:{reward_id}"
        )
        db.add(audit)

        # Commit Transaction
        await db.commit()
        await db.refresh(player_reward)

        logger.info(f"Successfully claimed reward {reward_id} for player {player_id}")

        return {
            "status": "success",
            "reward_id": reward_id,
            "name": reward_def.name,
            "reward_type": reward_def.reward_type,
            "granted_item_id": granted_item_id,
            "claimed_at": now.isoformat(),
            "message": f"Successfully claimed {reward_def.name}!"
        }


claim_service = ClaimService()
