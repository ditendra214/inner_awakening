using System;
using System.Collections.Generic;
using UnityEngine;

namespace InnerAwakening.Navigation
{
    public enum PageType
    {
        Lobby,
        Inventory,
        ArtifactGear,
        UpgradeArtifact,
        RankArena,
        Settings,
        Profile
    }

    public class NavigationManager : MonoBehaviour
    {
        public static NavigationManager Instance { get; private set; }

        private readonly Stack<PageType> historyStack = new Stack<PageType>();

        public event Action<PageType, bool> OnPageChanged; // (currentPage, canGoBack)

        public PageType CurrentPage => historyStack.Count > 0 ? historyStack.Peek() : PageType.Lobby;
        public bool CanGoBack => historyStack.Count > 1 && CurrentPage != PageType.Lobby;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            historyStack.Push(PageType.Lobby);
        }

        public void OpenPage(PageType page)
        {
            if (CurrentPage == page) return;

            historyStack.Push(page);
            NotifyChange();
        }

        public bool GoBack()
        {
            if (CanGoBack)
            {
                historyStack.Pop();
                NotifyChange();
                return true;
            }
            return false;
        }

        public void ReturnToLobby()
        {
            historyStack.Clear();
            historyStack.Push(PageType.Lobby);
            NotifyChange();
        }

        private void NotifyChange()
        {
            OnPageChanged?.Invoke(CurrentPage, CanGoBack);
        }
    }
}
