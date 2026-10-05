using System;
using UnityEngine;

namespace InnerAwakening.Rank
{
    public enum FitnessRankTier
    {
        E = 1,
        D = 2,
        C = 3,
        B = 4,
        A = 5,
        S = 6,
        National = 7,
        Monarch = 8
    }

    [CreateAssetMenu(fileName = "NewRankData", menuName = "Inner Awakening/Rank Data")]
    public class RankData : ScriptableObject
    {
        [Header("Rank Identity")]
        public FitnessRankTier Tier;
        public string RankName;
        public string Title;
        [TextArea] public string Description;

        [Header("Rank Thresholds")]
        public int MinimumPoints;
        public int MaximumPoints;

        [Header("Visuals & Theme")]
        public Sprite Emblem;
        public Color ThemeColor = Color.yellow;
        public Color GlowColor = new Color(1f, 0.8f, 0.2f, 0.8f);

        [Header("Multipliers")]
        public float StatMultiplier = 1.0f;
        public string BonusDescription;
    }
}
