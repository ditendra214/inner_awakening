import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Zap, Flame, Award, Heart, Sparkles, 
  Activity, Check, ShoppingBag, Sliders, Settings, HeartHandshake, Crown,
  Volume2, VolumeX, Radio, Music, Lock, Unlock, Play, ChevronRight, LogOut
} from 'lucide-react';
import { useGame, SYSTEM_TONES } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const ProfileView = ({ onOpenOnboarding, initialSubTab = 'stats' }) => {
  const { 
    profile, 
    level, 
    xp, 
    hunterRank,
    fitCoins, 
    blueCrystals,
    attributes, 
    equipmentStats,
    playerEquipment,
    inventory, 
    buyEquipment,
    soundMuted,
    toggleSound,
    soundVolume,
    setVolumeLevel,
    ambientActive,
    toggleAmbient,
    unlockedTones,
    activeSystemTone,
    changeActiveSystemTone,
    logoutPlayer,
    posters,
    activePoster
  } = useGame();

  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // 'stats' | 'shop' | 'health' | 'settings'

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const heightM = profile.height / 100;
  const bmi = (profile.weight / (heightM * heightM)).toFixed(1);
  const maxHR = 220 - profile.age;
  const safeZoneLow = Math.round(maxHR * 0.55);
  const safeZoneHigh = Math.round(maxHR * 0.75);

  const getBmiCategory = (val) => {
    if (val < 18.5) return { label: 'Underweight / Lean Matrix', color: 'text-blue-400' };
    if (val < 24.9) return { label: 'Optimal Player Density', color: 'text-[#39ff14]' };
    if (val < 29.9) return { label: 'Elevated Mass Index', color: 'text-amber-400' };
    return { label: 'High Kinetic Load', color: 'text-rose-400' };
  };

  const bmiCat = getBmiCategory(bmi);
  const currentHP = 8500 + level * 750;
  const currentMP = 1200 + level * 180;

  // Filter tones that are unlocked in user collection
  const userUnlockedTones = SYSTEM_TONES.filter(t => unlockedTones.includes(t.id));
  const currentPoster = posters?.find(p => p.id === activePoster) || posters?.[0];

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative z-10">
      {/* 1. Solo Leveling System Status Window Card */}
      <div className="relative bg-[#0d0903] border-2 border-[#ffbe3b] rounded-2xl p-6 shadow-neon-gold overflow-hidden system-window">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Hologram Avatar Frame with Hunter Rank */}
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a1b05] to-[#0d0903] border-2 border-[#ffd700] flex items-center justify-center shadow-neon-gold shrink-0">
            {currentPoster?.image ? (
              <img 
                src={currentPoster.image} 
                alt="Awakened Hunter Character" 
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <span className="text-5xl filter drop-shadow-[0_0_15px_rgba(255,215,0,0.9)] animate-pulse">
                👑
              </span>
            )}
            <div className="absolute -bottom-0.5 px-2.5 py-0.5 bg-black/90 border border-[#ffd700] rounded text-[10px] font-cyber text-[#ffd700] font-bold tracking-wider whitespace-nowrap shadow-[0_0_8px_rgba(255,215,0,0.4)] z-10">
              LVL {level} • {hunterRank.rank}
            </div>
          </div>

          {/* Player Details: Hunter Rank prominently featured */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 bg-[#2a1a05] border border-[#ffd700] text-[10px] font-mono text-[#ffd700] rounded uppercase font-bold shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                [ SYSTEM: STATUS WINDOW ]
              </span>
              <span className="px-2.5 py-0.5 bg-[#1f1505] border border-[#ffbe3b]/60 text-[10px] font-mono text-[#ffd700] font-bold rounded uppercase">
                RANK: {hunterRank.rank}
              </span>
              <span className="text-[10px] font-mono text-amber-300/80">
                {hunterRank.aura}
              </span>
            </div>

            <h2 className="font-cyber text-2xl md:text-3xl font-black text-white uppercase mt-1.5 gold-glow-text">
              {profile.name}
            </h2>
            <p className="font-mono text-xs text-[#ffd700] font-semibold tracking-wider">
              {profile.goal} • {hunterRank.title}
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
                Gold: <strong className="text-[#ffd700]">{fitCoins.toLocaleString()}</strong>
              </span>
              <span className="text-cyan-200">
                Crystals: <strong className="text-cyan-300">💎 {(blueCrystals || 0).toLocaleString()}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#ffbe3b]/30 pb-2 overflow-x-auto">
        <button
          onClick={() => { sound.playClick(); setActiveSubTab('stats'); }}
          className={`px-3.5 py-2 rounded-lg font-cyber text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeSubTab === 'stats'
              ? 'bg-[#ffd700] text-black font-black shadow-neon-gold'
              : 'bg-[#140e04] text-amber-400/80 hover:text-white border border-[#ffbe3b]/30'
          }`}
        >
          Player Attributes
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveSubTab('shop'); }}
          className={`px-3.5 py-2 rounded-lg font-cyber text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeSubTab === 'shop'
              ? 'bg-[#ffd700] text-black font-black shadow-neon-gold'
              : 'bg-[#140e04] text-amber-400/80 hover:text-white border border-[#ffbe3b]/30'
          }`}
        >
          Artifact Gear Shop
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveSubTab('health'); }}
          className={`px-3.5 py-2 rounded-lg font-cyber text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeSubTab === 'health'
              ? 'bg-[#ffd700] text-black font-black shadow-neon-gold'
              : 'bg-[#140e04] text-amber-400/80 hover:text-white border border-[#ffbe3b]/30'
          }`}
        >
          Health Safeguards
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveSubTab('settings'); }}
          className={`px-3.5 py-2 rounded-lg font-cyber text-xs uppercase tracking-wider transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeSubTab === 'settings'
              ? 'bg-[#ffd700] text-black font-black shadow-neon-gold'
              : 'bg-[#140e04] text-amber-400/80 hover:text-white border border-[#ffbe3b]/30'
          }`}
        >
          <Settings size={13} />
          <span>System Settings</span>
        </button>
      </div>

      {/* 2. Character RPG Attributes Tab */}
      {activeSubTab === 'stats' && (
        <div className="bg-[#0e0903] border border-[#ffbe3b] rounded-xl p-5 shadow-neon-gold space-y-4 system-window">
          <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-3">
            <div>
              <h3 className="font-cyber text-base font-bold text-white uppercase tracking-wider">
                [ PLAYER ATTRIBUTES: BIO-GAME METRICS ]
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
                <span className="text-[#ffd700] font-bold">
                  {attributes.stamina}/100
                  {equipmentStats?.stamina > 0 && (
                    <span className="text-emerald-400 font-normal text-[10px] ml-1.5">
                      (+{equipmentStats.stamina} gear)
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#120d03] rounded-full border border-[#ffbe3b]/40 overflow-hidden">
                <div className="h-full bg-[#ffd700] shadow-[0_0_8px_#ffd700] rounded-full" style={{ width: `${Math.min(100, attributes.stamina + (equipmentStats?.stamina || 0))}%` }}></div>
              </div>
            </div>

            {/* Strength */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-amber-100 flex items-center space-x-1.5">
                  <span>💪</span>
                  <span className="font-bold">Strength (Hyper-Density Muscle)</span>
                </span>
                <span className="text-[#f59e0b] font-bold">
                  {attributes.strength}/100
                  {equipmentStats?.strength > 0 && (
                    <span className="text-emerald-400 font-normal text-[10px] ml-1.5">
                      (+{equipmentStats.strength} gear)
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#120d03] rounded-full border border-[#ffbe3b]/40 overflow-hidden">
                <div className="h-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] rounded-full" style={{ width: `${Math.min(100, attributes.strength + (equipmentStats?.strength || 0))}%` }}></div>
              </div>
            </div>

            {/* Energy */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-amber-100 flex items-center space-x-1.5">
                  <span>⚡</span>
                  <span className="font-bold">Energy (Sense / Mana Capacity)</span>
                </span>
                <span className="text-[#ffea75] font-bold">
                  {attributes.energy}/100
                  {equipmentStats?.mana > 0 && (
                    <span className="text-purple-400 font-normal text-[10px] ml-1.5">
                      (+{equipmentStats.mana} mana)
                    </span>
                  )}
                </span>
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

            {/* Vault Equipment Buffs Summary Card */}
            {equipmentStats && (equipmentStats.strength > 0 || equipmentStats.stamina > 0 || equipmentStats.agility > 0 || equipmentStats.mana > 0) && (
              <div className="mt-4 pt-3 border-t border-[#ffbe3b]/30 bg-[#160f04] p-3 rounded-xl border border-[#ffd700]/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-cyber font-bold text-[#ffd700] uppercase tracking-wider flex items-center space-x-1.5">
                    <span>👑</span>
                    <span>ACTIVE VAULT CUSTOMIZATION BUFFS</span>
                  </span>
                  <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded">
                    LIVE SYNC
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="bg-[#0b0802] p-2 rounded-lg border border-[#ffbe3b]/20">
                    <span className="text-gray-400 text-[9px] block uppercase">STRENGTH</span>
                    <span className="text-[#f59e0b] font-bold">+{equipmentStats.strength} STR</span>
                  </div>
                  <div className="bg-[#0b0802] p-2 rounded-lg border border-[#ffbe3b]/20">
                    <span className="text-gray-400 text-[9px] block uppercase">STAMINA</span>
                    <span className="text-emerald-400 font-bold">+{equipmentStats.stamina} STA</span>
                  </div>
                  <div className="bg-[#0b0802] p-2 rounded-lg border border-[#ffbe3b]/20">
                    <span className="text-gray-400 text-[9px] block uppercase">AGILITY</span>
                    <span className="text-cyan-400 font-bold">+{equipmentStats.agility} AGI</span>
                  </div>
                  <div className="bg-[#0b0802] p-2 rounded-lg border border-[#ffbe3b]/20">
                    <span className="text-gray-400 text-[9px] block uppercase">MANA</span>
                    <span className="text-purple-400 font-bold">+{equipmentStats.mana} MP</span>
                  </div>
                </div>
              </div>
            )}
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

      {/* 5. System Settings Tab (Moved Audio Controls & Tone Selection here!) */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6">
          {/* Section 1: System Audio & Mute Controls */}
          <div className="bg-[#0e0903] border border-[#ffbe3b] rounded-xl p-5 shadow-neon-gold space-y-4 system-window">
            <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-3">
              <div className="flex items-center space-x-2">
                <Volume2 className="text-[#ffd700]" size={20} />
                <h3 className="font-cyber text-base font-bold text-white uppercase tracking-wider">
                  AUDIO & SYSTEM CHIME ENGINE
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#ffd700] uppercase font-bold">
                [ CONTROLS MOVED TO SETTINGS ]
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mute Audio Toggle Button */}
              <div className="bg-[#160f04] p-4 rounded-xl border border-[#ffbe3b]/30 flex items-center justify-between">
                <div>
                  <h4 className="font-cyber text-xs font-bold text-white uppercase tracking-wider">
                    MASTER AUDIO MUTE
                  </h4>
                  <p className="text-[11px] font-mono text-amber-300/70 mt-0.5">
                    {soundMuted ? 'All audio and tones are silenced' : 'Audio output is active and clear'}
                  </p>
                </div>

                <button
                  onClick={toggleSound}
                  className={`px-4 py-2 rounded-lg font-cyber text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                    soundMuted 
                      ? 'bg-rose-950 border border-rose-600 text-rose-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]' 
                      : 'bg-[#ffd700] text-black shadow-neon-gold'
                  }`}
                >
                  {soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  <span>{soundMuted ? 'MUTED' : 'UNMUTED'}</span>
                </button>
              </div>

              {/* Ambient Drone Toggle */}
              <div className="bg-[#160f04] p-4 rounded-xl border border-[#ffbe3b]/30 flex items-center justify-between">
                <div>
                  <h4 className="font-cyber text-xs font-bold text-white uppercase tracking-wider">
                    SHADOW AMBIENT DRONE
                  </h4>
                  <p className="text-[11px] font-mono text-amber-300/70 mt-0.5">
                    {ambientActive ? 'Binaural shadow mist active' : 'Sub-bass ambient drone off'}
                  </p>
                </div>

                <button
                  onClick={toggleAmbient}
                  className={`px-4 py-2 rounded-lg font-cyber text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                    ambientActive 
                      ? 'bg-[#3b82f6] text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                      : 'bg-[#221603] border border-[#ffbe3b]/50 text-[#ffd700]'
                  }`}
                >
                  <Radio size={15} className={ambientActive ? 'animate-pulse' : ''} />
                  <span>{ambientActive ? 'ACTIVE' : 'STANDBY'}</span>
                </button>
              </div>
            </div>

            {/* Volume Slider */}
            <div className="bg-[#160f04] p-4 rounded-xl border border-[#ffbe3b]/30">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-amber-200 uppercase font-bold">SYSTEM VOLUME INTENSITY</span>
                <span className="text-[#ffd700] font-bold">{Math.round(soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundVolume}
                onChange={(e) => setVolumeLevel(e.target.value)}
                className="w-full accent-[#ffd700] bg-[#0c0802] rounded-lg h-2 cursor-pointer"
              />
            </div>
          </div>

          {/* Section 2: Set User's Own System Tone (Strictly Unlocked Collection Only) */}
          <div className="bg-[#0e0903] border border-[#ffbe3b] rounded-xl p-5 shadow-neon-gold space-y-5 system-window">
            <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-3">
              <div className="flex items-center space-x-2">
                <Music className="text-[#ffd700]" size={20} />
                <h3 className="font-cyber text-base font-bold text-white uppercase tracking-wider">
                  CUSTOM SYSTEM TONE COLLECTION
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#ffd700] uppercase font-bold">
                {userUnlockedTones.length} UNLOCKED
              </span>
            </div>

            <p className="text-xs font-sans text-amber-100/90 leading-relaxed">
              Equip your custom Solo Leveling alert sound. System tones are unlocked as <strong className="text-[#ffd700]">Mission Rewards</strong> upon clearing specific physical training quests. Only tones you have unlocked appear in your active selection.
            </p>

            {/* Active System Tone Selector - Only Shows Unlocked Collection */}
            <div className="bg-[#160f04] p-4 rounded-xl border-2 border-[#ffd700] shadow-neon-gold">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
                EQUIPPED SYSTEM TONE (ACTIVE SOUND)
              </span>

              <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                <select
                  value={activeSystemTone}
                  onChange={(e) => changeActiveSystemTone(e.target.value)}
                  className="w-full sm:flex-1 bg-[#090602] border border-[#ffbe3b] rounded-lg px-3.5 py-2.5 text-white font-cyber text-xs uppercase tracking-wider focus:outline-none focus:border-[#ffd700]"
                >
                  {/* User Collection Only */}
                  {userUnlockedTones.map((tone) => (
                    <option key={tone.id} value={tone.id} className="bg-[#090602] text-white">
                      ✓ {tone.name} [{tone.badge}]
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => sound.playSoloLevelingMessageTone()}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#e69500] to-[#ffd700] hover:from-[#ffd700] hover:to-[#ffea75] text-black font-cyber font-black text-xs uppercase tracking-widest rounded-lg shadow-neon-gold flex items-center justify-center space-x-1.5 transition-all"
                  title="Test active system chime"
                >
                  <Play size={14} className="fill-black" />
                  <span>TEST TONE</span>
                </button>
              </div>
            </div>

            {/* Complete System Tones & Mission Rewards Gallery */}
            <div>
              <h4 className="font-cyber text-xs font-bold text-white uppercase tracking-wider mb-3">
                SYSTEM TONE REWARDS & CATALOGUE
              </h4>

              <div className="space-y-2.5">
                {SYSTEM_TONES.map((tone) => {
                  const isUnlocked = unlockedTones.includes(tone.id);
                  const isEquipped = activeSystemTone === tone.id;

                  return (
                    <div
                      key={tone.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isEquipped
                          ? 'bg-[#221603] border-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.3)]'
                          : isUnlocked
                            ? 'bg-[#140e04] border-[#ffbe3b]/40'
                            : 'bg-[#090602]/70 border-stone-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          isEquipped ? 'bg-[#ffd700] text-black' : isUnlocked ? 'bg-[#261b05] text-[#ffd700]' : 'bg-stone-900 text-stone-600'
                        }`}>
                          {isUnlocked ? <Unlock size={16} /> : <Lock size={16} />}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-cyber text-xs font-bold text-white uppercase">
                              {tone.name}
                            </span>
                            {isEquipped && (
                              <span className="px-1.5 py-0.2 bg-[#ffd700] text-black text-[9px] font-mono font-bold rounded">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-amber-200/80 mt-0.5">
                            {tone.description}
                          </p>
                          {!isUnlocked && tone.missionTitle && (
                            <p className="text-[10px] font-mono text-amber-400 mt-1 flex items-center space-x-1">
                              <span>🔒</span>
                              <span>Unlock by completing: <strong>{tone.missionTitle}</strong></span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                        {isUnlocked ? (
                          <>
                            <button
                              onClick={() => sound.playSystemTone(tone.id)}
                              className="p-1.5 rounded bg-[#1a1104] hover:bg-[#281b05] text-[#ffd700] border border-[#ffbe3b]/40 transition-colors"
                              title="Preview sound"
                            >
                              <Play size={14} className="fill-[#ffd700]" />
                            </button>

                            <button
                              onClick={() => changeActiveSystemTone(tone.id)}
                              disabled={isEquipped}
                              className={`px-3 py-1.5 rounded font-cyber text-[10px] uppercase font-bold tracking-wider transition-all ${
                                isEquipped 
                                  ? 'bg-[#ffd700] text-black cursor-default' 
                                  : 'bg-[#261a05] hover:bg-[#ffbe3b]/20 text-[#ffd700] border border-[#ffd700]'
                              }`}
                            >
                              {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] font-mono text-stone-500 uppercase">
                            MISSION LOCKED
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Health Profile & Session Management */}
          <div className="bg-[#0e0903] border border-[#ffbe3b]/40 rounded-xl p-5 system-window space-y-4">
            <h3 className="font-cyber text-xs font-bold text-white uppercase tracking-wider border-b border-[#ffbe3b]/20 pb-2">
              HUNTER IDENTITY & DISCONNECT PROTOCOL
            </h3>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={onOpenOnboarding}
                className="px-4 py-2 rounded bg-[#1f1505] border border-[#ffd700] text-[#ffd700] font-mono text-xs uppercase hover:bg-[#ffbe3b]/20 transition-all flex items-center space-x-1.5"
              >
                <HeartHandshake size={14} />
                <span>EDIT HEALTH PROFILE</span>
              </button>

              <button
                onClick={logoutPlayer}
                className="px-4 py-2 rounded bg-[#2e0904] hover:bg-[#480e07] text-rose-300 border border-rose-600/50 font-cyber font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)]"
              >
                <LogOut size={14} />
                <span>LOG OUT / DISCONNECT SESSION</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
