from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_player
from app.models.player import Player
from app.schemas.inventory import (
    InventoryItemResponse,
    ItemDefinitionResponse
)
from app.services.equipment_service import equipment_service

router = APIRouter()


@router.get(
    "",
    response_model=List[InventoryItemResponse],
    summary="Get Player Inventory Items"
)
async def get_my_inventory(
    current_player: Player = Depends(get_current_player),
    db: AsyncSession = Depends(get_db)
) -> List[InventoryItemResponse]:
    """Returns all owned clothing, hairstyles, accessories, and auras in player's vault."""
    items = await equipment_service.get_player_inventory(db, current_player.id)
    return [InventoryItemResponse.model_validate(item) for item in items]


@router.get(
    "/catalog",
    response_model=List[ItemDefinitionResponse],
    summary="Get Full Items Catalog"
)
async def get_items_catalog(
    category: Optional[str] = Query(None, description="FASHION, EMOTE, COLLECTION, PROFILE"),
    slot: Optional[str] = Query(None, description="top, bottom, shoes, hair, face, accessories, aura"),
    rarity: Optional[str] = Query(None, description="COMMON, UNCOMMON, RARE, EPIC, LEGENDARY, MYTHIC"),
    db: AsyncSession = Depends(get_db)
) -> List[ItemDefinitionResponse]:
    """Retrieves all global item definitions and stats."""
    items = await equipment_service.get_item_catalog(db, category, slot, rarity)
    return [ItemDefinitionResponse.model_validate(item) for item in items]
