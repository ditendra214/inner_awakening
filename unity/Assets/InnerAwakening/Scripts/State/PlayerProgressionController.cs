using System;
using UnityEngine;
using InnerAwakening.Network;

namespace InnerAwakening.State
{
    [Serializable]
    public struct ProgressionData
    {
        public string player_id;
        public string username;
        public int level;
        public long current_xp;
        public long xp_into_level;
        public long xp_required_for_next_level;
        public float level_progress_percentage;

        public string current_rank_id;
        public string current_rank_name;
        public int current_rank_order;
        public string rank_color_hex;
        public int rank_points;
        public int rank_floor_rp;
        public int rank_ceiling_rp;
        public string next_rank_id;
        public string next_rank_name;
        public int rp_to_next_rank;
        public float rank_progress_percentage;

        public string season_id;
        public int total_workouts;
        public int valid_reps;
        public long total_score;
        public float calories_burned;
        public int current_streak;
        public int best_streak;
    }

    /// <summary>
    /// Single Source of Truth for Player Level, XP, Rank, and Fitness Statistics in Unity.
    /// Never allows client mutation; only updates via server response.
    /// </summary>
    public class PlayerProgressionController : MonoBehaviour
    {
        public static PlayerProgressionController Instance { get; private set; }

        public ProgressionData CurrentProgression { get; private set; }

        public event Action<ProgressionData> OnProgressionUpdated;
        public event Action<string, string> OnRankChanged; // (oldRank, newRank)
        public event Action<int, int> OnLevelUp;           // (oldLevel, newLevel)

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

        private void Start()
        {
            RefreshProgressionFromServer();
        }

        public void RefreshProgressionFromServer()
        {
            StartCoroutine(APIClient.Instance.GetRequest<ProgressionData>(
                "/player/progression",
                onSuccess: (data) =>
                {
                    ApplyServerProgression(data);
                },
                onError: (err) =>
                {
                    Debug.LogWarning($"[ProgressionController] Failed to sync progression: {err}");
                }
            ));
        }

        public void ApplyServerProgression(ProgressionData newData)
        {
            string oldRank = CurrentProgression.current_rank_id;
            int oldLevel = CurrentProgression.level;

            CurrentProgression = newData;
            OnProgressionUpdated?.Invoke(CurrentProgression);

            if (!string.IsNullOrEmpty(oldRank) && oldRank != newData.current_rank_id)
            {
                OnRankChanged?.Invoke(oldRank, newData.current_rank_id);
            }

            if (oldLevel > 0 && newData.level > oldLevel)
            {
                OnLevelUp?.Invoke(oldLevel, newData.level);
            }
        }
    }
}
