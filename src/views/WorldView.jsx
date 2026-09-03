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
      case 'Terminal': return <Globe size={24} className="text-cyan-400" />;
      case 'Dumbbell': return <Dumbbell size={24} className="text-pink-400" />;
      case 'Trees': return <Trees size={24} className="text-emerald-400" />;
      case 'Zap': return <Zap size={24} className="text-amber-400" />;
      case 'Trophy': return <Trophy size={24} className="text-yellow-400" />;
      case 'Building2': return <Building size={24} className="text-purple-400" />;
      default: return <Globe size={24} className="text-cyan-400" />;
    }
  };

  const handleUpgrade = (bId) => {
    const res = upgradeBuilding(bId);
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      const updated = buildings.find(b => b.id === bId);
      if (updated) setSelectedBuilding(updated);
    } else {
      sound.playClick();
      setFeedback({ type: 'error', text: res.message });
    }
    setTimeout(() => setFeedback(null), 3500);
  };

  // Calculate World Level
  const totalFacilityLevels = buildings.reduce((acc, b) => acc + (b.unlocked ? b.level : 0), 0);
  const worldLevel = Math.max(1, Math.floor(totalFacilityLevels * 1.5));

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* World Overview Banner */}
      <div className="relative bg-[#0c1328] border border-emerald-500/40 rounded-2xl p-5 md:p-6 shadow-[0_0_20px_rgba(16,185,129,0.15)] overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-400 text-[10px] font-mono text-emerald-300 rounded uppercase tracking-wider">
                CORE DIFFERENTIATOR: BUILD YOUR FITNESS WORLD
              </span>
              <span className="text-xs font-mono text-cyan-400">PLANETARY GRID 2050</span>
            </div>
            <h2 className="font-cyber text-2xl md:text-3xl font-black text-white uppercase mt-1">
              NEO-ARCADIA BIOME
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Your real-life fitness generates kinetic power that literally constructs and levels up your digital world. Unlocked buildings grant passive attribute multipliers.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-[#111a36] px-4 py-2.5 rounded-xl border border-slate-700">
            <div className="text-center">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">WORLD LEVEL</span>
              <span className="font-cyber text-2xl font-black text-emerald-400">{worldLevel}</span>
            </div>
            <div className="w-[1px] h-8 bg-slate-700"></div>
            <div className="text-center">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">STRUCTURES</span>
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
            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300' 
            : 'bg-rose-950/70 border-rose-500 text-rose-300'
        }`}>
          {feedback.text}
        </div>
      )}

      {/* Interactive 2050 Cyber City Colony Visualizer */}
      <div className="relative w-full h-80 bg-gradient-to-b from-[#070b18] via-[#091024] to-[#0d1633] border-2 border-cyan-500/40 rounded-2xl overflow-hidden shadow-neon-cyan p-4 flex flex-col justify-between">
        {/* Isometric Grid Background Overlay */}
        <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

        {/* Top Colony Telemetry Header */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase bg-black/60 px-2 py-0.5 rounded border border-cyan-500/30">
            [ COLONY TERRITORY: SECTOR 7 ]
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
            KINETIC FLUX: +{worldLevel * 24} MW/s
          </span>
        </div>

        {/* Node Layout Simulation in 2050 Arcology Style */}
        <div className="relative z-10 grid grid-cols-3 sm:grid-cols-6 gap-2 my-auto">
          {buildings.map((b) => {
            const isSelected = selectedBuilding.id === b.id;
            return (
              <div
                key={b.id}
                onClick={() => { sound.playClick(); setSelectedBuilding(b); }}
                className={`cursor-pointer group flex flex-col items-center p-3 rounded-xl border transition-all duration-300 ${
                  isSelected 
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-neon-cyan scale-105' 
                    : b.unlocked
                      ? 'border-emerald-500/50 bg-[#0d152d]/80 hover:border-emerald-400'
                      : 'border-slate-800 bg-[#080d1a]/80 opacity-60 hover:opacity-80'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  b.unlocked 
                    ? 'bg-cyan-500/10 border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.3)]' 
                    : 'bg-slate-900 border-slate-700'
                }`}>
                  {b.unlocked ? getIcon(b.icon) : <Lock size={20} className="text-slate-500" />}
                </div>

                <span className="font-cyber text-[11px] font-bold text-white mt-2 text-center line-clamp-1">
                  {b.name.split(' ')[0]}
                </span>

                <span className={`text-[9px] font-mono uppercase mt-0.5 ${
                  b.unlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'
                }`}>
                  {b.unlocked ? `LVL ${b.level}` : `LOCK L${b.minPlayerLevel}`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Status bar */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-black/60 px-3 py-1 rounded border border-slate-800">
          <span>TAP ANY SECTOR STRUCTURE TO INSPECT / UPGRADE</span>
          <span className="text-cyan-400 uppercase">SYNCHRONIZED WITH PHYSICAL GAITS</span>
        </div>
      </div>

      {/* Selected Building Details & Upgrade Card */}
      {selectedBuilding && (
        <div className="bg-[#0b1226] border border-cyan-500/40 rounded-xl p-5 shadow-neon-cyan">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-cyan-950/60 border border-cyan-400 rounded-xl">
                {getIcon(selectedBuilding.icon)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-cyber text-lg font-bold text-white">{selectedBuilding.name}</h3>
                  {selectedBuilding.unlocked && (
                    <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500 text-[10px] font-mono text-emerald-400 rounded">
                      LVL {selectedBuilding.level} ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{selectedBuilding.description}</p>
              </div>
            </div>

            {/* Passive Buff indicator */}
            <div className="bg-[#121c3b] px-3 py-2 rounded-lg border border-cyan-500/30 text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">PASSIVE MULTIPLIER</span>
              <span className="text-xs font-mono font-bold text-cyan-300">{selectedBuilding.bonus}</span>
            </div>
          </div>

          {/* Upgrade Requirements & Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 block">UPGRADE COST</span>
                <span className="text-amber-400 font-bold flex items-center space-x-1">
                  <Coins size={14} />
                  <span>{selectedBuilding.cost} FitCoins</span>
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">REQUIRED LEVEL</span>
                <span className={level >= selectedBuilding.minPlayerLevel ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  Character Lvl {selectedBuilding.minPlayerLevel} {level >= selectedBuilding.minPlayerLevel ? '✓' : `(You: Lvl ${level})`}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleUpgrade(selectedBuilding.id)}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-cyber font-black text-xs uppercase tracking-widest rounded-lg shadow-[0_0_15px_#10b981] transition-all transform hover:scale-105 flex items-center justify-center space-x-1.5"
            >
              <ArrowUpCircle size={16} />
              <span>
                {selectedBuilding.unlocked 
                  ? `UPGRADE TO LVL ${selectedBuilding.level + 1}` 
                  : 'UNLOCK FACILITY'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
