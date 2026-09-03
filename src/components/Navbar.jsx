import React from 'react';
import { 
  Volume2, VolumeX, Radio, Bell, Coins, Shield, 
  Sparkles, Music, Crown
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const Navbar = ({ onOpenHealthModal }) => {
  const { 
    level, 
    fitCoins, 
    soundMuted, 
    toggleSound, 
    ambientActive, 
    toggleAmbient,
    setShowLevelUpAlert,
    setLevelUpMessage
  } = useGame();

  const handleNotificationClick = () => {
    sound.playSoloLevelingMessageTone();
    setLevelUpMessage("Your next level awaits. Are you ready to prove yourself?");
    setShowLevelUpAlert(true);
  };

  const handlePlaySoloTone = () => {
    sound.playSoloLevelingMessageTone();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070502]/90 backdrop-blur-md border-b border-[#ffbe3b]/30 px-4 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Name - App Name INNER AWAKENING strictly preserved with Solo Leveling Gold styling */}
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
              [ SYSTEM: SHADOW HUNTER HUD ]
            </span>
          </div>
        </div>

        {/* Center / Right Stats & Audio Controls */}
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

          {/* Level / Hunter Rank Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#160f03] border border-[#ffbe3b]/50 text-[#ffbe3b]">
            <Shield size={14} className="text-[#ffd700]" />
            <span className="font-cyber text-xs md:text-sm font-bold">LVL {level}</span>
          </div>

          {/* Shadow Aura Ambient Toggle */}
          <button
            onClick={toggleAmbient}
            title={ambientActive ? "Mute Shadow Mist Drone" : "Activate Shadow Mist Atmosphere"}
            className={`p-1.5 rounded border transition-all ${
              ambientActive 
                ? 'bg-[#291c06] border-[#ffd700] text-[#ffd700] shadow-neon-gold' 
                : 'bg-[#120d04] border-amber-950 text-amber-500/70 hover:text-amber-200'
            }`}
          >
            <Radio size={16} className={ambientActive ? 'animate-pulse' : ''} />
          </button>

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

          {/* System Notification Alert Button matching wireframe trigger */}
          <button
            onClick={handleNotificationClick}
            title="System Alert Notification"
            className="relative p-1.5 rounded bg-[#201504] border border-[#ffd700] text-[#ffd700] hover:bg-[#ffbe3b]/20 shadow-neon-gold transition-all"
          >
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ffd700] rounded-full animate-ping"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
