from typing import Optional, List, Dict
from pydantic import BaseModel, ConfigDict


class ItemDefinitionResponse(BaseModel):
    item_id: str
    name: str
    category: str
    slot: str
    rarity: str
    description: Optional[str] = None
    icon: Optional[str] = None
    model_path: Optional[str] = None
    material_variant: Optional[str] = None
    strength_bonus: int = 0
    agility_bonus: int = 0
    stamina_bonus: int = 0
    mana_bonus: int = 0
    unlock_type: Optional[str] = None
    unlock_value: Optional[str] = None
    unlock_label: Optional[str] = None
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)


class InventoryItemResponse(BaseModel):
    id: str
    player_id: str
    item_id: str
    is_favorite: bool
    item_definition: ItemDefinitionResponse

    model_config = ConfigDict(from_attributes=True)


class EquipRequest(BaseModel):
    item_id: str


class UnequipRequest(BaseModel):
    slot: str


class EquippedSlotDetail(BaseModel):
    slot: str
    item_id: str
    item: ItemDefinitionResponse

    model_config = ConfigDict(from_attributes=True)


class EquipmentOverviewResponse(BaseModel):
    equipped_slots: Dict[str, str]
    slots: List[EquippedSlotDetail]
    stat_totals: Dict[str, int]
