using System;
using UnityEngine;

namespace InnerAwakening.Character
{
    [RequireComponent(typeof(Animator))]
    public class CharacterPresentationController : MonoBehaviour
    {
        [Header("Animator Components")]
        [SerializeField] private Animator characterAnimator;

        [Header("Materials & Rendering (Clean PBR - No Red Overlay)")]
        [SerializeField] private Renderer[] characterRenderers;
        [SerializeField] private Material defaultPbrMaterial;

        [Header("Floor Platform & Grounding")]
        [SerializeField] private GameObject circularPedestal;
        [SerializeField] private ParticleSystem rankUpParticles;

        [Header("Rotation Settings")]
        [SerializeField] private float rotationSpeed = 5.0f;
        [SerializeField] private bool autoRotate = false;
        [SerializeField] private float autoRotateSpeed = 15.0f;

        private bool isDragging = false;
        private Vector2 lastMousePos;

        // Animator Parameter Hashes
        private static readonly int IdleHash = Animator.StringToHash("Idle");
        private static readonly int SquatHash = Animator.StringToHash("Squat");
        private static readonly int PushUpHash = Animator.StringToHash("PushUp");
        private static readonly int JumpingJackHash = Animator.StringToHash("JumpingJack");
        private static readonly int VictoryCelebrationHash = Animator.StringToHash("VictoryCelebration");

        private void Awake()
        {
            if (characterAnimator == null)
            {
                characterAnimator = GetComponent<Animator>();
            }

            EnsureCleanPbrMaterials();
        }

        private void Update()
        {
            HandleRotation();
        }

        /// <summary>
        /// Strictly removes any red material overlay or forced red tint on character meshes.
        /// Preserves realistic game-ready standard PBR textures and natural skin/clothing.
        /// </summary>
        public void EnsureCleanPbrMaterials()
        {
            if (characterRenderers == null || characterRenderers.Length == 0)
            {
                characterRenderers = GetComponentsInChildren<Renderer>(true);
            }

            foreach (var rend in characterRenderers)
            {
                if (rend == null) continue;

                foreach (var mat in rend.materials)
                {
                    if (mat == null) continue;

                    // Disable any red emissive glow or unnatural color overlay
                    if (mat.HasProperty("_EmissionColor"))
                    {
                        mat.SetColor("_EmissionColor", Color.black);
                        mat.DisableKeyword("_EMISSION");
                    }

                    if (mat.HasProperty("_Color") && mat.mainTexture != null)
                    {
                        mat.SetColor("_Color", Color.white);
                    }
                }
            }
        }

        public void PlayIdle()
        {
            if (characterAnimator) characterAnimator.CrossFade(IdleHash, 0.25f);
        }

        public void PlaySquat()
        {
            if (characterAnimator) characterAnimator.CrossFade(SquatHash, 0.25f);
        }

        public void PlayPushUp()
        {
            if (characterAnimator) characterAnimator.CrossFade(PushUpHash, 0.25f);
        }

        public void PlayJumpingJack()
        {
            if (characterAnimator) characterAnimator.CrossFade(JumpingJackHash, 0.25f);
        }

        public void TriggerRankUpCelebration()
        {
            if (characterAnimator)
            {
                characterAnimator.CrossFade(VictoryCelebrationHash, 0.2f);
            }

            if (rankUpParticles != null)
            {
                rankUpParticles.Play();
            }
        }

        private void HandleRotation()
        {
            if (autoRotate && !isDragging)
            {
                transform.Rotate(Vector3.up, autoRotateSpeed * Time.deltaTime, Space.World);
                return;
            }

            if (Input.GetMouseButtonDown(0))
            {
                isDragging = true;
                lastMousePos = Input.mousePosition;
            }
            else if (Input.GetMouseButtonUp(0))
            {
                isDragging = false;
            }

            if (isDragging)
            {
                Vector2 delta = (Vector2)Input.mousePosition - lastMousePos;
                transform.Rotate(Vector3.up, -delta.x * rotationSpeed * 0.1f, Space.World);
                lastMousePos = Input.mousePosition;
            }
        }

        public void ToggleAutoRotate(bool enabled)
        {
            autoRotate = enabled;
        }

        public void ResetOrientation()
        {
            transform.rotation = Quaternion.identity;
        }
    }
}
