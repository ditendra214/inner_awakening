using System;
using UnityEngine;

namespace InnerAwakening.Inventory
{
    public enum ItemCategory
    {
        FitnessEquipment,
        WorkoutGear,
        Boosters,
        Rewards,
        Consumables,
        Collectibles
    }

    public enum ItemRarity
    {
        Common,
        Uncommon,
        Rare,
        Epic,
        Legendary,
        Mythic
    }

    [CreateAssetMenu(fileName = "NewInventoryItem", menuName = "Inner Awakening/Inventory Item")]
    public class InventoryItem : ScriptableObject
    {
        public string ItemId;
        public string ItemName;
        public ItemCategory Category;
        public ItemRarity Rarity;
        public Sprite Icon;
        public int Quantity = 1;
        public bool IsEquipped;

        [TextArea] public string Description;
        public string StatBuff;
    }
}
