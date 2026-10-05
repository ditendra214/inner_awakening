import React, { useState } from 'react';
import { 
  ArrowLeft, Shield, Zap, Sparkles, Flame, 
  Dumbbell, Heart, ArrowUpCircle, Check, ChevronRight
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { navigationManager } from '../services/navigationManager';
import { sound } from '../services/soundEngine';

export const INITIAL_ARTIFACT_CORES = [
  {
    id: 'strength_core',
    slot: 'strength',
    name: 'Titanium Strength Core',
    level: 4,
    maxLevel: 10,
    rarity: 'LEGENDARY',
    icon: '💪',
    color: '#f59e0b',
    primaryStat: 'Strength Power',
    statValue: 48,
    statBonus: '+48 Raw Muscular Force',
    description: 'Imbued with dense gravitational mass that exponentially accelerates hypertrophic kinetic output.',
    isEquipped: true,
    shardsRequired: 80,
    coinsRequired: 2500
  },
  {
    id: 'endurance_core',
    slot: 'endurance',
    name: 'Perpetual Endurance Core',
    level: 3,
    maxLevel: 10,
    rarity: 'EPIC',
    icon: '🫀',
    color: '#06b6d4',
    primaryStat: 'Aerobic Capacity',
    statValue: 36,
    statBonus: '+36 VO2 Max & Fatigue Buffer',
    description: 'Bioluminescent mitochondrial catalyst expanding respiratory oxygenation under extreme lactate loads.',
    isEquipped: true,
    shardsRequired: 60,
    coinsRequired: 1800
  },
  {
    id: 'speed_core',
    slot: 'speed',
    name: 'Velocity Surge Core',
    level: 2,
    maxLevel: 10,
    rarity: 'RARE',
    icon: '⚡',
    color: '#3b82f6',
    primaryStat: 'Kinetic Agility',
    statValue: 24,
    statBonus: '+24 Fast-Twitch Muscle Velocity',
    description: 'High-frequency neuro-muscular conduit shaving milliseconds off eccentric-to-concentric transition speed.',
    isEquipped: true,
    shardsRequired: 45,
    coinsRequired: 1200
  },
  {
    id: 'recovery_core',
    slot: 'recovery',
    name: 'Regenerative Cell Core',
    level: 3,
    maxLevel: 10,
    rarity: 'EPIC',
    icon: '🧬',
    color: '#10b981',
    primaryStat: 'Tissue Restoration',
    statValue: 32,
    statBonus: '+32 Intra-Session Glycogen Refill',
    description: 'Synthetic peptide matrix speeding microcellular tendon remodeling between heavy resistance bouts.',
    isEquipped: true,
    shardsRequired: 65,
    coinsRequired: 2000
  },
  {
    id: 'focus_core',
    slot: 'focus',
    name: 'Sovereign Focus Core',
    level: 4,
    maxLevel: 10,
    rarity: 'MYTHIC',
    icon: '🧠',
    color: '#a855f7',
    primaryStat: 'Mind-Muscle Synchrony',
    statValue: 55,
    statBonus: '+55 Neural Drive & Form Precision',
    description: 'Supreme neurological catalyst delivering tunnel-vision lock and immaculate rep cadence verification.',
    isEquipped: true,
    shardsRequired: 120,
    coinsRequired: 3500
  }
];

export const ArtifactGearPage = () => {
  const { sound, fitCoins, blueCrystals } = useGame();
  const [artifacts, setArtifacts] = useState(INITIAL_ARTIFACT_CORES);
  const [selectedArtifact, setSelectedArtifact] = useState(INITIAL_ARTIFACT_CORES[0]);

  const handleNavigateUpgrade = (artifact) => {
    sound.playClick();
    navigationManager.openPage('upgrade', { artifactId: artifact.id });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050812] text-slate-100 select-none overflow-hidden animate-fade-in">
      {/* 1. TOP HEADER WITH DEDICATED BACK BUTTON */}
      <div className="h-16 px-6 border-b border-amber-500/20 bg-[#070b16]/90 flex items-center justify-between backdrop-blur-md z-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              sound.playClick();
              navigationManager.goBack();
            }}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 border border-slate-700/60 hover:border-amber-400 transition-all group"
            title="Return to previous screen"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-cyber text-xs font-bold uppercase tracking-wider">BACK</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-700/60" />

          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-[0_0_12px_rgba(168,85,247,0.5)]">
              🔮
            </div>
            <div>
              <h1 className="font-cyber font-black text-sm md:text-base tracking-wider text-white uppercase gold-glow-text">
                ARTIFACT GEAR
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">
                Fitness Bio-Enhancement Cores & Capacity Amplifiers
              </p>
            </div>
          </div>
        </div>

        {/* Currency summary */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
            <span>🪙</span>
            <span>{(fitCoins || 3450).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
            <span>💎</span>
            <span>{(blueCrystals || 420).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT BODY */}
      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        {/* LEFT COLUMN: 5 ARTIFACT CORES GRID */}
        <div className="col-span-12 md:col-span-7 lg:col-span-8 p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artifacts.map(art => {
              const isSelected = selectedArtifact.id === art.id;

              return (
                <div
                  key={art.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedArtifact(art);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                    isSelected
                      ? 'bg-[#151326] border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.35)] scale-[1.02]'
                      : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar: Icon + Level */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-slate-700/60 flex items-center justify-center text-2xl shadow-inner">
                      {art.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-cyber font-black text-amber-400">
                        LVL {art.level} / {art.maxLevel}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 uppercase">
                        {art.rarity}
                      </div>
                    </div>
                  </div>

                  {/* Name & Primary Stat */}
                  <div className="my-3">
                    <div className="text-sm font-bold text-white font-cyber tracking-wide">
                      {art.name}
                    </div>
                    <div className="text-xs font-mono text-purple-300 mt-1 flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-purple-400" />
                      <span>{art.statBonus}</span>
                    </div>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1 mb-3">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                      style={{ width: `${(art.level / art.maxLevel) * 100}%` }}
                    />
                  </div>

                  {/* Direct Upgrade Button on Card */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateUpgrade(art);
                    }}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-cyber text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    <span>UPGRADE CORE</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Overview Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <div>
                <div className="text-xs font-bold text-white uppercase font-cyber">
                  RESONANCE POWER BONUS
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  All 5 Core Cores equipped. Synergistic multiplier active (+15% all training XP).
                </div>
              </div>
            </div>
            <div className="text-sm font-cyber font-black text-amber-400">
              ACTIVE
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CORE INSPECTOR & UPGRADE PORTAL */}
        <div className="col-span-12 md:col-span-5 lg:col-span-4 border-l border-slate-800/80 bg-[#060914] p-6 flex flex-col justify-between overflow-y-auto">
          {selectedArtifact && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-950/40 via-slate-900/60 to-black border border-purple-500/30 flex flex-col items-center text-center relative overflow-hidden">
                <div className="text-6xl my-4 filter drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                  {selectedArtifact.icon}
                </div>
                <h2 className="font-cyber font-black text-base text-white uppercase tracking-wider">
                  {selectedArtifact.name}
                </h2>
                <div className="text-xs font-mono text-amber-400 mt-1">
                  CURRENT LEVEL: {selectedArtifact.level} OF {selectedArtifact.maxLevel}
                </div>
              </div>

              {/* Bio-Enhancement Specs */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] font-cyber text-slate-400 uppercase tracking-wider mb-1">
                  CORE MECHANICS
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedArtifact.description}
                </p>
              </div>

              {/* Stat Diff Preview */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                <div className="text-[10px] font-cyber text-purple-300 uppercase tracking-wider flex items-center justify-between">
                  <span>CAPACITY PROJECTION</span>
                  <span className="font-mono">NEXT LEVEL</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-slate-400">Power Output:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-300">+{selectedArtifact.statValue}</span>
                    <span className="text-purple-400">→</span>
                    <span className="text-emerald-400">+{selectedArtifact.statValue + 12}</span>
                  </div>
                </div>
              </div>

              {/* CTA Upgrade Navigation Button */}
              <button
                onClick={() => handleNavigateUpgrade(selectedArtifact)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-cyber text-xs font-black uppercase tracking-widest shadow-[0_0_25px_rgba(245,158,11,0.5)] border border-yellow-300 transition-all flex items-center justify-center space-x-2"
              >
                <span>OPEN UPGRADE WORKBENCH</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
