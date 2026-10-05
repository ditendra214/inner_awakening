from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.player import Player
from app.models.item import ItemDefinition
from app.models.player_item import PlayerItem
from app.models.equipment import PlayerEquipment
from app.schemas.inventory import (
    EquipmentOverviewResponse,
    EquippedSlotDetail,
    ItemDefinitionResponse
)
from app.services.progression_service import progression_service

MANDATORY_SLOTS = {"top", "bottom", "shoes"}


class EquipmentService:
    async def get_player_inventory(
        self,
        db: AsyncSession,
        player_id: str
    ) -> List[PlayerItem]:
        """Fetch all owned inventory items with full metadata."""
        stmt = (
            select(PlayerItem)
            .where(PlayerItem.player_id == player_id)
            .options(selectinload(PlayerItem.item_definition))
            .order_by(PlayerItem.acquired_at.desc())
        )
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def get_item_catalog(
        self,
        db: AsyncSession,
        category: Optional[str] = None,
        slot: Optional[str] = None,
        rarity: Optional[str] = None
    ) -> List[ItemDefinition]:
        """Fetch full items catalog with optional filters."""
        stmt = select(ItemDefinition).where(ItemDefinition.is_active == True)
        if category:
            stmt = stmt.where(ItemDefinition.category == category.upper())
        if slot:
            stmt = stmt.where(ItemDefinition.slot == slot.lower())
        if rarity:
            stmt = stmt.where(ItemDefinition.rarity == rarity.upper())
        
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def get_equipment_overview(
        self,
        db: AsyncSession,
        player_id: str
    ) -> EquipmentOverviewResponse:
        """Fetch current equipped gear, slot map, and calculated stat bonuses."""
        stmt = (
            select(PlayerEquipment)
            .where(PlayerEquipment.player_id == player_id)
            .options(selectinload(PlayerEquipment.item_definition))
        )
        result = await db.execute(stmt)
        equipment_list = list(result.scalars().all())

        equipped_slots = {}
        slot_details = []
        for eq in equipment_list:
            equipped_slots[eq.slot] = eq.item_id
            if eq.item_definition:
                slot_details.append(
                    EquippedSlotDetail(
                        slot=eq.slot,
                        item_id=eq.item_id,
                        item=ItemDefinitionResponse.model_validate(eq.item_definition)
                    )
                )

        stat_totals = progression_service.calculate_stat_totals(equipment_list)

        return EquipmentOverviewResponse(
            equipped_slots=equipped_slots,
            slots=slot_details,
            stat_totals=stat_totals
        )

    async def equip_item(
        self,
        db: AsyncSession,
        player: Player,
        item_id: str
    ) -> EquipmentOverviewResponse:
        """Equips an owned item into its appropriate character equipment slot."""
        # 1. Fetch Item Definition
        stmt_item = select(ItemDefinition).where(ItemDefinition.item_id == item_id)
        res_item = await db.execute(stmt_item)
        item_def = res_item.scalar_one_or_none()
        if not item_def:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Item '{item_id}' does not exist in the database."
            )

        # 2. Verify Player Ownership
        stmt_own = (
            select(PlayerItem)
            .where(PlayerItem.player_id == player.id, PlayerItem.item_id == item_id)
        )
        res_own = await db.execute(stmt_own)
        is_owned = res_own.scalar_one_or_none()
        if not is_owned:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"You do not own item '{item_def.name}'. Unlock it first."
            )

        # 3. Check Level Requirements
        if item_def.unlock_type == "LEVEL" and item_def.unlock_value:
            try:
                min_lvl = int(item_def.unlock_value)
                if player.level < min_lvl:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Level {min_lvl} required to equip {item_def.name}. Current level is {player.level}."
                    )
            except ValueError:
                pass

        # 4. Upsert into player_equipment for the target slot
        slot = item_def.slot
        stmt_curr = select(PlayerEquipment).where(
            PlayerEquipment.player_id == player.id,
            PlayerEquipment.slot == slot
        )
        res_curr = await db.execute(stmt_curr)
        existing_equip = res_curr.scalar_one_or_none()

        if existing_equip:
            existing_equip.item_id = item_id
        else:
            new_equip = PlayerEquipment(
                player_id=player.id,
                slot=slot,
                item_id=item_id
            )
            db.add(new_equip)

        await db.commit()
        return await self.get_equipment_overview(db, player.id)

    async def unequip_slot(
        self,
        db: AsyncSession,
        player: Player,
        slot: str
    ) -> EquipmentOverviewResponse:
        """Unequips a non-mandatory gear slot."""
        clean_slot = slot.lower().strip()
        if clean_slot in MANDATORY_SLOTS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Slot '{clean_slot}' is mandatory and cannot be left empty. Equip a replacement instead."
            )

        stmt = delete(PlayerEquipment).where(
            PlayerEquipment.player_id == player.id,
            PlayerEquipment.slot == clean_slot
        )
        await db.execute(stmt)
        await db.commit()

        return await self.get_equipment_overview(db, player.id)


equipment_service = EquipmentService()
