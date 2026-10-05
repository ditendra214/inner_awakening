using System;
using UnityEngine;

namespace InnerAwakening.Artifact
{
    public enum ArtifactSlot
    {
        StrengthCore,
        EnduranceCore,
        SpeedCore,
        RecoveryCore,
        FocusCore
    }

    [CreateAssetMenu(fileName = "NewArtifactData", menuName = "Inner Awakening/Artifact Data")]
    public class ArtifactData : ScriptableObject
    {
        public string ArtifactId;
        public string ArtifactName;
        public ArtifactSlot Slot;
        public Sprite Icon;

        [Range(1, 10)] public int Level = 1;
        public int MaxLevel = 10;

        public string PrimaryStat;
        public int BaseValue = 20;
        public int ValuePerLevel = 12;

        public int CurrentValue => BaseValue + (Level - 1) * ValuePerLevel;
        public int NextValue => BaseValue + Level * ValuePerLevel;

        [Header("Upgrade Requirements")]
        public int BaseCoinsCost = 600;
        public int BaseShardsCost = 25;

        public int RequiredCoins => Level * BaseCoinsCost;
        public int RequiredShards => Level * BaseShardsCost;

        [TextArea] public string Description;
    }
}
