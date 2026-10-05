using System;
using UnityEngine;
using InnerAwakening.Network;

namespace InnerAwakening.UI.Rewards
{
    [Serializable]
    public struct ClaimResponse
    {
        public string status;
        public string reward_id;
        public string name;
        public string reward_type;
        public string granted_item_id;
        public string claimed_at;
        public string message;
    }

    [Serializable]
    public struct EmptyPayload { }

    /// <summary>
    /// Coordinates idempotent reward claiming between Unity UI and the FastAPI backend.
    /// Prevents duplicate claims, plays SFX, and triggers inventory refresh.
    /// </summary>
    public class RewardClaimController : MonoBehaviour
    {
        public static RewardClaimController Instance { get; private set; }

        public event Action<string, string> OnRewardClaimSuccess; // (rewardId, itemId)

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public void ClaimReward(string rewardId, Action<bool, string> onComplete = null)
        {
            string idempotencyKey = $"claim_{rewardId}_{DateTime.UtcNow.Ticks}";

            StartCoroutine(APIClient.Instance.PostRequest<EmptyPayload, ClaimResponse>(
                $"/rewards/{rewardId}/claim",
                new EmptyPayload(),
                onSuccess: (res) =>
                {
                    Debug.Log($"[RewardClaim] {res.message}");
                    OnRewardClaimSuccess?.Invoke(res.reward_id, res.granted_item_id);
                    onComplete?.Invoke(true, res.message);
                },
                onError: (err) =>
                {
                    Debug.LogError($"[RewardClaim] Claim error: {err}");
                    onComplete?.Invoke(false, err);
                },
                idempotencyKey: idempotencyKey
            ));
        }
    }
}
