using System;
using System.Collections.Generic;
using UnityEngine;
using InnerAwakening.Network;

namespace InnerAwakening.UI.Leaderboard
{
    [Serializable]
    public struct LeaderboardEntryData
    {
        public int rank_position;
        public string player_id;
        public string username;
        public string character_preset;
        public string rank_tier;
        public int rank_points;
        public int level;
        public int streak_days;
    }

    [Serializable]
    public struct LeaderboardResponseData
    {
        public string timeframe;
        public int total_participants;
        public LeaderboardEntryData[] entries;
    }

    /// <summary>
    /// Displays server-authoritative global and regional leaderboards in Unity.
    /// Reads verified database rankings only.
    /// </summary>
    public class LeaderboardController : MonoBehaviour
    {
        [SerializeField] private Transform leaderboardListRoot;
        [SerializeField] private GameObject leaderboardRowPrefab;

        public void FetchGlobalLeaderboard(Action<LeaderboardResponseData> onLoaded = null)
        {
            StartCoroutine(APIClient.Instance.GetRequest<LeaderboardResponseData>(
                "/leaderboard/global",
                onSuccess: (data) =>
                {
                    onLoaded?.Invoke(data);
                },
                onError: (err) =>
                {
                    Debug.LogWarning($"[LeaderboardController] Failed to load leaderboard: {err}");
                }
            ));
        }
    }
}
