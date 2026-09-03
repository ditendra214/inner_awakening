import React, { useEffect } from 'react';
import { AlertTriangle, Zap, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const NotificationModal = () => {
  const { showLevelUpAlert, setShowLevelUpAlert, levelUpMessage, addXP, addFitCoins } = useGame();

  // Play Solo Leveling System Message Tone when alert opens
  useEffect(() => {
    if (showLevelUpAlert) {
      sound.playSoloLevelingMessageTone();
    }
  }, [showLevelUpAlert]);

  if (!showLevelUpAlert) return null;

  const handleAccept = () => {
    sound.playLevelUp();
    addFitCoins(50);
    addXP(100);
    setShowLevelUpAlert(false);
  };

  const handleDismiss = () => {
    sound.playClick();
    setShowLevelUpAlert(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Solo Leveling Golden System Alert Window */}
      <div className="relative w-full max-w-md bg-[#0e0a03]/90 border-2 border-[#ffbe3b] rounded-lg p-6 shadow-neon-gold overflow-hidden">
        {/* Golden Corner Decors */}
        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#ffd700]"></div>
        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#ffd700]"></div>
        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#ffd700]"></div>
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#ffd700]"></div>

        {/* Ambient golden glow line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700] to-transparent"></div>

        {/* Close icon */}
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-amber-300/60 hover:text-[#ffd700] transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header matching wireframe: [ ! ] NOTIFICATION with Solo Leveling System aesthetic */}
        <div className="flex items-center justify-center space-x-2 border-2 border-[#ffbe3b]/60 bg-[#261a05]/70 py-2 px-4 rounded mb-6 shadow-[inset_0_0_10px_rgba(255,190,59,0.2)]">
          <AlertTriangle className="text-[#ffd700] animate-pulse" size={22} />
          <h2 className="font-cyber text-lg tracking-widest text-[#ffd700] font-bold uppercase gold-glow-text">
            NOTIFICATION
          </h2>
        </div>

        {/* Message Content matching wireframe: "Your next level awaits. Are you ready to prove yourself?" */}
        <div className="text-center py-3 px-2 mb-6">
          <p className="font-sans text-xl md:text-2xl text-amber-50 font-semibold leading-snug">
            {levelUpMessage}
          </p>
          <p className="text-xs font-mono text-[#ffbe3b] mt-3 uppercase tracking-wider">
            [ SYSTEM: REWARDS READY • +100 XP, +50 FITCOINS ]
          </p>
        </div>

        {/* Action Button matching wireframe: [ yes ] */}
        <div className="flex justify-center">
          <button
            onClick={handleAccept}
            className="group relative px-12 py-3 bg-gradient-to-r from-[#e69500] to-[#ffd700] hover:from-[#ffd700] hover:to-[#ffea75] text-black font-cyber font-black tracking-widest text-base uppercase rounded transition-all duration-200 transform hover:scale-105 shadow-neon-gold flex items-center space-x-2"
          >
            <Zap size={18} className="fill-black group-hover:rotate-12 transition-transform" />
            <span>YES</span>
          </button>
        </div>

        <div className="text-center mt-4">
          <button 
            onClick={handleDismiss}
            className="text-xs font-mono text-amber-500/70 hover:text-amber-300 tracking-wider underline"
          >
            Stand by for later
          </button>
        </div>
      </div>
    </div>
  );
};
