using System;
using System.IO;
using UnityEngine;

namespace InnerAwakening.Save
{
    [Serializable]
    public class PlayerSaveData
    {
        public string PlayerName = "FitWarrior";
        public int Level = 32;
        public int Xp = 12450;
        public int RankPoints = 3487;
        public string CurrentRankId = "MONARCH";
        public int FitCoins = 3450;
        public int BlueCrystals = 420;
        public int TotalWorkouts = 178;
        public int CaloriesBurned = 52340;
        public int CurrentStreak = 5;
    }

    public class SaveManager : MonoBehaviour
    {
        public static SaveManager Instance { get; private set; }

        private string saveFilePath;
        private PlayerSaveData cachedSaveData;

        public PlayerSaveData CurrentData => cachedSaveData ??= LoadData();

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            saveFilePath = Path.Combine(Application.persistentDataPath, "inner_awakening_save.json");
            cachedSaveData = LoadData();
        }

        public void SaveData(PlayerSaveData data)
        {
            try
            {
                cachedSaveData = data;
                string json = JsonUtility.ToJson(data, true);
                File.WriteAllText(saveFilePath, json);
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SaveManager] Failed to save player data: {ex.Message}");
            }
        }

        public PlayerSaveData LoadData()
        {
            try
            {
                if (File.Exists(saveFilePath))
                {
                    string json = File.ReadAllText(saveFilePath);
                    return JsonUtility.FromJson<PlayerSaveData>(json);
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SaveManager] Failed to load save file: {ex.Message}");
            }

            // Return default
            return new PlayerSaveData();
        }
    }
}
