using System;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using InnerAwakening.State;

namespace InnerAwakening.UI.Rank
{
    /// <summary>
    /// UI Orchestrator for the premium Rank Page.
    /// Binds server-authoritative progression state to badges, progress bars, stats, and rewards.
    /// </summary>
    public class RankPageController : MonoBehaviour
    {
        [Header("Rank Presentation")]
        [SerializeField] private TextMeshProUGUI rankTitleText;
        [SerializeField] private TextMeshProUGUI rankPointsValueText;
        [SerializeField] private Image rankProgressBarFill;
        [SerializeField] private Image rankBadgeImage;

        [Header("Statistics Cards")]
        [SerializeField] private TextMeshProUGUI winStreakText;
        [SerializeField] private TextMeshProUGUI totalWorkoutsText;
        [SerializeField] private TextMeshProUGUI caloriesBurnedText;

        [Header("Player Details")]
        [SerializeField] private TextMeshProUGUI playerNameText;
        [SerializeField] private TextMeshProUGUI playerLevelText;

        [Header("Actions")]
        [SerializeField] private Button playAndImproveButton;
        [SerializeField] private GameObject rankUpCelebrationPanel;
        [SerializeField] private TextMeshProUGUI celebrationRankText;

        private void OnEnable()
        {
            if (PlayerProgressionController.Instance != null)
            {
                PlayerProgressionController.Instance.OnProgressionUpdated += UpdateUI;
                PlayerProgressionController.Instance.OnRankChanged += HandleRankUp;
                UpdateUI(PlayerProgressionController.Instance.CurrentProgression);
            }

            if (playAndImproveButton != null)
            {
                playAndImproveButton.onClick.AddListener(OnPlayAndImproveClicked);
            }
        }

        private void OnDisable()
        {
            if (PlayerProgressionController.Instance != null)
            {
                PlayerProgressionController.Instance.OnProgressionUpdated -= UpdateUI;
                PlayerProgressionController.Instance.OnRankChanged -= HandleRankUp;
            }

            if (playAndImproveButton != null)
            {
                playAndImproveButton.onClick.RemoveListener(OnPlayAndImproveClicked);
            }
        }

        public void UpdateUI(ProgressionData data)
        {
            if (rankTitleText != null) rankTitleText.text = data.current_rank_id ?? "MONARCH";
            if (rankPointsValueText != null)
            {
                int ceiling = data.rank_ceiling_rp > 0 ? data.rank_ceiling_rp : 4000;
                rankPointsValueText.text = $"{data.rank_points} / {ceiling} RP";
            }

            if (rankProgressBarFill != null)
            {
                float pct = Mathf.Clamp01(data.rank_progress_percentage / 100f);
                rankProgressBarFill.fillAmount = pct > 0 ? pct : 0.87f;
            }

            if (winStreakText != null) winStreakText.text = data.current_streak.ToString();
            if (totalWorkoutsText != null) totalWorkoutsText.text = data.total_workouts.ToString();
            if (caloriesBurnedText != null) caloriesBurnedText.text = $"{data.calories_burned:N0}";

            if (playerNameText != null) playerNameText.text = data.username ?? "FitWarrior";
            if (playerLevelText != null) playerLevelText.text = $"Lv. {data.level}";
        }

        private void HandleRankUp(string oldRank, string newRank)
        {
            if (rankUpCelebrationPanel != null)
            {
                if (celebrationRankText != null)
                {
                    celebrationRankText.text = $"{newRank} RANK";
                }
                rankUpCelebrationPanel.SetActive(true);
            }
        }

        private void OnPlayAndImproveClicked()
        {
            // Triggers fitness workout flow or scene load
            Debug.Log("[RankPageController] Navigating to Fitness Workout Arena...");
        }

        public void DismissRankUpCelebration()
        {
            if (rankUpCelebrationPanel != null)
            {
                rankUpCelebrationPanel.SetActive(false);
            }
        }
    }
}
