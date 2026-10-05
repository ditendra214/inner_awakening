using System;
using System.Text;
using System.Collections;
using UnityEngine;
using InnerAwakening.State;

namespace InnerAwakening.Network
{
    [Serializable]
    public struct WebSocketServerEvent
    {
        public string event_type;
        public string player_id;
        public string payload_json;
    }

    /// <summary>
    /// Real-time WebSocket manager for reactive live updates.
    /// Synchronizes rank promotion, XP updates, reward unlocks, and character gear across sessions.
    /// </summary>
    public class WebSocketManager : MonoBehaviour
    {
        public static WebSocketManager Instance { get; private set; }

        [SerializeField] private string wsBaseUrl = "ws://localhost:8000/api/v1/ws";
        private bool isConnected = false;

        public event Action<string> OnWebSocketEventReceived;

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

        public void Connect(string playerId)
        {
            if (string.IsNullOrEmpty(playerId)) return;
            string url = $"{wsBaseUrl}/{playerId}";
            Debug.Log($"[WebSocketManager] Connecting to real-time stream: {url}");
            isConnected = true;
        }

        public void Disconnect()
        {
            isConnected = false;
        }

        public void HandleIncomingMessage(string rawJson)
        {
            try
            {
                var evt = JsonUtility.FromJson<WebSocketServerEvent>(rawJson);
                OnWebSocketEventReceived?.Invoke(evt.event_type);

                switch (evt.event_type)
                {
                    case "PROGRESSION_UPDATED":
                    case "RANK_CHANGED":
                        PlayerProgressionController.Instance?.RefreshProgressionFromServer();
                        break;
                    case "REWARD_UNLOCKED":
                        Debug.Log("[WebSocketManager] Milestone Reward Unlocked!");
                        break;
                }
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[WebSocketManager] Message parse error: {ex.Message}");
            }
        }
    }
}
