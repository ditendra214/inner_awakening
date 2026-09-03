import React, { useState } from 'react';
import { 
  Zap, Flame, Shield, Trophy, Activity, Footprints, 
  Dumbbell, Sparkles, AlertTriangle, ArrowUpRight, CheckCircle2, Play, Music
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const HomeView = ({ setActiveTab }) => {
  const { 
    profile, 
    level, 
    xp, 
    currentThreshold, 
    fitCoins, 
    streak, 
    energy, 
    missions, 
    completeMission, 
    logActivity,
    setShowLevelUpAlert,
    setLevelUpMessage
  } = useGame();

  const [simSteps, setSimSteps] = useState(1000);
  const [simWorkout, setSimWorkout] = useState(20);
  const [logSuccessMessage, setLogSuccessMessage] = useState('');

  const activeMission = missions.find(m => !m.completed) || missions[0];
  const xpPercent = Math.min(100, Math.round((xp / currentThreshold) * 100));

  const handleSimulateSteps = () => {
    sound.playSoloLevelingMessageTone();
    logActivity('steps', Number(simSteps));
    setLogSuccessMessage(`[SYSTEM LOG]: ${simSteps} steps recorded. Hunter XP and Golden Mana harvested!`);
    setTimeout(() => setLogSuccessMessage(''), 3500);
  };

  const handleSimulateWorkout = () => {
    sound.playSoloLevelingMessageTone();
    logActivity('workout', Number(simWorkout));
    setLogSuccessMessage(`[SYSTEM LOG]: ${simWorkout} min workout complete. Strength attribute reinforced!`);
    setTimeout(() => setLogSuccessMessage(''), 3500);
  };

  const triggerWireframeNotification = () => {
    sound.playSoloLevelingMessageTone();
    setLevelUpMessage("Your next level awaits. Are you ready to prove yourself?");
    setShowLevelUpAlert(true);
  };

  // Solo leveling HP / MP mapping
  const currentHP = 8500 + level * 750;
  const currentMP = 1200 + level * 180;

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative z-10">
      {/* Visual background rain subtle layer */}
      <div className="rain-container"></div>

      {/* Floating Curved Solo Leveling System Windows Banner */}
      <div className="relative bg-[#0c0903]/85 border border-[#ffbe3b]/50 rounded-2xl p-5 md:p-6 shadow-neon-gold overflow-hidden system-window">
        {/* Subtle glow aura */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#ffd700]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Solo Leveling System Status Window */}
          <div className="flex-1 w-full">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] font-mono text-[#ffd700] uppercase tracking-widest px-2.5 py-0.5 bg-[#261a05] border border-[#ffbe3b]/60 rounded shadow-[0_0_8px_rgba(255,190,59,0.2)]">
                [ SYSTEM: STATUS WINDOW ]
              </span>
              <span className="text-[11px] font-mono text-[#39ff14] flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-[#39ff14] rounded-full animate-ping"></span>
                <span>HUNTER AWAKENED</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-3">
              <h2 className="font-cyber text-2xl md:text-3xl font-black text-white uppercase tracking-wider gold-glow-text">
                {profile.name}
              </h2>
              <span className="text-xs font-mono text-[#ffbe3b] font-bold">
                [ TITLE: THE CONQUEROR OF ADVERSITY ]
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 font-mono text-xs text-amber-200/90">
              <div className="bg-[#191104] p-1.5 rounded border border-[#ffbe3b]/30">
                <span className="text-[10px] text-amber-400/60 block">JOB</span>
                <span className="font-bold text-white truncate block">{profile.goal}</span>
              </div>
              <div className="bg-[#191104] p-1.5 rounded border border-[#ffbe3b]/30">
                <span className="text-[10px] text-amber-400/60 block">LEVEL</span>
                <span className="font-bold text-[#ffd700]">LV. {level}</span>
              </div>
              <div className="bg-[#191104] p-1.5 rounded border border-[#ffbe3b]/30">
                <span className="text-[10px] text-amber-400/60 block">HP</span>
                <span className="font-bold text-[#34d399]">{currentHP.toLocaleString()}</span>
              </div>
              <div className="bg-[#191104] p-1.5 rounded border border-[#ffbe3b]/30">
                <span className="text-[10px] text-amber-400/60 block">MP</span>
                <span className="font-bold text-[#60a5fa]">{currentMP.toLocaleString()}</span>
              </div>
            </div>

            {/* Level & XP Gauge */}
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-[#ffd700] font-bold">ASCENSION TO LEVEL {level + 1}</span>
                <span className="text-amber-300">{xp} / {currentThreshold} XP ({xpPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-[#120d03] rounded-full border border-[#ffbe3b]/60 overflow-hidden p-0.5 shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]">
                <div 
                  className="h-full bg-gradient-to-r from-[#e69500] via-[#ffd700] to-[#fff1a8] rounded-full transition-all duration-500 shadow-[0_0_12px_#ffd700]"
                  style={{ width: `${xpPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Vitals: Streak, Energy, Hunter Rank */}
            <div className="grid grid-cols-3 gap-2.5 mt-4">
              <div className="bg-[#170f03] border border-[#ffbe3b]/30 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center space-x-1 text-[#ff9900] text-xs font-mono">
                  <Flame size={14} />
                  <span>STREAK</span>
                </div>
                <div className="font-cyber text-lg font-bold text-white mt-0.5">{streak} <span className="text-xs font-sans text-amber-400/70">Days</span></div>
              </div>

              <div className="bg-[#170f03] border border-[#ffbe3b]/30 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center space-x-1 text-[#ffd700] text-xs font-mono">
                  <Zap size={14} />
                  <span>ENERGY</span>
                </div>
                <div className="font-cyber text-lg font-bold text-white mt-0.5">{energy}%</div>
              </div>

              <div className="bg-[#170f03] border border-[#ffbe3b]/30 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center space-x-1 text-amber-300 text-xs font-mono">
                  <Trophy size={14} />
                  <span>GUILD RANK</span>
                </div>
                <div className="font-cyber text-lg font-bold text-[#ffd700] mt-0.5">S-Rank #1</div>
              </div>
            </div>
          </div>

          {/* Right: Floating Solo Leveling System Silhouette Window */}
          <div className="relative flex flex-col items-center justify-center w-44 h-48 bg-gradient-to-b from-[#1c1305] to-[#0a0702] border-2 border-[#ffbe3b] rounded-2xl shadow-neon-gold p-3 shrink-0 system-window">
            <div className="text-center">
              <div className="text-5xl filter drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] animate-pulse">
                👑
              </div>
              <div className="mt-2 text-center">
                <div className="text-[11px] font-cyber font-bold text-[#ffd700] tracking-wider uppercase">
                  SHADOW MONARCH
                </div>
                <div className="text-[9px] font-mono text-amber-300/80">
                  SYSTEM CONNECTED
                </div>
              </div>
            </div>

            {/* Test Alert Wireframe Trigger with Solo Leveling Tone */}
            <button
              onClick={triggerWireframeNotification}
              className="mt-3 px-3 py-1 bg-[#2b1d06] hover:bg-[#ffbe3b]/30 border border-[#ffbe3b] rounded text-[10px] font-mono text-[#ffd700] tracking-wider flex items-center space-x-1 transition-all shadow-[0_0_8px_rgba(255,190,59,0.3)]"
            >
              <AlertTriangle size={12} className="text-[#ffd700]" />
              <span>TEST NOTIFICATION</span>
            </button>
          </div>
        </div>
      </div>

      {/* Solo Leveling System Quest Alert Banner (Matching the floating windows in photo!) */}
      <div className="bg-[#140e04] border border-[#ffbe3b]/50 rounded-xl p-4 flex items-start space-x-3 shadow-[0_0_20px_rgba(255,190,59,0.15)] system-window">
        <button 
          onClick={() => sound.playSoloLevelingMessageTone()}
          title="Click to play Solo Leveling System chime"
          className="p-2.5 bg-[#2e1e07] border border-[#ffd700] rounded-lg text-[#ffd700] shrink-0 mt-0.5 hover:bg-[#ffbe3b]/30 transition-all cursor-pointer"
        >
          <Music size={20} className="animate-pulse" />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-cyber text-xs font-bold text-[#ffd700] uppercase tracking-wider flex items-center space-x-1.5">
              <span>[ SYSTEM MESSAGE: DAILY QUEST AVAILABLE ]</span>
            </span>
            <span className="text-[10px] font-mono text-amber-400/80 uppercase">CLICK TONE 🔔</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1 leading-relaxed font-sans">
            "Player {profile.name}, the System has prepared your physical trial. Complete your daily gait and strength quota to unlock the next Dimensional Gate."
          </p>
        </div>
      </div>

      {/* Today's Priority Daily Quest Card */}
      {activeMission && (
        <div className="bg-[#0f0a03] border-2 border-[#ffbe3b] rounded-xl p-5 shadow-neon-gold system-window">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-mono bg-[#281a05] border border-[#ffd700] rounded text-[#ffd700] uppercase tracking-wider font-bold">
                [ DAILY QUEST: GETTING STRONGER ]
              </span>
              <span className="text-xs font-mono text-amber-400">{activeMission.difficulty}</span>
            </div>
            <span className="text-xs font-mono text-amber-300/80">{activeMission.category}</span>
          </div>

          <h3 className="font-cyber text-lg font-bold text-white gold-glow-text">{activeMission.title}</h3>
          <p className="text-xs text-amber-100/80 mt-1 mb-4">{activeMission.description}</p>

          <div className="flex items-center justify-between bg-[#191104] p-3 rounded-lg border border-[#ffbe3b]/30 mb-4">
            <div>
              <span className="text-xs font-mono text-amber-400/70 block uppercase">REQUIRED QUOTA</span>
              <span className="font-cyber text-base font-bold text-[#ffd700]">
                {activeMission.current} / {activeMission.target} {activeMission.unit}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-amber-400/70 block uppercase">SYSTEM REWARDS</span>
              <span className="font-cyber text-xs text-[#39ff14] font-bold block">
                +{activeMission.xpReward} XP • +{activeMission.coinReward} Coins
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('play')}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#e69500] to-[#ffd700] hover:from-[#ffd700] hover:to-[#ffea75] text-black font-cyber font-black tracking-widest text-xs uppercase rounded-lg shadow-neon-gold transition-all flex items-center justify-center space-x-2"
            >
              <Play size={14} className="fill-black" />
              <span>ENGAGE QUESTS</span>
            </button>
            <button
              onClick={() => completeMission(activeMission.id)}
              className="py-2.5 px-4 bg-[#1f2e0a] hover:bg-[#2e450f] text-[#39ff14] border border-[#39ff14]/60 font-cyber font-bold tracking-wider text-xs uppercase rounded-lg transition-all flex items-center space-x-1"
            >
              <CheckCircle2 size={14} />
              <span>CLAIM</span>
            </button>
          </div>
        </div>
      )}

      {/* Real-World Activity Input Engine ("Real Life -> Game -> Growth") */}
      <div className="bg-[#0f0a03] border border-[#ffbe3b]/40 rounded-xl p-5 system-window">
        <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="text-[#ffd700]" size={18} />
            <h3 className="font-cyber text-sm font-bold text-white uppercase tracking-wider">
              REAL WORLD ACTIVITY INPUT ENGINE
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#ffd700] uppercase">
            PHYSICAL ENERGY → HUNTER XP
          </span>
        </div>

        {logSuccessMessage && (
          <div className="mb-4 p-2.5 rounded bg-[#1f1604] border border-[#ffd700] text-[#ffd700] font-mono text-xs flex items-center space-x-2 animate-pulse shadow-[0_0_10px_rgba(255,190,59,0.3)]">
            <CheckCircle2 size={16} />
            <span>{logSuccessMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Steps Telemetry */}
          <div className="bg-[#191104] p-3.5 rounded-lg border border-[#ffbe3b]/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-amber-200 flex items-center space-x-1.5">
                <Footprints size={14} className="text-[#ffd700]" />
                <span>Walking / Gait Telemetry</span>
              </span>
              <span className="text-[11px] font-mono text-[#ffd700]">+{Math.round(simSteps * 0.05)} XP</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="100"
                min="100"
                value={simSteps}
                onChange={(e) => setSimSteps(e.target.value)}
                className="w-full bg-[#080501] border border-[#ffbe3b]/50 rounded px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-[#ffd700]"
              />
              <button
                onClick={handleSimulateSteps}
                className="px-4 py-1.5 bg-[#ffd700] hover:bg-[#ffea75] text-black font-cyber font-bold text-xs uppercase rounded whitespace-nowrap shadow-neon-gold"
              >
                SYNC GAIT
              </button>
            </div>
          </div>

          {/* Workout Minutes */}
          <div className="bg-[#191104] p-3.5 rounded-lg border border-[#ffbe3b]/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-amber-200 flex items-center space-x-1.5">
                <Dumbbell size={14} className="text-[#f59e0b]" />
                <span>Physical Workout Time</span>
              </span>
              <span className="text-[11px] font-mono text-[#f59e0b]">+{Math.round(simWorkout * 12)} XP</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="5"
                min="5"
                value={simWorkout}
                onChange={(e) => setSimWorkout(e.target.value)}
                className="w-full bg-[#080501] border border-[#ffbe3b]/50 rounded px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-[#ffd700]"
              />
              <button
                onClick={handleSimulateWorkout}
                className="px-4 py-1.5 bg-[#f59e0b] hover:bg-[#fbbf24] text-black font-cyber font-bold text-xs uppercase rounded whitespace-nowrap"
              >
                LOG TIME
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
