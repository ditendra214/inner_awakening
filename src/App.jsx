import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { NotificationModal } from './components/NotificationModal';
import { OnboardingModal } from './components/OnboardingModal';

import { HomeView } from './views/HomeView';
import { PlayView } from './views/PlayView';
import { WorldView } from './views/WorldView';
import { CommunityView } from './views/CommunityView';
import { ProfileView } from './views/ProfileView';

const MainAppContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [forceShowOnboarding, setForceShowOnboarding] = useState(false);
  const { profile, setProfile } = useGame();

  const handleOpenOnboarding = () => {
    setProfile(prev => ({ ...prev, completedOnboarding: false }));
    setForceShowOnboarding(true);
  };

  const handleNavigateToProfile = () => {
    setActiveTab('me');
  };

  return (
    <div className="min-h-screen bg-[#05070e] text-slate-100 flex flex-col font-sans selection:bg-[#ffd700] selection:text-black">
      {/* Top Solo Leveling System Navigation Bar with User Profile & Log Out */}
      <Navbar 
        onOpenHealthModal={handleOpenOnboarding} 
        onNavigateToProfile={handleNavigateToProfile}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-5 md:py-8">
        {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} />}
        {activeTab === 'play' && <PlayView />}
        {activeTab === 'world' && <WorldView />}
        {activeTab === 'community' && <CommunityView />}
        {activeTab === 'me' && <ProfileView onOpenOnboarding={handleOpenOnboarding} />}
      </main>

      {/* Wireframe-accurate Solo Leveling Notification Modal */}
      <NotificationModal />

      {/* Health Care & Step-by-Step Onboarding Questionnaire Modal */}
      {(!profile.completedOnboarding || forceShowOnboarding) && (
        <OnboardingModal />
      )}

      {/* Bottom 5-Tab Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainAppContent />
    </GameProvider>
  );
}
