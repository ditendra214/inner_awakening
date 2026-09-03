import React from 'react';
import { 
  Volume2, VolumeX, Radio, Bell, Coins, Shield, 
  Sparkles, Activity, HeartHandshake
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
    sound.playNotification();
    setLevelUpMessage("Your next level awaits. Are you ready to prove yourself?");
    setShowLevelUpAlert(true);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070b18]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Name - App Name INNER AWAKENING must not be changed */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400 shadow-neon-cyan">
            <span className="text-cyan-400 font-cyber font-black text-sm">IA</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
          </div>
          <div>
            <h1 className="font-cyber font-black text-base md:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-500 uppercase leading-none">
              INNER AWAKENING
            </h1>
            <span className="text-[10px] font-mono text-cyan-400/70 tracking-widest uppercase">
              2050 CYBER-FITNESS RPG
            </span>
          </div>
        </div>

        {/* Center / Right Stats & Audio Controls */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* FitCoins Counter */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#0f172a] border border-amber-500/40 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
            <Coins size={14} className="text-amber-400 animate-pulse" />
            <span className="font-mono text-xs md:text-sm font-bold">{fitCoins.toLocaleString()}</span>
            <span className="text-[10px] text-amber-300/60 font-mono hidden sm:inline">FC</span>
          </div>

          {/* Level Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#0f172a] border border-cyan-400/40 text-cyan-300">
            <Shield size={14} className="text-cyan-400" />
            <span className="font-cyber text-xs md:text-sm font-bold">LVL {level}</span>
          </div>

          {/* Ambient Cyber Drone Toggle */}
          <button
            onClick={toggleAmbient}
            title={ambientActive ? "Stop 2050 Cyber Drone" : "Activate 2050 Cyber Drone"}
            className={`p-1.5 rounded border transition-all ${
              ambientActive 
                ? 'bg-fuchsia-950/60 border-fuchsia-400 text-fuchsia-400 shadow-neon-pink' 
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio size={16} className={ambientActive ? 'animate-pulse' : ''} />
          </button>

          {/* Sound FX Mute Toggle */}
          <button
            onClick={toggleSound}
            title={soundMuted ? "Unmute Sci-Fi Audio FX" : "Mute Sci-Fi Audio FX"}
            className={`p-1.5 rounded border transition-all ${
              soundMuted 
                ? 'bg-rose-950/40 border-rose-600 text-rose-400' 
                : 'bg-slate-900/60 border-cyan-500/30 text-cyan-400 hover:text-white'
            }`}
          >
            {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Wireframe Notification Trigger Button */}
          <button
            onClick={handleNotificationClick}
            title="System Alert Notification"
            className="relative p-1.5 rounded bg-cyan-950/50 border border-cyan-400 text-cyan-300 hover:bg-cyan-500/20 shadow-neon-cyan transition-all"
          >
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
