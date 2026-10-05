using System;
using System.Collections.Generic;
using UnityEngine;

namespace InnerAwakening.Artifact
{
    public class ArtifactManager : MonoBehaviour
    {
        public static ArtifactManager Instance { get; private set; }

        [SerializeField] private List<ArtifactData> equippedCores = new List<ArtifactData>();

        public event Action<ArtifactData> OnArtifactUpgraded;
        public event Action<string> OnUpgradeFailed;

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

        public bool TryUpgradeArtifact(ArtifactData artifact, int playerCoins, int playerShards, out int coinsSpent, out int shardsSpent)
        {
            coinsSpent = 0;
            shardsSpent = 0;

            if (artifact == null)
            {
                OnUpgradeFailed?.Invoke("Artifact is null.");
                return false;
            }

            if (artifact.Level >= artifact.MaxLevel)
            {
                OnUpgradeFailed?.Invoke("Artifact is already at maximum level.");
                return false;
            }

            int neededCoins = artifact.RequiredCoins;
            int neededShards = artifact.RequiredShards;

            if (playerCoins < neededCoins || playerShards < neededShards)
            {
                OnUpgradeFailed?.Invoke("Insufficient resources.");
                return false;
            }

            coinsSpent = neededCoins;
            shardsSpent = neededShards;

            artifact.Level++;
            OnArtifactUpgraded?.Invoke(artifact);
            return true;
        }

        public List<ArtifactData> GetEquippedCores() => equippedCores;
    }
}
