from typing import Optional, List
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.player import Player
from app.models.appearance import CharacterAppearance
from app.models.player_item import PlayerItem
from app.models.equipment import PlayerEquipment
from app.models.item import ItemDefinition
from app.schemas.auth import UserRegister
from app.core.security import hash_password

STARTER_SLOTS = {
    "top": "top_athletic_red_001",
    "bottom": "bot_track_black_001",
    "shoes": "shoe_cyber_teal_001",
    "hair": "hair_undercut_fade_001",
    "face": "face_ar_visor_001",
    "accessories": "acc_power_gauntlets_001",
    "aura": "aura_matrix_code"
}


class PlayerRepository:
    async def get_by_id(self, db: AsyncSession, player_id: str) -> Optional[Player]:
        """Fetch player by ID with appearance and equipment loaded."""
        stmt = (
            select(Player)
            .where(Player.id == player_id)
            .options(
                selectinload(Player.appearance),
                selectinload(Player.equipment).selectinload(PlayerEquipment.item_definition),
                selectinload(Player.inventory_items)
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[Player]:
        """Fetch player by email address."""
        stmt = select(Player).where(Player.email == email.lower().strip())
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_username(self, db: AsyncSession, username: str) -> Optional[Player]:
        """Fetch player by username."""
        stmt = select(Player).where(Player.username == username.strip())
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email_or_username(self, db: AsyncSession, identifier: str) -> Optional[Player]:
        """Fetch player by either email or username."""
        clean_id = identifier.strip().lower()
        stmt = (
            select(Player)
            .where(
                or_(
                    Player.email == clean_id,
                    Player.username == identifier.strip()
                )
            )
            .options(
                selectinload(Player.appearance),
                selectinload(Player.equipment),
                selectinload(Player.inventory_items)
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, user_in: UserRegister) -> Player:
        """Create new player with hashed credentials, appearance, and starter loadout."""
        # 1. Create Base Player
        player = Player(
            username=user_in.username.strip(),
            email=user_in.email.lower().strip(),
            hashed_password=hash_password(user_in.password),
            character_preset=user_in.character_preset,
            level=1,
            xp=0,
            rank_points=0,
            rank_tier="E-RANK",
            fit_coins=500,
            blue_crystals=50,
            streak_days=0
        )
        db.add(player)
        await db.flush()  # Flushes to generate player.id

        # 2. Create Character Appearance
        gender = "female" if user_in.character_preset == "michelle" else "male"
        appearance = CharacterAppearance(
            player_id=player.id,
            gender=gender,
            character_model=user_in.character_preset,
            skin_tone="medium",
            hair_color="#00f5ff" if gender == "male" else "#ff3366",
            eye_color="#00d2ff",
            height_scale=1.0,
            muscle_scale=1.0
        )
        db.add(appearance)

        # 3. Seed Starter Inventory Items & Equipment
        for slot, item_id in STARTER_SLOTS.items():
            # Inventory record
            inv_item = PlayerItem(
                player_id=player.id,
                item_id=item_id,
                is_favorite=False
            )
            db.add(inv_item)

            # Equipment record
            equip_record = PlayerEquipment(
                player_id=player.id,
                slot=slot,
                item_id=item_id
            )
            db.add(equip_record)

        await db.commit()
        
        # Reload with relationships
        return await self.get_by_id(db, player.id)


player_repository = PlayerRepository()
