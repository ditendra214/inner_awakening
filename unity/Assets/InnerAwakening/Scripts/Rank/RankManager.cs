using System;
using System.Collections.Generic;
using UnityEngine;

namespace InnerAwakening.Rank
{
    public class RankManager : MonoBehaviour
    {
        public static RankManager Instance { get; private set; }

        [Header("Rank Configuration (E to Monarch)")]
        [SerializeField] private List<RankData> rankConfigs = new List<RankData>();

        [Header("Runtime State")]
        [SerializeField] private int currentRankPoints = 3487;
        [SerializeField] private RankData currentRank;

        // Events
        public event Action<int, int> OnRankPointsChanged; // currentPoints, maxPoints
        public event Action<RankData, RankData> OnRankPromoted; // oldRank, newRank
        public event Action<float> OnProgressChanged; // 0.0f - 1.0f

        public int CurrentPoints => currentRankPoints;
        public RankData CurrentRank => currentRank;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            UpdateRankState(false);
        }

        public void AddRankPoints(int points)
        {
            if (points <= 0) return;

            int oldPoints = currentRankPoints;
            currentRankPoints += points;

            UpdateRankState(true);
        }

        public void SetRankPoints(int points)
        {
            currentRankPoints = Mathf.Max(0, points);
            UpdateRankState(true);
        }

        private void UpdateRankState(bool triggerEvents)
        {
            RankData oldRank = currentRank;
            RankData newRank = GetRankForPoints(currentRankPoints);

            currentRank = newRank;

            float progress = CalculateProgress(currentRankPoints, currentRank);

            if (triggerEvents)
            {
                OnRankPointsChanged?.Invoke(currentRankPoints, currentRank ? currentRank.MaximumPoints : 4000);
                OnProgressChanged?.Invoke(progress);

                if (oldRank != null && newRank != null && newRank.Tier > oldRank.Tier)
                {
                    OnRankPromoted?.Invoke(oldRank, newRank);
                }
            }
        }

        public RankData GetRankForPoints(int points)
        {
            // Traverse from highest (Monarch) to lowest (E)
            for (int i = rankConfigs.Count - 1; i >= 0; i--)
            {
                if (points >= rankConfigs[i].MinimumPoints)
                {
                    return rankConfigs[i];
                }
            }
            return rankConfigs.Count > 0 ? rankConfigs[0] : null;
        }

        public RankData GetNextRank(RankData rank)
        {
            if (rank == null) return null;
            int idx = rankConfigs.IndexOf(rank);
            if (idx >= 0 && idx < rankConfigs.Count - 1)
            {
                return rankConfigs[idx + 1];
            }
            return null; // Apex rank
        }

        public float CalculateProgress(int points, RankData rank)
        {
            if (rank == null) return 1f;
            int span = rank.MaximumPoints - rank.MinimumPoints;
            if (span <= 0) return 1f;

            float val = (float)(points - rank.MinimumPoints) / span;
            return Mathf.Clamp01(val);
        }
    }
}
