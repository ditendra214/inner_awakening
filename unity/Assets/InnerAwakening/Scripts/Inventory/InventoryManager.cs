using System;
using System.Collections.Generic;
using UnityEngine;

namespace InnerAwakening.Inventory
{
    public class InventoryManager : MonoBehaviour
    {
        public static InventoryManager Instance { get; private set; }

        [SerializeField] private List<InventoryItem> items = new List<InventoryItem>();

        public event Action<InventoryItem> OnItemEquipped;
        public event Action<InventoryItem> OnItemUnequipped;
        public event Action OnInventoryUpdated;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public List<InventoryItem> GetItemsByCategory(ItemCategory category)
        {
            return items.FindAll(i => i.Category == category);
        }

        public void ToggleEquipItem(InventoryItem item)
        {
            if (item == null) return;

            item.IsEquipped = !item.IsEquipped;
            if (item.IsEquipped)
            {
                OnItemEquipped?.Invoke(item);
            }
            else
            {
                OnItemUnequipped?.Invoke(item);
            }
            OnInventoryUpdated?.Invoke();
        }
    }
}
