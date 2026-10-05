import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { navigationManager } from './services/navigationManager';

import { RankView } from './views/RankView';
import { InventoryPage } from './views/InventoryPage';
import { ArtifactGearPage } from './views/ArtifactGearPage';
import { UpgradeArtifactPage } from './views/UpgradeArtifactPage';
import { RankArenaPage } from './views/RankArenaPage';
import { ProfileView } from './views/ProfileView';
import { NotificationModal } from './components/NotificationModal';
import { OnboardingModal } from './components/OnboardingModal';

const GameClientViewport = () => {
  const [currentPage, setCurrentPage] = useState(navigationManager.getCurrentPage() || 'rank');
  const [canGoBack, setCanGoBack] = useState(navigationManager.canGoBack());
  const { profile, setProfile } = useGame();
  const [forceShowOnboarding, setForceShowOnboarding] = useState(false);

  // Subscribe to NavigationManager changes
  useEffect(() => {
    const unsubscribe = navigationManager.subscribe(({ page, canBack }) => {
      setCurrentPage(page);
      setCanGoBack(canBack);
    });
    return unsubscribe;
  }, []);

  const handleOpenOnboarding = () => {
    setProfile(prev => ({ ...prev, completedOnboarding: false }));
    setForceShowOnboarding(true);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#03060f] text-slate-100 flex flex-col font-sans select-none relative">
      
      {/* Active Screen Router */}
      <main className="w-full h-full flex-1 relative overflow-hidden">
        {(currentPage === 'rank' || currentPage === 'lobby') && (
          <RankView />
        )}

        {currentPage === 'inventory' && (
          <InventoryPage />
        )}

        {currentPage === 'artifacts' && (
          <ArtifactGearPage />
        )}

        {currentPage === 'upgrade' && (
          <UpgradeArtifactPage />
        )}

        {currentPage === 'arena' && (
          <RankArenaPage />
        )}

        {currentPage === 'profile' && (
          <div className="w-full h-full overflow-y-auto bg-[#05070e] p-4">
            <div className="max-w-5xl mx-auto">
              <button
                onClick={() => navigationManager.goBack()}
                className="mb-4 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-cyber text-xs font-bold uppercase"
              >
                ← BACK TO LOBBY
              </button>
              <ProfileView onOpenOnboarding={handleOpenOnboarding} initialSubTab="stats" />
            </div>
          </div>
        )}
      </main>

      {/* Global Level-Up Notification Alert */}
      <NotificationModal />

      {/* Onboarding Health Assessment Modal if first time */}
      {(!profile.completedOnboarding || forceShowOnboarding) && (
        <OnboardingModal />
      )}
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameClientViewport />
    </GameProvider>
  );
}
