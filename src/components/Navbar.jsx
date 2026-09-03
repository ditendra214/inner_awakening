import React, { useState } from 'react';
import { 
  Volume2, VolumeX, Radio, Bell, Coins, Shield, 
  Sparkles, Music, Crown, User, LogOut, HeartHandshake, ChevronDown
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const Navbar = ({ onOpenHealthModal, onNavigateToProfile }) => {
  const { 
    profile,
    level, 
    xp,
    fitCoins, 
    soundMuted, 
    toggleSound, 
    ambientActive, 
    toggleAmbient,
    setShowLevelUpAlert,
    setLevelUpMessage,
    logoutPlayer
  } = useGame();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleNotificationClick = () => {
    sound.playSoloLevelingMessageTone();
    setLevelUpMessage("Your next level awaits. Are you ready to prove yourself?");
    setShowLevelUpAlert(true);
  };

  const handlePlaySoloTone = () => {
    sound.playSoloLevelingMessageTone();
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    logoutPlayer();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070502]/95 backdrop-blur-md border-b border-[#ffbe3b]/30 px-4 py-2.5 shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Name - App Name INNER AWAKENING with Solo Leveling Gold styling */}
        <div className="flex items-center space-x-3">
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

        {/* Center / Right Controls */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Dedicated Solo Leveling Message Tone Button */}
          <button
            onClick={handlePlaySoloTone}
            title="Play Solo Leveling System Message Tone"
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#201605] border border-[#ffbe3b] text-[#ffd700] hover:bg-[#ffbe3b]/20 transition-all shadow-[0_0_10px_rgba(255,190,59,0.3)]"
          >
            <Music size={13} className="text-[#ffd700] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider hidden sm:inline uppercase">
              SYSTEM TONE
            </span>
          </button>

          {/* FitCoins (Golden Mana Coins) */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#160f03] border border-[#ffbe3b]/50 text-[#ffd700] shadow-[0_0_8px_rgba(255,190,59,0.2)]">
            <Coins size={14} className="text-[#ffd700] animate-pulse" />
            <span className="font-mono text-xs md:text-sm font-bold">{fitCoins.toLocaleString()}</span>
            <span className="text-[10px] text-amber-300/70 font-mono hidden sm:inline">FC</span>
          </div>

          {/* Level / Player Rank Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#160f03] border border-[#ffbe3b]/50 text-[#ffbe3b]">
            <Shield size={14} className="text-[#ffd700]" />
            <span className="font-cyber text-xs md:text-sm font-bold">LVL {level}</span>
          </div>

          {/* Sound FX Mute Toggle */}
          <button
            onClick={toggleSound}
            title={soundMuted ? "Unmute Audio" : "Mute Audio"}
            className={`p-1.5 rounded border transition-all ${
              soundMuted 
                ? 'bg-rose-950/40 border-rose-600 text-rose-400' 
                : 'bg-[#120d04] border-[#ffbe3b]/40 text-[#ffd700] hover:text-white'
            }`}
          >
            {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Wireframe Notification Alert Button */}
          <button
            onClick={handleNotificationClick}
            title="System Alert Notification"
            className="relative p-1.5 rounded bg-[#201504] border border-[#ffd700] text-[#ffd700] hover:bg-[#ffbe3b]/20 shadow-neon-gold transition-all"
          >
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ffd700] rounded-full animate-ping"></span>
          </button>

          {/* User Profile Icon with Dropdown & Log Out Option */}
          <div className="relative">
            <button
              onClick={() => { sound.playClick(); setShowProfileMenu(!showProfileMenu); }}
              className="flex items-center space-x-1.5 p-1 px-2 rounded-xl bg-[#1c1305] border border-[#ffd700] hover:bg-[#2b1e08] transition-all shadow-neon-gold"
              title="Player Profile & Options"
            >
              <div className="w-6 h-6 rounded-full bg-[#ffbe3b]/20 flex items-center justify-center text-xs">
                👑
              </div>
              <span className="font-cyber text-xs text-[#ffd700] font-bold max-w-[80px] truncate hidden md:inline">
                {profile.name}
              </span>
              <ChevronDown size={14} className="text-[#ffd700]" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0a0702] border-2 border-[#ffbe3b] rounded-xl shadow-neon-gold p-4 z-50 system-window animate-fade-in">
                <div className="border-b border-[#ffbe3b]/30 pb-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">👑</span>
                    <div>
                      <h4 className="font-cyber text-sm font-bold text-white uppercase gold-glow-text">
                        {profile.name}
                      </h4>
                      <p className="text-[10px] font-mono text-amber-300">
                        {profile.goal} • {profile.department}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs font-mono flex justify-between text-amber-200/80 bg-[#160f04] p-1.5 rounded">
                    <span>Rank: Level {level}</span>
                    <span className="text-[#ffd700] font-bold">{xp} XP</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <button
                    onClick={() => { setShowProfileMenu(false); onNavigateToProfile && onNavigateToProfile('stats'); }}
                    className="w-full text-left py-2 px-3 rounded hover:bg-[#241704] text-amber-200 flex items-center space-x-2 transition-colors"
                  >
                    <User size={14} className="text-[#ffd700]" />
                    <span>View Status Window</span>
                  </button>

                  <button
                    onClick={() => { setShowProfileMenu(false); onOpenHealthModal && onOpenHealthModal(); }}
                    className="w-full text-left py-2 px-3 rounded hover:bg-[#241704] text-amber-200 flex items-center space-x-2 transition-colors"
                  >
                    <HeartHandshake size={14} className="text-[#ffd700]" />
                    <span>Edit Health Profile</span>
                  </button>

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
