import React from 'react';
import { Home, Crown, Gamepad2, Globe, Users, User } from 'lucide-react';
import { sound } from '../services/soundEngine';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, highlight: 'text-[#ffd700]', border: 'border-[#ffd700]' },
    { id: 'rank', label: 'Rank', icon: Crown, highlight: 'text-[#ffd700]', border: 'border-[#ffd700]' },
    { id: 'play', label: 'Quests', icon: Gamepad2, highlight: 'text-[#ffbe3b]', border: 'border-[#ffbe3b]' },
    { id: 'world', label: 'Gates', icon: Globe, highlight: 'text-[#f59e0b]', border: 'border-[#f59e0b]' },
    { id: 'community', label: 'Guilds', icon: Users, highlight: 'text-[#ffd700]', border: 'border-[#ffd700]' },
    { id: 'me', label: 'Player', icon: User, highlight: 'text-[#fff1a8]', border: 'border-[#fff1a8]' }
  ];

  const handleTabSelect = (tabId) => {
    sound.playClick();
    setActiveTab(tabId);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#060402]/95 backdrop-blur-lg border-t border-[#ffbe3b]/40 px-2 py-1.5 shadow-[0_-4px_30px_rgba(0,0,0,0.9)]">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabSelect(tab.id)}
              className={`relative flex flex-col items-center py-1 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'scale-105' 
                  : 'text-amber-200/50 hover:text-amber-200'
              }`}
            >
              {/* Active Golden Glow Pill */}
              {isActive && (
                <div className="absolute -top-1.5 w-8 h-1 bg-[#ffd700] rounded-full shadow-[0_0_10px_#ffd700] animate-pulse"></div>
              )}

              <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#221705] border ' + tab.border + ' shadow-[0_0_10px_rgba(255,190,59,0.3)]' : ''}`}>
                <Icon size={20} className={isActive ? tab.highlight : 'text-amber-400/60'} />
              </div>

              <span className={`text-[10px] font-mono tracking-wider uppercase mt-0.5 ${
                isActive ? 'text-[#ffd700] font-bold gold-glow-text' : 'text-amber-500/50'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
