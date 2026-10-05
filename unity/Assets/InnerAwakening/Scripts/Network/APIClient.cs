using System;
using System.Text;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

namespace InnerAwakening.Network
{
    /// <summary>
    /// Server-authoritative Unity HTTP client.
    /// Interacts with FastAPI backend for player progression, rewards, workouts, and equipment.
    /// </summary>
    public class APIClient : MonoBehaviour
    {
        public static APIClient Instance { get; private set; }

        [Header("Configuration")]
        [SerializeField] private string baseUrl = "http://localhost:8000/api/v1";

        private string authToken = "";

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            authToken = PlayerPrefs.GetString("ia_auth_token", "");
        }

        public void SetAuthToken(string token)
        {
            authToken = token;
            PlayerPrefs.SetString("ia_auth_token", token);
            PlayerPrefs.Save();
        }

        public IEnumerator GetRequest<T>(string endpoint, Action<T> onSuccess, Action<string> onError)
        {
            using (UnityWebRequest req = UnityWebRequest.Get($"{baseUrl}{endpoint}"))
            {
                AttachHeaders(req);
                yield return req.SendWebRequest();

                if (req.result == UnityWebRequest.Result.Success)
                {
                    try
                    {
                        T data = JsonUtility.FromJson<T>(req.downloadHandler.text);
                        onSuccess?.Invoke(data);
                    }
                    catch (Exception ex)
                    {
                        onError?.Invoke($"JSON Deserialization failed: {ex.Message}");
                    }
                }
                else
                {
                    onError?.Invoke($"HTTP {req.responseCode}: {req.error}");
                }
            }
        }

        public IEnumerator PostRequest<TRequest, TResponse>(string endpoint, TRequest payload, Action<TResponse> onSuccess, Action<string> onError, string idempotencyKey = null)
        {
            string json = JsonUtility.ToJson(payload);
            byte[] bodyRaw = Encoding.UTF8.GetBytes(json);

            using (UnityWebRequest req = new UnityWebRequest($"{baseUrl}{endpoint}", "POST"))
            {
                req.uploadHandler = new UploadHandlerRaw(bodyRaw);
                req.downloadHandler = new DownloadHandlerBuffer();
                req.SetRequestHeader("Content-Type", "application/json");
                AttachHeaders(req);

                if (!string.IsNullOrEmpty(idempotencyKey))
                {
                    req.SetRequestHeader("X-Idempotency-Key", idempotencyKey);
                }

                yield return req.SendWebRequest();

                if (req.result == UnityWebRequest.Result.Success)
                {
                    try
                    {
                        TResponse response = JsonUtility.FromJson<TResponse>(req.downloadHandler.text);
                        onSuccess?.Invoke(response);
                    }
                    catch (Exception ex)
                    {
                        onError?.Invoke($"JSON Deserialization error: {ex.Message}");
                    }
                }
                else
                {
                    onError?.Invoke($"HTTP {req.responseCode}: {req.error}");
                }
            }
        }

        private void AttachHeaders(UnityWebRequest req)
        {
            if (!string.IsNullOrEmpty(authToken))
            {
                req.SetRequestHeader("Authorization", $"Bearer {authToken}");
            }
        }
    }
}
