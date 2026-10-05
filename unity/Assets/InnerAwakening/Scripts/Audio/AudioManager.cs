using System;
using UnityEngine;

namespace InnerAwakening.Audio
{
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        [Header("Audio Sources")]
        [SerializeField] private AudioSource sfxSource;
        [SerializeField] private AudioSource musicSource;

        [Header("SFX Clips")]
        [SerializeField] private AudioClip buttonClickClip;
        [SerializeField] private AudioClip pageTransitionClip;
        [SerializeField] private AudioClip rankUpClip;
        [SerializeField] private AudioClip workoutCompletedClip;
        [SerializeField] private AudioClip upgradeSuccessClip;
        [SerializeField] private AudioClip errorClip;

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

        public void PlayButtonClick() => PlaySfx(buttonClickClip);
        public void PlayPageTransition() => PlaySfx(pageTransitionClip);
        public void PlayRankUp() => PlaySfx(rankUpClip);
        public void PlayWorkoutCompleted() => PlaySfx(workoutCompletedClip);
        public void PlayUpgradeSuccess() => PlaySfx(upgradeSuccessClip);
        public void PlayError() => PlaySfx(errorClip);

        private void PlaySfx(AudioClip clip)
        {
            if (sfxSource != null && clip != null)
            {
                sfxSource.PlayOneShot(clip);
            }
        }

        public void SetSfxVolume(float volume)
        {
            if (sfxSource) sfxSource.volume = Mathf.Clamp01(volume);
        }

        public void SetMusicVolume(float volume)
        {
            if (musicSource) musicSource.volume = Mathf.Clamp01(volume);
        }
    }
}
