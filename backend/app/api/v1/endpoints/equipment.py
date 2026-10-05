from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_player
from app.models.player import Player
from app.schemas.inventory import (
    EquipmentOverviewResponse,
    EquipRequest,
    UnequipRequest
)
from app.services.equipment_service import equipment_service

router = APIRouter()


@router.get(
    "",
    response_model=EquipmentOverviewResponse,
    summary="Get Equipped Gear & Active Stat Buffs"
)
async def get_my_equipment(
    current_player: Player = Depends(get_current_player),
    db: AsyncSession = Depends(get_db)
) -> EquipmentOverviewResponse:
    """Retrieves all currently equipped items and combined stat boosts."""
    return await equipment_service.get_equipment_overview(db, current_player.id)


@router.post(
    "/equip",
    response_model=EquipmentOverviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Equip Item to Character"
)
async def equip_gear(
    request: EquipRequest,
    current_player: Player = Depends(get_current_player),
    db: AsyncSession = Depends(get_db)
) -> EquipmentOverviewResponse:
    """
    Equips an owned item into its appropriate character slot:
    - Validates ownership in player's inventory
    - Validates level / rank prerequisites
    - Updates character equipment state
    - Recalculates stat totals and returns full equipment loadout
    """
    return await equipment_service.equip_item(db, current_player, request.item_id)


@router.post(
    "/unequip",
    response_model=EquipmentOverviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Unequip Gear from Slot"
)
async def unequip_gear(
    request: UnequipRequest,
    current_player: Player = Depends(get_current_player),
    db: AsyncSession = Depends(get_db)
) -> EquipmentOverviewResponse:
    """Unequips a non-mandatory gear slot (e.g., aura, head accessories)."""
    return await equipment_service.unequip_slot(db, current_player, request.slot)
