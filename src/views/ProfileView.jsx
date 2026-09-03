import React, { useState } from 'react';
import { 
  User, Shield, Zap, Flame, Award, Heart, Sparkles, 
  Activity, Check, ShoppingBag, Sliders, Settings, HeartHandshake, Crown
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const ProfileView = ({ onOpenOnboarding }) => {
  const { 
    profile, 
    level, 
    xp, 
    fitCoins, 
    attributes, 
    inventory, 
    buyEquipment 
  } = useGame();

  const [activeSubTab, setActiveSubTab] = useState('stats'); // 'stats' | 'shop' | 'health'

  const heightM = profile.height / 100;
  const bmi = (profile.weight / (heightM * heightM)).toFixed(1);
  const maxHR = 220 - profile.age;
  const safeZoneLow = Math.round(maxHR * 0.55);
  const safeZoneHigh = Math.round(maxHR * 0.75);

  const getBmiCategory = (val) => {
    if (val < 18.5) return { label: 'Underweight / Lean Matrix', color: 'text-blue-400' };
    if (val < 24.9) return { label: 'Optimal Hunter Density', color: 'text-[#39ff14]' };
    if (val < 29.9) return { label: 'Elevated Mass Index', color: 'text-amber-400' };
    return { label: 'High Kinetic Load', color: 'text-rose-400' };
  };

  const bmiCat = getBmiCategory(bmi);
  const currentHP = 8500 + level * 750;
  const currentMP = 1200 + level * 180;

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative z-10">
      {/* 1. Solo Leveling System Status Window Card */}
      <div className="relative bg-[#0d0903] border-2 border-[#ffbe3b] rounded-2xl p-6 shadow-neon-gold overflow-hidden system-window">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Hologram Avatar Frame */}
          <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-[#2a1b05] to-[#0d0903] border-2 border-[#ffd700] flex items-center justify-center shadow-neon-gold shrink-0">
            <span className="text-5xl filter drop-shadow-[0_0_15px_rgba(255,215,0,0.9)] animate-pulse">
              👑
            </span>
            <div className="absolute -bottom-2 px-2.5 py-0.5 bg-black border border-[#ffd700] rounded text-[10px] font-cyber text-[#ffd700] font-bold">
              LVL {level}
            </div>
          </div>

          {/* Hunter Details matching uploaded photo */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="px-2.5 py-0.5 bg-[#2a1a05] border border-[#ffd700] text-[10px] font-mono text-[#ffd700] rounded uppercase font-bold">
                [ STATUS WINDOW ]
              </span>
              <span className="text-[10px] font-mono text-amber-300">GUILD: {profile.department}</span>
            </div>

            <h2 className="font-cyber text-2xl md:text-3xl font-black text-white uppercase mt-1 gold-glow-text">
              {profile.name}
            </h2>
            <p className="font-mono text-xs text-[#ffd700] font-semibold tracking-wider">
              {profile.goal} • The Conqueror of Adversity
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs font-mono">
              <span className="text-amber-200">
                HP: <strong className="text-[#34d399]">{currentHP.toLocaleString()}</strong>
              </span>
              <span className="text-amber-200">
                MP: <strong className="text-[#60a5fa]">{currentMP.toLocaleString()}</strong>
              </span>
              <span className="text-amber-200">
                XP: <strong className="text-[#ffd700]">{xp.toLocaleString()}</strong>
              </span>
              <span className="text-amber-200">
                FitCoins: <strong className="text-[#ffd700]">{fitCoins.toLocaleString()}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="flex items-center space-x-2 border-b border-[#ffbe3b]/30 pb-2">
        <button
          onClick={() => { sound.playClick(); setActiveSubTab('stats'); }}
          className={`px-4 py-2 rounded-lg font-cyber text-xs uppercase tracking-wider transition-all ${
            activeSubTab === 'stats'
              ? 'bg-[#ffd700] text-black font-black shadow-neon-gold'
              : 'bg-[#140e04] text-amber-400/80 hover:text-white border border-[#ffbe3b]/30'
          }`}
        >
          Hunter Attributes
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveSubTab('shop'); }}
          className={`px-4 py-2 rounded-lg font-cyber text-xs uppercase tracking-wider transition-all ${
            activeSubTab === 'shop'
              ? 'bg-[#ffd700] text-black font-black shadow-neon-gold'
              : 'bg-[#140e04] text-amber-400/80 hover:text-white border border-[#ffbe3b]/30'
          }`}
        >
          Artifact Gear Shop
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveSubTab('health'); }}
          className={`px-4 py-2 rounded-lg font-cyber text-xs uppercase tracking-wider transition-all ${
            activeSubTab === 'health'
              ? 'bg-[#ffd700] text-black font-black shadow-neon-gold'
              : 'bg-[#140e04] text-amber-400/80 hover:text-white border border-[#ffbe3b]/30'
          }`}
        >
          Health Safeguard Matrix
        </button>
      </div>

      {/* 2. Character RPG Attributes Tab */}
      {activeSubTab === 'stats' && (
        <div className="bg-[#0e0903] border border-[#ffbe3b] rounded-xl p-5 shadow-neon-gold space-y-4 system-window">
          <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-3">
            <div>
              <h3 className="font-cyber text-base font-bold text-white uppercase tracking-wider">
                [ HUNTER ATTRIBUTES: BIO-GAME METRICS ]
              </h3>
              <p className="text-xs text-amber-200/70">
                Grows in real-time as you complete real-life physical activity and quests.
              </p>
            </div>
            <span className="text-xs font-mono text-[#ffd700] uppercase font-bold">100 AP CAP</span>
          </div>

          <div className="space-y-3.5">
            {/* Stamina */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-amber-100 flex items-center space-x-1.5">
                  <span>🏃</span>
                  <span className="font-bold">Stamina (Agility & Aerobic V02)</span>
                </span>
                <span className="text-[#ffd700] font-bold">{attributes.stamina}/100</span>
              </div>
              <div className="w-full h-2.5 bg-[#120d03] rounded-full border border-[#ffbe3b]/40 overflow-hidden">
                <div className="h-full bg-[#ffd700] shadow-[0_0_8px_#ffd700] rounded-full" style={{ width: `${attributes.stamina}%` }}></div>
              </div>
            </div>

            {/* Strength */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-amber-100 flex items-center space-x-1.5">
                  <span>💪</span>
                  <span className="font-bold">Strength (Hyper-Density Muscle)</span>
                </span>
                <span className="text-[#f59e0b] font-bold">{attributes.strength}/100</span>
              </div>
              <div className="w-full h-2.5 bg-[#120d03] rounded-full border border-[#ffbe3b]/40 overflow-hidden">
                <div className="h-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] rounded-full" style={{ width: `${attributes.strength}%` }}></div>
              </div>
            </div>

            {/* Energy */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-amber-100 flex items-center space-x-1.5">
                  <span>⚡</span>
                  <span className="font-bold">Energy (Sense / Mana Capacity)</span>
                </span>
                <span className="text-[#ffea75] font-bold">{attributes.energy}/100</span>
              </div>
              <div className="w-full h-2.5 bg-[#120d03] rounded-full border border-[#ffbe3b]/40 overflow-hidden">
                <div className="h-full bg-[#ffea75] shadow-[0_0_8px_#ffea75] rounded-full" style={{ width: `${attributes.energy}%` }}></div>
              </div>
            </div>

            {/* Flexibility */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-amber-100 flex items-center space-x-1.5">
                  <span>🧘</span>
                  <span className="font-bold">Flexibility (Vitality & Recovery)</span>
                </span>
                <span className="text-[#34d399] font-bold">{attributes.flexibility}/100</span>
              </div>
              <div className="w-full h-2.5 bg-[#120d03] rounded-full border border-[#ffbe3b]/40 overflow-hidden">
                <div className="h-full bg-[#34d399] shadow-[0_0_8px_#34d399] rounded-full" style={{ width: `${attributes.flexibility}%` }}></div>
              </div>
            </div>

            {/* Consistency */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-amber-100 flex items-center space-x-1.5">
                  <span>🔥</span>
                  <span className="font-bold">Consistency (Discipline & Habit Matrix)</span>
                </span>
                <span className="text-[#e69500] font-bold">{attributes.consistency}/100</span>
              </div>
              <div className="w-full h-2.5 bg-[#120d03] rounded-full border border-[#ffbe3b]/40 overflow-hidden">
                <div className="h-full bg-[#e69500] shadow-[0_0_8px_#e69500] rounded-full" style={{ width: `${attributes.consistency}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Cyber Gear Shop Tab */}
      {activeSubTab === 'shop' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inventory.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all system-window ${
                item.equipped 
                  ? 'bg-[#221603] border-[#ffd700] shadow-neon-gold' 
                  : 'bg-[#0f0a03] border-amber-950/70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-cyber text-sm font-bold text-white">{item.name}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#201504] text-[#ffd700] uppercase border border-[#ffbe3b]/40">
                  {item.type}
                </span>
              </div>
              <p className="text-xs text-amber-100/80 mb-3">{item.desc}</p>

              <div className="flex items-center justify-between text-xs font-mono bg-[#1a1104] p-2 rounded mb-3 border border-[#ffbe3b]/20">
                <span className="text-[#39ff14] font-bold">{item.bonus}</span>
                <span className="text-[#ffd700] font-bold">{item.cost} FitCoins</span>
              </div>

              <button
                onClick={() => buyEquipment(item.id)}
                className={`w-full py-2 rounded text-xs font-cyber font-bold uppercase tracking-wider transition-all ${
                  item.equipped
                    ? 'bg-[#ffd700] text-black shadow-neon-gold'
                    : item.purchased
                      ? 'bg-[#332205] hover:bg-[#4d3308] text-white border border-[#ffbe3b]/50'
                      : fitCoins >= item.cost
                        ? 'bg-gradient-to-r from-[#e69500] to-[#ffd700] text-black font-black shadow-neon-gold'
                        : 'bg-[#150e04] text-amber-600/50 cursor-not-allowed'
                }`}
              >
                {item.equipped ? 'EQUIPPED (ACTIVE ARTIFACT)' : item.purchased ? 'EQUIP ARTIFACT' : `ACQUIRE FOR ${item.cost} COINS`}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. Health Care Safeguard Profile Tab */}
      {activeSubTab === 'health' && (
        <div className="bg-[#0e0903] border border-[#ffbe3b] rounded-xl p-5 shadow-neon-gold space-y-5 system-window">
          <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-3">
            <div className="flex items-center space-x-2">
              <HeartHandshake className="text-[#ffd700]" size={20} />
              <h3 className="font-cyber text-base font-bold text-white uppercase tracking-wider">
                HEALTH CARE & SAFEGUARD METRICS
              </h3>
            </div>
            <button
              onClick={onOpenOnboarding}
              className="px-3 py-1 bg-[#281a04] border border-[#ffd700] text-[11px] font-mono text-[#ffd700] rounded hover:bg-[#ffbe3b]/30 transition-colors"
            >
              EDIT HEALTH PROFILE
            </button>
          </div>

          {/* Biometrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-[#181003] p-3 rounded-lg border border-[#ffbe3b]/30">
              <span className="text-[10px] font-mono text-amber-400/80 block uppercase">AGE</span>
              <span className="font-cyber text-lg font-bold text-white">{profile.age} Yrs</span>
            </div>

            <div className="bg-[#181003] p-3 rounded-lg border border-[#ffbe3b]/30">
              <span className="text-[10px] font-mono text-amber-400/80 block uppercase">HEIGHT</span>
              <span className="font-cyber text-lg font-bold text-white">{profile.height} cm</span>
            </div>

            <div className="bg-[#181003] p-3 rounded-lg border border-[#ffbe3b]/30">
              <span className="text-[10px] font-mono text-amber-400/80 block uppercase">WEIGHT</span>
              <span className="font-cyber text-lg font-bold text-white">{profile.weight} kg</span>
            </div>

            <div className="bg-[#181003] p-3 rounded-lg border border-[#ffbe3b]/30">
              <span className="text-[10px] font-mono text-amber-400/80 block uppercase">BODY MASS INDEX</span>
              <span className="font-cyber text-lg font-bold text-[#ffd700]">{bmi}</span>
              <span className={`text-[9px] font-mono block ${bmiCat.color}`}>{bmiCat.label}</span>
            </div>
          </div>

          {/* Safe Target Heart Rate Calculation */}
          <div className="bg-[#181003] p-4 rounded-xl border border-[#ffbe3b]/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-cyber text-xs font-bold text-[#ffd700] uppercase tracking-wider flex items-center space-x-1.5">
                <Heart size={14} className="text-[#ffd700] animate-pulse" />
                <span>SAFE TARGET HEART RATE PROTOCOL</span>
              </span>
              <span className="font-mono text-xs text-amber-400/70">Karvonen Safe Range</span>
            </div>
            <p className="text-xs text-amber-100/80 mb-3">
              Calculated for your age ({profile.age}) to protect against excessive cardiovascular strain during high-exertion training:
            </p>
            <div className="flex items-center space-x-4 font-mono text-xs">
              <div className="bg-[#0d0802] px-3 py-1.5 rounded border border-[#ffbe3b]/30">
                <span className="text-amber-500/70 block text-[10px]">AEROBIC ZONE</span>
                <span className="text-[#34d399] font-bold">{safeZoneLow} - {safeZoneHigh} BPM</span>
              </div>
              <div className="bg-[#0d0802] px-3 py-1.5 rounded border border-[#ffbe3b]/30">
                <span className="text-amber-500/70 block text-[10px]">MAX SAFE LIMIT</span>
                <span className="text-rose-400 font-bold">{maxHR} BPM</span>
              </div>
            </div>
          </div>

          {/* Active Health Safeguards */}
          <div className="bg-[#181003] p-4 rounded-xl border border-[#ffbe3b]/30">
            <span className="font-cyber text-xs font-bold text-white uppercase tracking-wider block mb-2">
              ACTIVE HEALTH SAFEGUARDS MONITORED BY SYSTEM:
            </span>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.healthIssues && profile.healthIssues.map((issue, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-[#261904] border border-[#ffd700]/60 text-amber-100 text-xs font-mono rounded">
                  🛡️ {issue}
                </span>
              ))}
            </div>
            {profile.healthNotes && (
              <p className="text-xs font-mono text-amber-200/80 italic bg-[#0d0802] p-2 rounded border border-amber-950">
                "Note: {profile.healthNotes}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
