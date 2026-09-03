import React, { useState } from 'react';
import { 
  User, Shield, Zap, Flame, Award, Heart, Sparkles, 
  Activity, Check, ShoppingBag, Sliders, Settings, HeartHandshake
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

  // Biometrics & Health Care calculations
  const heightM = profile.height / 100;
  const bmi = (profile.weight / (heightM * heightM)).toFixed(1);
  const maxHR = 220 - profile.age;
  const safeZoneLow = Math.round(maxHR * 0.55);
  const safeZoneHigh = Math.round(maxHR * 0.75);

  const getBmiCategory = (val) => {
    if (val < 18.5) return { label: 'Underweight / Lean Matrix', color: 'text-blue-400' };
    if (val < 24.9) return { label: 'Optimal Cybernetic Density', color: 'text-emerald-400' };
    if (val < 29.9) return { label: 'Elevated Mass Index', color: 'text-amber-400' };
    return { label: 'High Kinetic Load', color: 'text-rose-400' };
  };

  const bmiCat = getBmiCategory(bmi);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* 1. Character Identity & Fitness Passport Card */}
      <div className="relative bg-[#0c142a] border-2 border-purple-500/40 rounded-2xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.15)] overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Hologram Avatar Frame */}
          <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border-2 border-purple-400/60 flex items-center justify-center shadow-neon-pink shrink-0">
            <span className="text-5xl filter drop-shadow-[0_0_15px_rgba(168,85,247,0.9)] animate-pulse">
              🧑‍🚀
            </span>
            <div className="absolute -bottom-2 px-2 py-0.5 bg-black border border-purple-400 rounded text-[10px] font-cyber text-purple-300">
              LVL {level}
            </div>
          </div>

          {/* Character Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="px-2 py-0.5 bg-purple-950 border border-purple-500 text-[10px] font-mono text-purple-300 rounded uppercase">
                FITNESS PASSPORT 2050
              </span>
              <span className="text-[10px] font-mono text-slate-400">GUILD: {profile.department}</span>
            </div>

            <h2 className="font-cyber text-2xl md:text-3xl font-black text-white uppercase mt-1">
              {profile.name}
            </h2>
            <p className="font-mono text-xs text-purple-300 font-semibold tracking-wider">
              {profile.goal} • Fitness Explorer
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs font-mono">
              <span className="text-slate-300">
                XP: <strong className="text-cyan-400">{xp.toLocaleString()}</strong>
              </span>
              <span className="text-slate-300">
                FitCoins: <strong className="text-amber-400">{fitCoins.toLocaleString()}</strong>
              </span>
              <span className="text-slate-300">
                Gender: <strong className="text-slate-100">{profile.gender}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => { sound.playClick(); setActiveSubTab('stats'); }}
          className={`px-4 py-2 rounded-lg font-cyber text-xs uppercase tracking-wider transition-all ${
            activeSubTab === 'stats'
              ? 'bg-purple-600 text-white font-black shadow-[0_0_12px_#9333ea]'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Character Attributes
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveSubTab('shop'); }}
          className={`px-4 py-2 rounded-lg font-cyber text-xs uppercase tracking-wider transition-all ${
            activeSubTab === 'shop'
              ? 'bg-purple-600 text-white font-black shadow-[0_0_12px_#9333ea]'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Cyber Gear Shop
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveSubTab('health'); }}
          className={`px-4 py-2 rounded-lg font-cyber text-xs uppercase tracking-wider transition-all ${
            activeSubTab === 'health'
              ? 'bg-purple-600 text-white font-black shadow-[0_0_12px_#9333ea]'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Health Care Profile
        </button>
      </div>

      {/* 2. Character RPG Attributes Tab */}
      {activeSubTab === 'stats' && (
        <div className="bg-[#0b1226] border border-cyan-500/30 rounded-xl p-5 shadow-neon-cyan space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-cyber text-base font-bold text-white uppercase tracking-wider">
                RPG ATTRIBUTES (BIO-GAME STATS)
              </h3>
              <p className="text-xs text-slate-400">
                Grows in real-time as you complete different physical activities in life.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 uppercase">MAX 100 CAP</span>
          </div>

          <div className="space-y-3.5">
            {/* Stamina */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300 flex items-center space-x-1.5">
                  <span>🏃</span>
                  <span className="font-bold">Stamina (Endurance)</span>
                </span>
                <span className="text-cyan-400 font-bold">{attributes.stamina}/100</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] rounded-full" style={{ width: `${attributes.stamina}%` }}></div>
              </div>
            </div>

            {/* Strength */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300 flex items-center space-x-1.5">
                  <span>💪</span>
                  <span className="font-bold">Strength (Hyper-Density)</span>
                </span>
                <span className="text-pink-400 font-bold">{attributes.strength}/100</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                <div className="h-full bg-pink-500 shadow-[0_0_8px_#ec4899] rounded-full" style={{ width: `${attributes.strength}%` }}></div>
              </div>
            </div>

            {/* Energy */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300 flex items-center space-x-1.5">
                  <span>⚡</span>
                  <span className="font-bold">Energy (Mitochondrial Charge)</span>
                </span>
                <span className="text-yellow-400 font-bold">{attributes.energy}/100</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                <div className="h-full bg-yellow-400 shadow-[0_0_8px_#facc15] rounded-full" style={{ width: `${attributes.energy}%` }}></div>
              </div>
            </div>

            {/* Flexibility */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300 flex items-center space-x-1.5">
                  <span>🧘</span>
                  <span className="font-bold">Flexibility (Mobility Flow)</span>
                </span>
                <span className="text-emerald-400 font-bold">{attributes.flexibility}/100</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 shadow-[0_0_8px_#34d399] rounded-full" style={{ width: `${attributes.flexibility}%` }}></div>
              </div>
            </div>

            {/* Consistency */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300 flex items-center space-x-1.5">
                  <span>🔥</span>
                  <span className="font-bold">Consistency (Discipline Matrix)</span>
                </span>
                <span className="text-amber-400 font-bold">{attributes.consistency}/100</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 shadow-[0_0_8px_#f59e0b] rounded-full" style={{ width: `${attributes.consistency}%` }}></div>
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
              className={`p-4 rounded-xl border transition-all ${
                item.equipped 
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-neon-cyan' 
                  : 'bg-[#0b1226] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-cyber text-sm font-bold text-white">{item.name}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                  {item.type}
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-3">{item.desc}</p>

              <div className="flex items-center justify-between text-xs font-mono bg-[#111933] p-2 rounded mb-3">
                <span className="text-emerald-400 font-bold">{item.bonus}</span>
                <span className="text-amber-400 font-bold">{item.cost} FitCoins</span>
              </div>

              <button
                onClick={() => buyEquipment(item.id)}
                className={`w-full py-2 rounded text-xs font-cyber font-bold uppercase tracking-wider transition-all ${
                  item.equipped
                    ? 'bg-cyan-400 text-black shadow-neon-cyan'
                    : item.purchased
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : fitCoins >= item.cost
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_10px_#f59e0b]'
                        : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                }`}
              >
                {item.equipped ? 'EQUIPPED (ACTIVE)' : item.purchased ? 'EQUIP GEAR' : `BUY FOR ${item.cost} COINS`}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. Health Care Safeguard Profile Tab */}
      {activeSubTab === 'health' && (
        <div className="bg-[#0b1226] border border-pink-500/40 rounded-xl p-5 shadow-[0_0_15px_rgba(236,72,153,0.15)] space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <HeartHandshake className="text-pink-400" size={20} />
              <h3 className="font-cyber text-base font-bold text-white uppercase tracking-wider">
                HEALTH CARE & SAFEGUARD METRICS
              </h3>
            </div>
            <button
              onClick={onOpenOnboarding}
              className="px-3 py-1 bg-pink-950 border border-pink-500 text-[11px] font-mono text-pink-300 rounded hover:bg-pink-900/60 transition-colors"
            >
              EDIT HEALTH PROFILE
            </button>
          </div>

          {/* Biometrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-[#121c38] p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">AGE</span>
              <span className="font-cyber text-lg font-bold text-white">{profile.age} Yrs</span>
            </div>

            <div className="bg-[#121c38] p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">HEIGHT</span>
              <span className="font-cyber text-lg font-bold text-white">{profile.height} cm</span>
            </div>

            <div className="bg-[#121c38] p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">WEIGHT</span>
              <span className="font-cyber text-lg font-bold text-white">{profile.weight} kg</span>
            </div>

            <div className="bg-[#121c38] p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">BODY MASS INDEX</span>
              <span className="font-cyber text-lg font-bold text-cyan-400">{bmi}</span>
              <span className={`text-[9px] font-mono block ${bmiCat.color}`}>{bmiCat.label}</span>
            </div>
          </div>

          {/* Safe Target Heart Rate Calculation */}
          <div className="bg-[#121c38] p-4 rounded-xl border border-pink-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-cyber text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Heart size={14} className="text-pink-400 animate-pulse" />
                <span>SAFE TARGET HEART RATE PROTOCOL</span>
              </span>
              <span className="font-mono text-xs text-slate-400">Karvonen Safe Range</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Calculated for your age ({profile.age}) to protect against excessive cardiovascular strain:
            </p>
            <div className="flex items-center space-x-4 font-mono text-xs">
              <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">AEROBIC ZONE</span>
                <span className="text-emerald-400 font-bold">{safeZoneLow} - {safeZoneHigh} BPM</span>
              </div>
              <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">MAX THEORETICAL</span>
                <span className="text-rose-400 font-bold">{maxHR} BPM</span>
              </div>
            </div>
          </div>

          {/* Active Health Safeguards */}
          <div className="bg-[#121c38] p-4 rounded-xl border border-slate-800">
            <span className="font-cyber text-xs font-bold text-white uppercase tracking-wider block mb-2">
              ACTIVE HEALTH CONSIDERATIONS MONITORED BY AI:
            </span>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.healthIssues && profile.healthIssues.map((issue, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-pink-950/80 border border-pink-500/50 text-pink-200 text-xs font-mono rounded">
                  🛡️ {issue}
                </span>
              ))}
            </div>
            {profile.healthNotes && (
              <p className="text-xs font-mono text-slate-300 italic bg-black/40 p-2 rounded border border-slate-800">
                "Note: {profile.healthNotes}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
