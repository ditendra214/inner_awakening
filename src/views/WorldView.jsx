import React, { useState } from 'react';
import { 
  Globe, Building, Dumbbell, Trees, Zap, Trophy, 
  Sparkles, Lock, ArrowUpCircle, Coins, ShieldCheck, Check
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const WorldView = () => {
  const { buildings, upgradeBuilding, fitCoins, level } = useGame();
  const [selectedBuilding, setSelectedBuilding] = useState(buildings[0]);
  const [feedback, setFeedback] = useState(null);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Terminal': return <Globe size={24} className="text-[#ffd700]" />;
      case 'Dumbbell': return <Dumbbell size={24} className="text-[#ffbe3b]" />;
      case 'Trees': return <Trees size={24} className="text-[#34d399]" />;
      case 'Zap': return <Zap size={24} className="text-[#ffd700]" />;
      case 'Trophy': return <Trophy size={24} className="text-[#fbbf24]" />;
      case 'Building2': return <Building size={24} className="text-[#f59e0b]" />;
      default: return <Globe size={24} className="text-[#ffd700]" />;
    }
  };

  const handleUpgrade = (bId) => {
    const res = upgradeBuilding(bId);
    if (res.success) {
      sound.playLevelUp();
      setFeedback({ type: 'success', text: `[SYSTEM]: ${res.message}` });
      const updated = buildings.find(b => b.id === bId);
      if (updated) setSelectedBuilding(updated);
    } else {
      sound.playClick();
      setFeedback({ type: 'error', text: `[SYSTEM WARNING]: ${res.message}` });
    }
    setTimeout(() => setFeedback(null), 3500);
  };

  const totalFacilityLevels = buildings.reduce((acc, b) => acc + (b.unlocked ? b.level : 0), 0);
  const worldLevel = Math.max(1, Math.floor(totalFacilityLevels * 1.5));

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative z-10">
      {/* World Overview Banner */}
      <div className="relative bg-[#0d0903] border border-[#ffbe3b]/50 rounded-2xl p-5 md:p-6 shadow-neon-gold overflow-hidden system-window">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-[#2a1a05] border border-[#ffd700] text-[10px] font-mono text-[#ffd700] rounded uppercase tracking-wider font-bold">
                [ SYSTEM: DIMENSIONAL GATES & DOMAIN ]
              </span>
              <span className="text-xs font-mono text-amber-300">SHADOW DOMAIN 2050</span>
            </div>
            <h2 className="font-cyber text-2xl md:text-3xl font-black text-white uppercase mt-1 gold-glow-text">
              MONARCH'S EXPEDITION
            </h2>
            <p className="text-xs text-amber-100/80 mt-1 max-w-xl">
              "Build Your Fitness World" — Real-world physical steps and exercises radiate kinetic mana that expands your hunter stronghold and unlocks passive multiplier buffs.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-[#181003] px-4 py-2.5 rounded-xl border border-[#ffbe3b]/40">
            <div className="text-center">
              <span className="text-[10px] font-mono text-amber-400/80 block uppercase">DOMAIN LEVEL</span>
              <span className="font-cyber text-2xl font-black text-[#ffd700]">{worldLevel}</span>
            </div>
            <div className="w-[1px] h-8 bg-[#ffbe3b]/30"></div>
            <div className="text-center">
              <span className="text-[10px] font-mono text-amber-400/80 block uppercase">GATES UNLOCKED</span>
              <span className="font-cyber text-2xl font-black text-white">
                {buildings.filter(b => b.unlocked).length}/{buildings.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`p-3 rounded-lg border font-mono text-xs text-center animate-fade-in ${
          feedback.type === 'success' 
            ? 'bg-[#182607] border-[#39ff14] text-[#39ff14]' 
            : 'bg-[#290c05] border-[#f87171] text-[#fca5a5]'
        }`}>
          {feedback.text}
        </div>
      )}

      {/* Interactive 2050 Dimensional Gate Map Grid */}
      <div className="relative w-full h-80 bg-gradient-to-b from-[#080501] via-[#0d0903] to-[#140e04] border-2 border-[#ffbe3b] rounded-2xl overflow-hidden shadow-neon-gold p-4 flex flex-col justify-between system-window">
        {/* Golden Scanline overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:26px_26px] opacity-10 pointer-events-none"></div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#ffd700] tracking-widest uppercase bg-black/70 px-2.5 py-0.5 rounded border border-[#ffbe3b]/40">
            [ SHADOW TERRITORY: SECTOR 7 GATES ]
          </span>
          <span className="text-[10px] font-mono text-[#39ff14] bg-black/70 px-2.5 py-0.5 rounded border border-[#39ff14]/40">
            MANA FLUX: +{worldLevel * 35} MP/s
          </span>
        </div>

        {/* Node Layout in Solo Leveling Gate Style */}
        <div className="relative z-10 grid grid-cols-3 sm:grid-cols-6 gap-2 my-auto">
          {buildings.map((b) => {
            const isSelected = selectedBuilding.id === b.id;
            return (
              <div
                key={b.id}
                onClick={() => { sound.playClick(); setSelectedBuilding(b); }}
                className={`cursor-pointer group flex flex-col items-center p-3 rounded-xl border transition-all duration-300 ${
                  isSelected 
                    ? 'border-[#ffd700] bg-[#291b05] shadow-neon-gold scale-105' 
                    : b.unlocked
                      ? 'border-[#ffbe3b]/50 bg-[#140e04]/90 hover:border-[#ffd700]'
                      : 'border-amber-950/60 bg-[#080501]/90 opacity-60 hover:opacity-80'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  b.unlocked 
                    ? 'bg-[#ffbe3b]/10 border-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.3)]' 
                    : 'bg-[#100b02] border-amber-950'
                }`}>
                  {b.unlocked ? getIcon(b.icon) : <Lock size={20} className="text-amber-600/60" />}
                </div>

                <span className="font-cyber text-[11px] font-bold text-white mt-2 text-center line-clamp-1">
                  {b.name.split(' ')[0]}
                </span>

                <span className={`text-[9px] font-mono uppercase mt-0.5 ${
                  b.unlocked ? 'text-[#ffd700] font-bold' : 'text-amber-500/50'
                }`}>
                  {b.unlocked ? `LVL ${b.level}` : `LOCK L${b.minPlayerLevel}`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Status bar */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-amber-300/80 bg-black/70 px-3 py-1 rounded border border-[#ffbe3b]/30">
          <span>SELECT ANY GATE SECTOR TO CONSTRUCT / UPGRADE</span>
          <span className="text-[#ffd700] uppercase font-bold">POWERED BY PHYSICAL GAIT</span>
        </div>
      </div>

      {/* Selected Gate Upgrade Card */}
      {selectedBuilding && (
        <div className="bg-[#0e0903] border border-[#ffbe3b] rounded-xl p-5 shadow-neon-gold system-window">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#ffbe3b]/30 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[#241704] border border-[#ffd700] rounded-xl shadow-neon-gold">
                {getIcon(selectedBuilding.icon)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-cyber text-lg font-bold text-white gold-glow-text">{selectedBuilding.name}</h3>
                  {selectedBuilding.unlocked && (
                    <span className="px-2 py-0.5 bg-[#172608] border border-[#39ff14] text-[10px] font-mono text-[#39ff14] rounded">
                      LVL {selectedBuilding.level} ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-100/80 mt-0.5">{selectedBuilding.description}</p>
              </div>
            </div>

            {/* Passive Buff indicator */}
            <div className="bg-[#191104] px-3 py-2 rounded-lg border border-[#ffbe3b]/40 text-right">
              <span className="text-[10px] font-mono text-amber-400/80 block uppercase">SYSTEM MULTIPLIER</span>
              <span className="text-xs font-mono font-bold text-[#ffd700]">{selectedBuilding.bonus}</span>
            </div>
          </div>

          {/* Upgrade Requirements & Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4 text-xs font-mono">
              <div>
                <span className="text-amber-400/80 block">UPGRADE COST</span>
                <span className="text-[#ffd700] font-bold flex items-center space-x-1">
                  <Coins size={14} />
                  <span>{selectedBuilding.cost} FitCoins</span>
                </span>
              </div>
              <div>
                <span className="text-amber-400/80 block">REQUIRED HUNTER LEVEL</span>
                <span className={level >= selectedBuilding.minPlayerLevel ? 'text-[#39ff14] font-bold' : 'text-rose-400 font-bold'}>
                  Character Lvl {selectedBuilding.minPlayerLevel} {level >= selectedBuilding.minPlayerLevel ? '✓' : `(You: Lvl ${level})`}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleUpgrade(selectedBuilding.id)}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#e69500] via-[#ffd700] to-[#fff1a8] hover:from-[#ffd700] hover:to-[#fff9cc] text-black font-cyber font-black text-xs uppercase tracking-widest rounded-lg shadow-neon-gold transition-all transform hover:scale-105 flex items-center justify-center space-x-1.5"
            >
              <ArrowUpCircle size={16} />
              <span>
                {selectedBuilding.unlocked 
                  ? `UPGRADE TO LVL ${selectedBuilding.level + 1}` 
                  : 'UNLOCK DIMENSIONAL GATE'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
