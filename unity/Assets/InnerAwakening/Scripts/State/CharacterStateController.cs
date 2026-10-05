using System;
using System.Collections.Generic;
using UnityEngine;
using InnerAwakening.Network;

namespace InnerAwakening.State
{
    [Serializable]
    public struct EquipSlotData
    {
        public string slot;
        public string item_id;
    }

    [Serializable]
    public struct EquipmentResponse
    {
        public string message;
        public string slot;
        public string item_id;
    }

    [Serializable]
    public struct EquipRequest
    {
        public string item_id;
    }

    /// <summary>
    /// Synchronizes authoritative character equipment across Lobby, Profile, Gameplay, and Rank Preview.
    /// Guarantees that equipping an item changes the character identically in all scenes.
    /// </summary>
    public class CharacterStateController : MonoBehaviour
    {
        public static CharacterStateController Instance { get; private set; }

        private Dictionary<string, string> equippedSlots = new Dictionary<string, string>();

        public event Action<string, string> OnItemEquipped; // (slot, itemId)
        public event Action<string> OnItemUnequipped;       // (slot)

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

        public string GetEquippedItem(string slot)
        {
            return equippedSlots.ContainsKey(slot) ? equippedSlots[slot] : null;
        }

        public void EquipItem(string itemId, Action<bool> onComplete = null)
        {
            var req = new EquipRequest { item_id = itemId };
            StartCoroutine(APIClient.Instance.PostRequest<EquipRequest, EquipmentResponse>(
                "/equipment/equip",
                req,
                onSuccess: (res) =>
                {
                    if (!string.IsNullOrEmpty(res.slot))
                    {
                        equippedSlots[res.slot] = res.item_id;
                        OnItemEquipped?.Invoke(res.slot, res.item_id);
                    }
                    onComplete?.Invoke(true);
                },
                onError: (err) =>
                {
                    Debug.LogWarning($"[CharacterStateController] Equip failed: {err}");
                    onComplete?.Invoke(false);
                }
            ));
        }
    }
}
