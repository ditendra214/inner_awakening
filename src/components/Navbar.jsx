import React, { useState } from 'react';
import { 
  Bell, Coins, Shield, Crown, User, LogOut, 
  HeartHandshake, ChevronDown, Settings, Sparkles
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const Navbar = ({ onOpenHealthModal, onNavigateToProfile, onNavigateToNotifications }) => {
  const { 
    profile,
    level, 
    hunterRank,
    xp,
    fitCoins, 
    blueCrystals,
    notifications,
    logoutPlayer
  } = useGame();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadNotificationsCount = notifications ? notifications.filter(n => n.unread).length : 0;

  const handleNotificationClick = () => {
    sound.playSoloLevelingMessageTone();
    if (onNavigateToNotifications) {
      onNavigateToNotifications();
    }
  };

  const handleProfileClick = () => {
    sound.playClick();
    if (onNavigateToProfile) {
      onNavigateToProfile('stats');
    }
  };

  const handleSettingsClick = () => {
    sound.playClick();
    setShowProfileMenu(false);
    if (onNavigateToProfile) {
      onNavigateToProfile('settings');
    }
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    logoutPlayer();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070502]/95 backdrop-blur-md border-b border-[#ffbe3b]/30 px-3 md:px-4 py-2.5 shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Name - App Name INNER AWAKENING with Solo Leveling Gold styling */}
        <div className="flex items-center space-x-2.5 md:space-x-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffbe3b]/10 border border-[#ffbe3b] shadow-neon-gold">
            <Crown className="text-[#ffd700]" size={18} />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#ffd700] rounded-full animate-ping"></div>
          </div>
          <div>
            <h1 className="font-cyber font-black text-base md:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-white to-[#ffbe3b] uppercase leading-none gold-glow-text">
              INNER AWAKENING
            </h1>
            <span className="text-[10px] font-mono text-[#ffbe3b]/90 tracking-widest uppercase">
              [ SYSTEM: SHADOW PLAYER HUD ]
            </span>
          </div>
        </div>

        {/* Center / Right Controls: Currencies, Level, and Profile */}
        <div className="flex items-center space-x-2 md:space-x-2.5">
          {/* Gold (FitCoins) */}
          <div className="flex items-center space-x-1 px-2 py-1 rounded bg-[#160f03] border border-[#ffbe3b]/50 text-[#ffd700] shadow-[0_0_8px_rgba(255,190,59,0.2)]" title="Gold Mana Coins">
            <Coins size={13} className="text-[#ffd700] animate-pulse" />
            <span className="font-mono text-xs font-bold">{fitCoins.toLocaleString()}</span>
            <span className="text-[9px] text-amber-300/70 font-mono hidden sm:inline">G</span>
          </div>

          {/* Blue Crystals */}
          <div className="flex items-center space-x-1 px-2 py-1 rounded bg-[#07131e] border border-cyan-500/50 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.25)]" title="Blue Crystals for Artifact Upgrades">
            <span className="text-xs">💎</span>
            <span className="font-mono text-xs font-bold text-cyan-200">{(blueCrystals || 0).toLocaleString()}</span>
          </div>

          {/* Level / Player Hunter Rank Badge */}
          <div className="flex items-center space-x-1 px-2 py-1 rounded bg-[#160f03] border border-[#ffbe3b]/50 text-[#ffbe3b]">
            <Shield size={13} className="text-[#ffd700]" />
            <span className="font-cyber text-xs font-bold">LVL {level}</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40 hidden sm:inline">
              {hunterRank.rank}
            </span>
          </div>

          {/* Wireframe System Alert Notification Button (Directs to Notifications Page) */}
          <button
            onClick={handleNotificationClick}
            title="Open System Alert Notifications"
            className="relative p-1.5 rounded bg-[#201504] border border-[#ffd700] text-[#ffd700] hover:bg-[#ffbe3b]/20 shadow-neon-gold transition-all"
          >
            <Bell size={16} />
            {unreadNotificationsCount > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ffd700] text-black text-[9px] font-mono font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            ) : (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ffd700]/50 rounded-full"></span>
            )}
          </button>

          {/* User Profile Icon: Clicking directs to Profile page, with Settings option in dropdown */}
          <div className="relative">
            <div className="flex items-center rounded-xl bg-[#1c1305] border border-[#ffd700] shadow-neon-gold overflow-hidden">
              {/* Profile button: direct navigation to Profile Page */}
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-1.5 py-1 px-2.5 hover:bg-[#2b1e08] transition-all"
                title="View Hunter Profile & Status Window"
              >
                <div className="w-6 h-6 rounded-full bg-[#ffbe3b]/20 flex items-center justify-center text-xs">
                  👑
                </div>
                <span className="font-cyber text-xs text-[#ffd700] font-bold max-w-[85px] truncate hidden md:inline">
                  {profile.name}
                </span>
                <span className="text-[10px] font-mono text-amber-300 font-bold hidden sm:inline">
                  [{hunterRank.badge}]
                </span>
              </button>

              {/* Menu chevron toggle for Profile / Settings dropdown */}
              <button
                onClick={() => { sound.playClick(); setShowProfileMenu(!showProfileMenu); }}
                className="p-1 hover:bg-[#2b1e08] text-[#ffd700] border-l border-[#ffbe3b]/30 transition-colors"
                title="Profile & Settings Menu"
              >
                <ChevronDown size={14} className={`transform transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Profile Dropdown Menu with Settings Option */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0a0702] border-2 border-[#ffbe3b] rounded-xl shadow-neon-gold p-4 z-50 system-window animate-fade-in">
                <div className="border-b border-[#ffbe3b]/30 pb-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">👑</span>
                    <div>
                      <h4 className="font-cyber text-sm font-bold text-white uppercase gold-glow-text">
                        {profile.name}
                      </h4>
                      {/* Removed CSE-Aa, showing Hunter Rank & Goal! */}
                      <p className="text-[10px] font-mono text-[#ffd700] font-bold">
                        {hunterRank.rank} • {profile.goal}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs font-mono flex justify-between text-amber-200/80 bg-[#160f04] p-1.5 rounded border border-[#ffbe3b]/20">
                    <span className="text-[#ffd700] font-bold">Rank: {hunterRank.rank}</span>
                    <span className="text-amber-300">LVL {level} ({xp} XP)</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  {/* View Status Window */}
                  <button
                    onClick={() => { setShowProfileMenu(false); onNavigateToProfile && onNavigateToProfile('stats'); }}
                    className="w-full text-left py-2 px-3 rounded bg-[#201504] hover:bg-[#312007] text-[#ffd700] border border-[#ffbe3b]/40 flex items-center justify-between transition-colors font-bold"
                  >
                    <div className="flex items-center space-x-2">
                      <User size={14} className="text-[#ffd700]" />
                      <span>[ SYSTEM: STATUS WINDOW ]</span>
                    </div>
                    <span className="text-[9px] bg-[#ffd700] text-black px-1.5 py-0.5 rounded font-cyber">OPEN</span>
                  </button>

                  {/* Settings Option: requested by user ("in profile icon provide a settings option") */}
                  <button
                    onClick={handleSettingsClick}
                    className="w-full text-left py-2 px-3 rounded bg-[#1e1405] hover:bg-[#2b1d07] text-[#ffd700] border border-[#ffbe3b]/30 flex items-center space-x-2 transition-colors font-bold"
                  >
                    <Settings size={14} className="text-[#ffd700]" />
                    <span>System Settings & Audio</span>
                  </button>

                  {/* Edit Health Profile */}
                  <button
                    onClick={() => { setShowProfileMenu(false); onOpenHealthModal && onOpenHealthModal(); }}
                    className="w-full text-left py-2 px-3 rounded hover:bg-[#241704] text-amber-200 flex items-center space-x-2 transition-colors"
                  >
                    <HeartHandshake size={14} className="text-[#ffd700]" />
                    <span>Edit Health Safeguards</span>
                  </button>

                  {/* Log Out */}
                  <div className="border-t border-[#ffbe3b]/20 pt-2 mt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full py-2 px-3 rounded bg-[#2e0904] hover:bg-[#480e07] text-[#fca5a5] border border-rose-600/50 font-cyber font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                    >
                      <LogOut size={14} />
                      <span>LOG OUT / DISCONNECT</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
