import React from 'react';
import { AlertCircle, Zap, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const NotificationModal = () => {
  const { showLevelUpAlert, setShowLevelUpAlert, levelUpMessage, addXP, addFitCoins } = useGame();

  if (!showLevelUpAlert) return null;

  const handleAccept = () => {
    sound.playLevelUp();
    // Grant bonus energy and coins for proving themselves
    addFitCoins(50);
    addXP(100);
    setShowLevelUpAlert(false);
  };

  const handleDismiss = () => {
    sound.playClick();
    setShowLevelUpAlert(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* 2050 Cyber Holographic Frame */}
      <div className="relative w-full max-w-md bg-[#0c1224] border-2 border-cyan-400 rounded-lg p-6 shadow-neon-cyan overflow-hidden">
        {/* Corner Decors */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white"></div>

        {/* Scanline texture */}
        <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-30"></div>

        {/* Close icon */}
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header matching wireframe: [ ! ] NOTIFICATION */}
        <div className="flex items-center justify-center space-x-2 border-2 border-cyan-400/50 bg-cyan-950/40 py-2 px-4 rounded mb-6">
          <AlertCircle className="text-cyan-400 animate-pulse" size={22} />
          <h2 className="font-cyber text-lg tracking-widest text-cyan-300 font-bold uppercase">
            NOTIFICATION
          </h2>
        </div>

        {/* Message Content matching wireframe: "Your next level awaits. Are you ready to prove yourself?" */}
        <div className="text-center py-3 px-2 mb-6">
          <p className="font-sans text-xl md:text-2xl text-slate-100 font-semibold leading-snug">
            {levelUpMessage}
          </p>
          <p className="text-xs font-mono text-cyan-400/80 mt-3 uppercase tracking-wider">
            Biometric Sync Ready • Mission Rewards: +100 XP, +50 Coins
          </p>
        </div>

        {/* Action Button matching wireframe: [ yes ] */}
        <div className="flex justify-center">
          <button
            onClick={handleAccept}
            className="group relative px-10 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-black tracking-widest text-base uppercase rounded transition-all duration-200 transform hover:scale-105 shadow-neon-cyan flex items-center space-x-2"
          >
            <Zap size={18} className="fill-black group-hover:rotate-12 transition-transform" />
            <span>YES</span>
          </button>
        </div>

        <div className="text-center mt-4">
          <button 
            onClick={handleDismiss}
            className="text-xs font-mono text-slate-500 hover:text-slate-300 tracking-wider underline"
          >
            Stand by for later
          </button>
        </div>
      </div>
    </div>
  );
};
