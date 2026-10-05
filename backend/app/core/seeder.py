import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.item import ItemDefinition
from app.models.rank import RankDefinition
from app.models.reward import RewardDefinition

logger = logging.getLogger("inner_awakening.seeder")

INITIAL_CATALOG = [
    {
        "item_id": "top_athletic_red_001",
        "name": "Crimson Surge Training Tee",
        "category": "FASHION",
        "slot": "top",
        "rarity": "COMMON",
        "description": "Lightweight breathable compression shirt engineered for maximum agility and high rep endurance.",
        "strength_bonus": 2,
        "stamina_bonus": 4,
        "unlock_type": "DEFAULT",
        "unlock_label": "Starter Gear"
    },
    {
        "item_id": "top_techwear_hoodie_002",
        "name": "Neon Ronin Tech Hoodie",
        "category": "FASHION",
        "slot": "top",
        "rarity": "RARE",
        "description": "Reinforced ballistic weave hoodie infused with cybernetic fibers. Adds critical pushup power.",
        "strength_bonus": 10,
        "agility_bonus": 5,
        "unlock_type": "LEVEL",
        "unlock_value": "5",
        "unlock_label": "Reach Hunter Level 5"
    },
    {
        "item_id": "top_sovereign_armor_003",
        "name": "Monarch Sovereign Plate",
        "category": "FASHION",
        "slot": "top",
        "rarity": "MYTHIC",
        "description": "Peerless radiant armor forged from celestial blue mana. Worn only by fitness monarchs.",
        "strength_bonus": 35,
        "agility_bonus": 20,
        "stamina_bonus": 30,
        "mana_bonus": 25,
        "unlock_type": "RANK",
        "unlock_value": "MONARCH",
        "unlock_label": "Attain Monarch Rank"
    },
    {
        "item_id": "bot_track_black_001",
        "name": "Shadow Trackers",
        "category": "FASHION",
        "slot": "bottom",
        "rarity": "COMMON",
        "description": "Ergonomic black athletic training pants with dynamic stretch joints for squats and lunges.",
        "agility_bonus": 3,
        "stamina_bonus": 2,
        "unlock_type": "DEFAULT",
        "unlock_label": "Starter Gear"
    },
    {
        "item_id": "shoe_cyber_teal_001",
        "name": "Teal Shockrunners",
        "category": "FASHION",
        "slot": "shoes",
        "rarity": "COMMON",
        "description": "Shock-absorbing athletic sneakers with responsive kinetic return cushions.",
        "agility_bonus": 4,
        "stamina_bonus": 3,
        "unlock_type": "DEFAULT",
        "unlock_label": "Starter Gear"
    },
    {
        "item_id": "shoe_national_champ_001",
        "name": "National Champion Shoes",
        "category": "FASHION",
        "slot": "shoes",
        "rarity": "LEGENDARY",
        "description": "Custom high-top athletic footwear awarded exclusively to athletes who cross into National Rank.",
        "strength_bonus": 15,
        "agility_bonus": 20,
        "stamina_bonus": 15,
        "unlock_type": "RANK",
        "unlock_value": "NATIONAL",
        "unlock_label": "National Rank Milestone"
    },
    {
        "item_id": "hair_undercut_fade_001",
        "name": "Cyber Undercut Fade",
        "category": "FASHION",
        "slot": "hair",
        "rarity": "COMMON",
        "description": "Clean modern styling with high fade sides and swept neon-tinted crown.",
        "unlock_type": "DEFAULT",
        "unlock_label": "Starter Gear"
    },
    {
        "item_id": "face_ar_visor_001",
        "name": "HUD Battle Visor",
        "category": "FASHION",
        "slot": "face",
        "rarity": "UNCOMMON",
        "description": "Augmented reality battle eyewear projecting real-time rep telemetry and calorie breakdown.",
        "stamina_bonus": 5,
        "mana_bonus": 5,
        "unlock_type": "DEFAULT",
        "unlock_label": "Starter Gear"
    },
    {
        "item_id": "acc_power_gauntlets_001",
        "name": "Kinetic Surge Gauntlets",
        "category": "FASHION",
        "slot": "accessories",
        "rarity": "RARE",
        "description": "Arm gauntlets featuring pressurized hydraulic wrist locks for form stabilization.",
        "strength_bonus": 8,
        "unlock_type": "DEFAULT",
        "unlock_label": "Starter Gear"
    },
    {
        "item_id": "aura_matrix_code",
        "name": "Matrix Neon Aura",
        "category": "FASHION",
        "slot": "aura",
        "rarity": "EPIC",
        "description": "Cascading streams of emerald and cyan digital glyphs orbiting the body in real-time.",
        "mana_bonus": 15,
        "unlock_type": "DEFAULT",
        "unlock_label": "Starter Gear"
    },
    {
        "item_id": "aura_golden_sovereign_001",
        "name": "Golden Sovereign Corona",
        "category": "FASHION",
        "slot": "aura",
        "rarity": "MYTHIC",
        "description": "A radiant ring of pulsing gold and solar flare energy enveloping the Monarch.",
        "mana_bonus": 40,
        "strength_bonus": 25,
        "unlock_type": "RANK",
        "unlock_value": "MONARCH",
        "unlock_label": "Monarch Rank Apex"
    }
]

