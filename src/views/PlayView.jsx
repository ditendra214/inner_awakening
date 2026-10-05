import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Sparkles, CheckCircle2, Play, Pause, RotateCcw, 
  Flame, Award, Heart, Compass, ShieldAlert, Zap, Clock, Music,
  Activity, Footprints, Dumbbell
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const PlayView = () => {
  const { 
    missions, 
    completeMission, 
    generateAIMission, 
    profile, 
    addXP, 
    addFitCoins,
    addBlueCrystals,
    logActivity 
  } = useGame();

  const [activeTimerQuest, setActiveTimerQuest] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [filter, setFilter] = useState('all');

  // Real-world activity simulator states
  const [simSteps, setSimSteps] = useState(1000);
  const [simWorkout, setSimWorkout] = useState(20);
  const [logSuccessMessage, setLogSuccessMessage] = useState('');

  // Live quest workout timer
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleStartTimer = (quest) => {
    sound.playSoloLevelingMessageTone();
    setActiveTimerQuest(quest);
    setTimerSeconds(0);
    setTimerRunning(true);
  };

  const handlePauseTimer = () => {
    sound.playClick();
    setTimerRunning(!timerRunning);
  };

  const handleCompleteActiveTimer = () => {
    if (!activeTimerQuest) return;
    sound.playSoloLevelingMessageTone();
    completeMission(activeTimerQuest.id);
    setTimerRunning(false);
    setActiveTimerQuest(null);
    setTimerSeconds(0);
  };

  const handleGenerateAIQuest = () => {
    sound.playSoloLevelingMessageTone();
    generateAIMission();
  };

  const handleSimulateSteps = () => {
    sound.playSoloLevelingMessageTone();
    logActivity('steps', Number(simSteps));
    setLogSuccessMessage(`[SYSTEM LOG]: ${simSteps} steps recorded. Player XP and Golden Mana harvested!`);
    setTimeout(() => setLogSuccessMessage(''), 3500);
  };

  const handleSimulateWorkout = () => {
    sound.playSoloLevelingMessageTone();
    logActivity('workout', Number(simWorkout));
    setLogSuccessMessage(`[SYSTEM LOG]: ${simWorkout} min workout complete. Strength attribute & Blue Crystal resonance reinforced!`);
    setTimeout(() => setLogSuccessMessage(''), 3500);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Locate the Kinetic Core Burst quest specifically
  const kineticQuest = missions.find(m => m.id === 'm2' || m.title.toLowerCase().includes('kinetic core'));

  const filteredMissions = missions.filter(m => {
    if (filter === 'all') return true;
    if (filter === 'completed') return m.completed;
    if (filter === 'active') return !m.completed;
    return m.type === filter;
  });

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative z-10">
      {/* Top Banner with Solo Leveling Quest Generator */}
      <div className="bg-[#0e0903] border border-[#ffbe3b]/50 rounded-2xl p-5 shadow-neon-gold flex flex-col md:flex-row items-center justify-between gap-4 system-window">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-[#2a1b05] border border-[#ffd700] text-[10px] font-mono text-[#ffd700] rounded uppercase tracking-wider font-bold">
              [ SYSTEM: DAILY QUEST & TRAINING FACILITY ]
            </span>
            <span className="text-xs font-mono text-amber-300">HEALTH ADAPTIVE PROTOCOL</span>
          </div>
          <h2 className="font-cyber text-2xl font-black text-white uppercase mt-1 gold-glow-text">
            QUEST DIRECTORY & ACTIVITY ENGINE
          </h2>
          <p className="text-xs text-amber-100/80 mt-1 max-w-xl">
            "Your body is the vessel of the Monarch." Complete the System's physical training quotas and kinetic overdrive exercises to harvest XP, Gold, and <strong>Blue Crystals</strong>.
          </p>
        </div>

        <button
          onClick={handleGenerateAIQuest}
          className="w-full md:w-auto px-5 py-3 bg-gradient-to-r from-[#e69500] to-[#ffd700] hover:from-[#ffd700] hover:to-[#ffea75] text-black font-cyber font-black text-xs uppercase tracking-widest rounded-xl shadow-neon-gold flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
        >
          <Sparkles size={16} className="fill-black" />
          <span>GENERATE SYSTEM QUEST</span>
        </button>
      </div>

      {/* FEATURED: KINETIC CORE BURST OVERDRIVE PROTOCOL */}
      {kineticQuest && (
        <div className="relative bg-gradient-to-r from-[#170902] via-[#0d0702] to-[#1a0f02] border-2 border-[#ff9900] rounded-2xl p-5 shadow-[0_0_25px_rgba(255,153,0,0.25)] system-window overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-l from-[#ff9900] to-transparent text-black text-[10px] font-cyber font-black tracking-widest uppercase">
            PRIORITY WORKOUT PROTOCOL
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="px-2 py-0.5 bg-[#381602] border border-[#ff9900] text-[#ff9900] font-mono text-[10px] font-bold rounded uppercase">
                  ⚡ KINETIC OVERDRIVE
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">{kineticQuest.difficulty}</span>
                <span className="text-xs font-mono text-cyan-400 flex items-center space-x-1">
                  <span>💎</span>
                  <span>+{kineticQuest.crystalReward || 15} BLUE CRYSTALS</span>
                </span>
              </div>

              <h3 className="font-cyber text-xl font-black text-white gold-glow-text">
                {kineticQuest.title}
              </h3>
              <p className="text-xs text-amber-100/90 mt-1 max-w-xl">
                {kineticQuest.description} Intense bio-mechanic exertion stimulates cellular mana generation, granting high amounts of Blue Crystals used in the Forge.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-mono">
                <div className="bg-[#120802] px-3 py-1 rounded border border-[#ff9900]/40">
                  <span className="text-amber-400/70 text-[10px] uppercase block">Quota</span>
                  <span className="font-bold text-white">{kineticQuest.target} {kineticQuest.unit}</span>
                </div>
                <div className="bg-[#120802] px-3 py-1 rounded border border-[#ff9900]/40">
                  <span className="text-amber-400/70 text-[10px] uppercase block">Rewards</span>
                  <span className="font-bold text-[#39ff14]">+{kineticQuest.xpReward} XP • +{kineticQuest.coinReward} Gold</span>
                </div>
                <div className="bg-[#051824] px-3 py-1 rounded border border-cyan-500/50">
                  <span className="text-cyan-400/80 text-[10px] uppercase block">Artifact Catalyst</span>
                  <span className="font-bold text-cyan-300">💎 +{kineticQuest.crystalReward || 15} Blue Crystals</span>
                </div>
              </div>
            </div>

            {/* Action buttons for Kinetic Core Burst */}
            <div className="flex sm:flex-col items-center gap-2 w-full md:w-auto">
              {kineticQuest.completed ? (
                <div className="w-full py-2.5 px-5 bg-[#122207] border border-[#39ff14]/60 text-[#39ff14] font-cyber text-xs uppercase rounded-lg text-center flex items-center justify-center space-x-2">
                  <CheckCircle2 size={16} />
                  <span>[ KINETIC PROTOCOL CLEARED ]</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleStartTimer(kineticQuest)}
                    className="flex-1 sm:w-48 py-3 bg-gradient-to-r from-[#ff9900] to-[#ffd700] hover:from-[#ffd700] hover:to-[#ffea75] text-black font-cyber font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-gold flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
                  >
                    <Play size={14} className="fill-black" />
                    <span>ENGAGE KINETIC BURST</span>
                  </button>
                  <button
                    onClick={() => { sound.playSoloLevelingMessageTone(); completeMission(kineticQuest.id); }}
                    className="px-4 py-2 bg-[#221203] hover:bg-[#381c05] text-amber-200 border border-[#ff9900]/50 font-mono text-xs uppercase rounded-lg transition-colors"
                  >
                    CLAIM REWARDS
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REAL WORLD ACTIVITY INPUT ENGINE ("Real Life -> Game -> Growth") */}
      <div className="bg-[#0f0a03] border border-[#ffbe3b]/40 rounded-xl p-5 system-window">
        <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="text-[#ffd700]" size={18} />
            <h3 className="font-cyber text-sm font-bold text-white uppercase tracking-wider">
              REAL WORLD ACTIVITY INPUT ENGINE
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#ffd700] uppercase">
            PHYSICAL ENERGY → PLAYER XP & GOLD
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
              <span className="text-[11px] font-mono text-[#ffd700]">+{Math.round(simSteps * 0.05)} XP • +{Math.round(simSteps * 0.015)} Gold</span>
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
              <span className="text-[11px] font-mono text-[#f59e0b]">+{Math.round(simWorkout * 12)} XP • +{Math.round(simWorkout * 4)} Gold</span>
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

      {/* Live Active Mission HUD */}
      {activeTimerQuest && (
        <div className="bg-[#120c04] border-2 border-[#ffd700] rounded-xl p-5 shadow-neon-gold animate-pulse-slow system-window">
          <div className="flex items-center justify-between border-b border-[#ffbe3b]/40 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="text-[#ffd700] animate-spin" size={18} />
              <span className="font-cyber text-sm font-bold text-[#ffd700] uppercase tracking-wider">
                [ ENGAGED QUEST: {activeTimerQuest.title} ]
              </span>
            </div>
            <span className="font-mono text-xs text-amber-300/80">
              Quota: {activeTimerQuest.target} {activeTimerQuest.unit}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="font-mono text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-white to-[#ffbe3b] tracking-wider gold-glow-text">
                {formatTime(timerSeconds)}
              </div>
              <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-widest mt-1 block">
                ACTIVE BIO-METRIC TIME ELAPSED
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePauseTimer}
                className="px-4 py-2 bg-[#221603] hover:bg-[#332105] text-amber-200 font-mono text-xs uppercase rounded border border-[#ffbe3b]/50 flex items-center space-x-1"
              >
                {timerRunning ? <Pause size={14} /> : <Play size={14} />}
                <span>{timerRunning ? 'PAUSE' : 'RESUME'}</span>
              </button>

              <button
                onClick={handleCompleteActiveTimer}
                className="px-5 py-2 bg-[#ffd700] hover:bg-[#ffea75] text-black font-cyber font-black text-xs uppercase rounded shadow-neon-gold flex items-center space-x-1"
              >
                <CheckCircle2 size={16} />
                <span>COMPLETE & CLAIM</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {['all', 'easy', 'medium', 'hard', 'recovery', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => { sound.playClick(); setFilter(f); }}
            className={`px-3.5 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap ${
              filter === f
                ? 'bg-[#ffd700] text-black font-bold shadow-neon-gold'
                : 'bg-[#150e04] text-amber-400/70 hover:text-amber-100 border border-[#ffbe3b]/30'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map((m) => (
          <div
            key={m.id}
            className={`relative rounded-xl p-5 border transition-all system-window ${
              m.completed
                ? 'bg-[#0a0702]/70 border-[#39ff14]/40 opacity-80'
                : 'bg-[#0e0903] border-[#ffbe3b]/40 hover:border-[#ffd700] shadow-[0_0_15px_rgba(255,190,59,0.12)]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                  m.type === 'easy' ? 'bg-[#261a05] text-[#ffd700] border border-[#ffd700]/50' :
                  m.type === 'medium' ? 'bg-[#291703] text-[#f59e0b] border border-[#f59e0b]/50' :
                  m.type === 'hard' ? 'bg-[#2d0f04] text-[#ff6b4a] border border-[#ff6b4a]/50' :
                  'bg-[#0f2408] text-[#39ff14] border border-[#39ff14]/50'
                }`}>
                  {m.type}
                </span>
                <span className="text-xs font-mono text-amber-400">{m.difficulty}</span>
              </div>
              <span className="text-xs font-mono text-amber-300/80">{m.category}</span>
            </div>

            <h3 className="font-cyber text-base font-bold text-white mb-1">
              {m.title}
            </h3>
            <p className="text-xs text-amber-100/75 mb-4 min-h-[36px]">
              {m.description}
            </p>

            {/* Target & Rewards Strip */}
            <div className="flex items-center justify-between bg-[#191104] p-2.5 rounded-lg border border-[#ffbe3b]/30 mb-4 text-xs font-mono">
              <div>
                <span className="text-amber-400/70 text-[10px] block uppercase">Training Quota</span>
                <span className="text-[#ffd700] font-bold">{m.target} {m.unit}</span>
              </div>
              <div className="text-right">
                <span className="text-amber-400/70 text-[10px] block uppercase">System Bounty</span>
                <div className="flex flex-col items-end">
                  <span className="text-[#39ff14] font-bold">+{m.xpReward} XP • +{m.coinReward} Gold</span>
                  {m.crystalReward && (
                    <span className="text-cyan-400 font-bold flex items-center space-x-0.5 text-[11px]">
                      <span>💎</span>
                      <span>+{m.crystalReward} Crystals</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {m.completed ? (
                <div className="w-full py-2 bg-[#122207] border border-[#39ff14]/50 text-[#39ff14] font-mono text-xs uppercase rounded text-center flex items-center justify-center space-x-1.5">
                  <CheckCircle2 size={14} />
                  <span>[ QUEST CLEARED ]</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleStartTimer(m)}
                    className="flex-1 py-2 bg-gradient-to-r from-[#e69500] to-[#ffd700] hover:from-[#ffd700] hover:to-[#ffea75] text-black font-cyber font-black text-xs uppercase tracking-wider rounded transition-all shadow-neon-gold flex items-center justify-center space-x-1.5"
                  >
                    <Play size={12} className="fill-black" />
                    <span>START RUNTIME</span>
                  </button>

                  <button
                    onClick={() => { sound.playSoloLevelingMessageTone(); completeMission(m.id); }}
                    className="px-3 py-2 bg-[#221603] hover:bg-[#332105] text-amber-300 font-mono text-xs uppercase rounded border border-[#ffbe3b]/40"
                    title="Claim reward"
                  >
                    CLAIM
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
