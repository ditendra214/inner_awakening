import React from 'react';
import { Home, Gamepad2, Globe, Users, User } from 'lucide-react';
import { sound } from '../services/soundEngine';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, highlight: 'text-cyan-400', border: 'border-cyan-400' },
    { id: 'play', label: 'Play', icon: Gamepad2, highlight: 'text-pink-500', border: 'border-pink-500' },
    { id: 'world', label: 'World', icon: Globe, highlight: 'text-emerald-400', border: 'border-emerald-400' },
    { id: 'community', label: 'Community', icon: Users, highlight: 'text-amber-400', border: 'border-amber-400' },
    { id: 'me', label: 'Me', icon: User, highlight: 'text-purple-400', border: 'border-purple-400' }
  ];

  const handleTabSelect = (tabId) => {
    sound.playChirp();
    setActiveTab(tabId);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#060a16]/95 backdrop-blur-lg border-t border-cyan-500/30 px-2 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.8)]">
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
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Glow Pill */}
              {isActive && (
                <div className="absolute -top-1.5 w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff] animate-pulse"></div>
              )}

              <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-950/60 border ' + tab.border : ''}`}>
                <Icon size={20} className={isActive ? tab.highlight : 'text-slate-400'} />
              </div>

              <span className={`text-[10px] font-mono tracking-wider uppercase mt-0.5 ${
                isActive ? 'text-white font-bold' : 'text-slate-500'
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