AUTHORITATIVE_RANKS = [
    {"id": "E", "name": "E-Rank", "tier_order": 1, "min_rp": 0, "max_rp": 499, "icon_asset_key": "badge_e", "color_hex": "#CD7F32", "demotion_allowed": False, "demotion_floor_rp": 0},
    {"id": "D", "name": "D-Rank", "tier_order": 2, "min_rp": 500, "max_rp": 999, "icon_asset_key": "badge_d", "color_hex": "#8A9EA7", "demotion_allowed": False, "demotion_floor_rp": 0},
    {"id": "C", "name": "C-Rank", "tier_order": 3, "min_rp": 1000, "max_rp": 1499, "icon_asset_key": "badge_c", "color_hex": "#00E676", "demotion_allowed": False, "demotion_floor_rp": 0},
    {"id": "B", "name": "B-Rank", "tier_order": 4, "min_rp": 1500, "max_rp": 2199, "icon_asset_key": "badge_b", "color_hex": "#00B0FF", "demotion_allowed": True, "demotion_floor_rp": 1450},
    {"id": "A", "name": "A-Rank", "tier_order": 5, "min_rp": 2200, "max_rp": 2999, "icon_asset_key": "badge_a", "color_hex": "#B388FF", "demotion_allowed": True, "demotion_floor_rp": 2150},
    {"id": "S", "name": "S-Rank", "tier_order": 6, "min_rp": 3000, "max_rp": 3999, "icon_asset_key": "badge_s", "color_hex": "#FFD700", "demotion_allowed": True, "demotion_floor_rp": 2950},
    {"id": "NATIONAL", "name": "National Rank", "tier_order": 7, "min_rp": 4000, "max_rp": 4999, "icon_asset_key": "badge_national", "color_hex": "#00E5FF", "demotion_allowed": True, "demotion_floor_rp": 3950},
    {"id": "MONARCH", "name": "Monarch", "tier_order": 8, "min_rp": 5000, "max_rp": 999999, "icon_asset_key": "badge_monarch", "color_hex": "#FFA000", "demotion_allowed": False, "demotion_floor_rp": 4950}
]

