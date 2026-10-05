from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.api.deps import get_current_player
from app.models.player import Player
from app.services.reward_service import reward_service
from app.services.claim_service import claim_service

router = APIRouter()


class ClaimRewardResponse(BaseModel):
    status: str
    reward_id: str
    name: str
    reward_type: Optional[str] = None
    granted_item_id: Optional[str] = None
    claimed_at: Optional[str] = None
    message: str


@router.get(
    "/available",
    summary="Get Available Rewards and Player Claim Status",
    response_model=List[Dict[str, Any]]
)
async def get_available_rewards(
    db: AsyncSession = Depends(get_db),
    current_player: Player = Depends(get_current_player)
) -> List[Dict[str, Any]]:
    """Returns the full catalog of rewards with this player's unlock and claim states."""
    return await reward_service.get_player_rewards_catalog(db, current_player.id)


@router.post(
    "/{reward_id}/claim",
    summary="Claim Unlocked Reward (Server-Authoritative & Idempotent)",
    response_model=ClaimRewardResponse
)
async def claim_reward_endpoint(
    reward_id: str,
    idempotency_key: Optional[str] = Header(None, alias="X-Idempotency-Key"),
    db: AsyncSession = Depends(get_db),
    current_player: Player = Depends(get_current_player)
) -> ClaimRewardResponse:
    """
    Claims an unlocked reward atomically.
    - If cosmetic/item: automatically grants to PlayerItem inventory.
    - If currency: credits coins or crystals.
    - If already claimed: returns clean idempotent response without re-granting.
    """
    result = await claim_service.claim_reward(
        db=db,
        player_id=current_player.id,
        reward_id=reward_id,
        idempotency_key=idempotency_key
    )
    return ClaimRewardResponse(**result)