REWARDS_CATALOG = [
    {
        "id": "REWARD_E_INITIATE_COINS",
        "name": "E-Rank Initiate Chest",
        "reward_type": "CURRENCY",
        "currency_type": "FIT_COINS",
        "currency_amount": 500,
        "unlock_rank_id": "E",
        "icon_asset_key": "chest_bronze"
    },
    {
        "id": "REWARD_D_CHEST",
        "name": "D-Rank Runner Cache",
        "reward_type": "CURRENCY",
        "currency_type": "FIT_COINS",
        "currency_amount": 1000,
        "unlock_rank_id": "D",
        "icon_asset_key": "chest_silver"
    },
    {
        "id": "REWARD_C_CRYSTALS",
        "name": "C-Rank Crystal Pack",
        "reward_type": "CURRENCY",
        "currency_type": "BLUE_CRYSTALS",
        "currency_amount": 50,
        "unlock_rank_id": "C",
        "icon_asset_key": "crystals_pack"
    },
    {
        "id": "REWARD_B_GAUNTLETS",
        "name": "B-Rank Kinetic Surge Gauntlets",
        "reward_type": "COSMETIC",
        "item_id": "acc_power_gauntlets_001",
        "unlock_rank_id": "B",
        "icon_asset_key": "acc_gauntlets"
    },
    {
        "id": "REWARD_A_HOODIE",
        "name": "A-Rank Neon Ronin Tech Hoodie",
        "reward_type": "COSMETIC",
        "item_id": "top_techwear_hoodie_002",
        "unlock_rank_id": "A",
        "icon_asset_key": "hoodie_ronin"
    },
    {
        "id": "REWARD_S_CRYSTALS",
        "name": "S-Rank Sovereign Crystal Vault",
        "reward_type": "CURRENCY",
        "currency_type": "BLUE_CRYSTALS",
        "currency_amount": 200,
        "unlock_rank_id": "S",
        "icon_asset_key": "crystal_vault"
    },
    {
        "id": "REWARD_NATIONAL_SHOES",
        "name": "National Champion Shoes",
        "reward_type": "COSMETIC",
        "item_id": "shoe_national_champ_001",
        "unlock_rank_id": "NATIONAL",
        "icon_asset_key": "shoes_national"
    },
    {
        "id": "REWARD_MONARCH_AURA",
        "name": "Golden Sovereign Corona Aura",
        "reward_type": "COSMETIC",
        "item_id": "aura_golden_sovereign_001",
        "unlock_rank_id": "MONARCH",
        "icon_asset_key": "aura_monarch"
    },
    {
        "id": "REWARD_MONARCH_ARMOR",
        "name": "Monarch Sovereign Plate Armor",
        "reward_type": "COSMETIC",
        "item_id": "top_sovereign_armor_003",
        "unlock_rank_id": "MONARCH",
        "icon_asset_key": "armor_monarch"
    }
]


async def seed_initial_items(db: AsyncSession) -> None:
    """Seeds starter catalog items, authoritative ranks, and reward definitions."""
    # 1. Items
    for item_data in INITIAL_CATALOG:
        stmt = select(ItemDefinition).where(ItemDefinition.item_id == item_data["item_id"])
        result = await db.execute(stmt)
        existing = result.scalar_one_or_none()
        if not existing:
            new_item = ItemDefinition(**item_data)
            db.add(new_item)
    await db.flush()

    # 2. Ranks
    for rank_data in AUTHORITATIVE_RANKS:
        stmt = select(RankDefinition).where(RankDefinition.id == rank_data["id"])
        result = await db.execute(stmt)
        existing = result.scalar_one_or_none()
        if not existing:
            new_rank = RankDefinition(**rank_data)
            db.add(new_rank)
    await db.flush()

    # 3. Rewards
    for r_data in REWARDS_CATALOG:
        stmt = select(RewardDefinition).where(RewardDefinition.id == r_data["id"])
        result = await db.execute(stmt)
        existing = result.scalar_one_or_none()
        if not existing:
            new_reward = RewardDefinition(**r_data)
            db.add(new_reward)
    await db.flush()

    await db.commit()
    logger.info("Authoritative catalog, ranks, and rewards seeded successfully.")
