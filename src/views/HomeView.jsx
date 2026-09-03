import React, { useState } from 'react';
import { 
  Zap, Flame, Shield, Trophy, Activity, Footprints, 
  Dumbbell, Sparkles, AlertCircle, ArrowUpRight, CheckCircle2, Play
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

  const [simSteps, setSimSteps] = useState(500);
  const [simWorkout, setSimWorkout] = useState(15);
  const [logSuccessMessage, setLogSuccessMessage] = useState('');

  // Primary today's mission
  const activeMission = missions.find(m => !m.completed) || missions[0];

  const xpPercent = Math.min(100, Math.round((xp / currentThreshold) * 100));

  const handleSimulateSteps = () => {
    sound.playClick();
    logActivity('steps', Number(simSteps));
    setLogSuccessMessage(`Logged ${simSteps} steps! Real Life → Game XP generated.`);
    setTimeout(() => setLogSuccessMessage(''), 3000);
  };

  const handleSimulateWorkout = () => {
    sound.playClick();
    logActivity('workout', Number(simWorkout));
    setLogSuccessMessage(`Logged ${simWorkout} min workout! Strength & FitCoins earned.`);
    setTimeout(() => setLogSuccessMessage(''), 3000);
  };

  const triggerWireframeNotification = () => {
    sound.playNotification();
    setLevelUpMessage("Your next level awaits. Are you ready to prove yourself?");
    setShowLevelUpAlert(true);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* 1. Hero Hologram Status Card */}
      <div className="relative bg-[#0c1328]/85 border border-cyan-500/40 rounded-2xl p-5 md:p-6 shadow-neon-cyan overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Player ID & Level */}
          <div className="flex-1 w-full text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-1">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest px-2 py-0.5 bg-cyan-950/60 border border-cyan-500/30 rounded">
                OPERATIVE STATUS: ACTIVE
              </span>
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                ● ONLINE
              </span>
            </div>

            <h2 className="font-cyber text-2xl md:text-3xl font-black text-white uppercase tracking-wide">
              {profile.name}
            </h2>
            <p className="font-mono text-xs text-slate-400 tracking-wider">
              {profile.department} Guild • {profile.goal}
            </p>

            {/* Level & XP Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-cyan-300 font-bold">LEVEL {level} — FITNESS EXPLORER</span>
                <span className="text-slate-300">{xp} / {currentThreshold} XP ({xpPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full border border-cyan-500/40 overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 rounded-full transition-all duration-500 shadow-[0_0_10px_#00f0ff]"
                  style={{ width: `${xpPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Vital Stats Row */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-[#121b36] border border-slate-800 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center space-x-1 text-orange-400 text-xs font-mono">
                  <Flame size={14} />
                  <span>STREAK</span>
                </div>
                <div className="font-cyber text-lg font-bold text-white mt-0.5">{streak} <span className="text-xs font-sans text-slate-400">Days</span></div>
              </div>

              <div className="bg-[#121b36] border border-slate-800 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center space-x-1 text-cyan-400 text-xs font-mono">
                  <Zap size={14} />
                  <span>ENERGY</span>
                </div>
                <div className="font-cyber text-lg font-bold text-white mt-0.5">{energy}%</div>
              </div>

              <div className="bg-[#121b36] border border-slate-800 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center space-x-1 text-amber-400 text-xs font-mono">
                  <Trophy size={14} />
                  <span>CAMPUS</span>
                </div>
                <div className="font-cyber text-lg font-bold text-amber-300 mt-0.5">#1 Rank</div>
              </div>
            </div>
          </div>

          {/* Right: 2050 Cyber Hologram Avatar Display */}
          <div className="relative flex flex-col items-center justify-center w-40 h-44 bg-gradient-to-b from-cyan-950/40 to-slate-950/80 border border-cyan-400/40 rounded-2xl shadow-neon-cyan p-2">
            {/* Spinning Holographic Ring */}
            <div className="absolute inset-2 border border-cyan-500/20 rounded-xl pointer-events-none animate-pulse"></div>

            {/* Avatar Holographic Representation */}
            <div className="relative text-center">
              <div className="text-4xl filter drop-shadow-[0_0_12px_rgba(0,240,255,0.8)] animate-bounce">
                🧑‍🚀
              </div>
              <div className="mt-2 text-center">
                <div className="text-[11px] font-cyber font-bold text-cyan-300 tracking-wider">
                  TITAN WEAVE
                </div>
                <div className="text-[9px] font-mono text-fuchsia-400">
                  AR V4 EQUIPPED
                </div>
              </div>
            </div>

            {/* Trigger Notification Wireframe Box */}
            <button
              onClick={triggerWireframeNotification}
              className="mt-3 px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 rounded text-[10px] font-mono text-cyan-300 tracking-wider flex items-center space-x-1 transition-all"
            >
              <AlertCircle size={12} />
              <span>TEST ALERT</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. AI Game Master Daily Broadcast Transmission */}
      <div className="bg-[#0e162d] border border-pink-500/30 rounded-xl p-4 flex items-start space-x-3 shadow-[0_0_15px_rgba(255,0,127,0.15)]">
        <div className="p-2 bg-pink-500/10 border border-pink-400/40 rounded-lg text-pink-400 shrink-0 mt-0.5">
          <Sparkles size={20} className="animate-spin" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-cyber text-xs font-bold text-pink-400 uppercase tracking-wider">
              AI GAME MASTER TRANSMISSION
            </span>
            <span className="text-[9px] font-mono text-slate-500">2050.09.03</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
            "Operative {profile.name}, your biometric matrix is prime. Environmental sensors in Neo-Arcadia report 24°C ideal conditions. Convert your real-world motion into kinetic XP to upgrade your <strong className="text-cyan-400">Cyber Outpost</strong>!"
          </p>
        </div>
      </div>

      {/* 3. Today's Primary Mission */}
      {activeMission && (
        <div className="bg-[#0b1226] border-2 border-cyan-400/50 rounded-xl p-5 shadow-neon-cyan">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 border border-cyan-400 rounded text-cyan-300 uppercase tracking-wider">
                TODAY'S PRIORITY MISSION
              </span>
              <span className="text-xs font-mono text-amber-400">{activeMission.difficulty}</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{activeMission.category}</span>
          </div>

          <h3 className="font-cyber text-lg font-bold text-white">{activeMission.title}</h3>
          <p className="text-xs text-slate-300 mt-1 mb-4">{activeMission.description}</p>

          <div className="flex items-center justify-between bg-[#121c3b] p-3 rounded-lg border border-slate-800 mb-4">
            <div>
              <span className="text-xs font-mono text-slate-400 block">GOAL TARGET</span>
              <span className="font-cyber text-base font-bold text-cyan-400">
                {activeMission.current} / {activeMission.target} {activeMission.unit}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 block">REWARDS</span>
              <span className="font-cyber text-xs text-emerald-400 font-bold block">
                +{activeMission.xpReward} XP • +{activeMission.coinReward} Coins
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('play')}
              className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-black tracking-widest text-xs uppercase rounded-lg shadow-neon-cyan transition-all flex items-center justify-center space-x-2"
            >
              <Play size={14} className="fill-black" />
              <span>ENGAGE QUESTS</span>
            </button>
            <button
              onClick={() => completeMission(activeMission.id)}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-cyber font-bold tracking-wider text-xs uppercase rounded-lg transition-all flex items-center space-x-1"
            >
              <CheckCircle2 size={14} />
              <span>CLAIM</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Real Life Activity Logger ("Real Life -> Game -> Growth") */}
      <div className="bg-[#0b1226] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="text-cyan-400" size={18} />
            <h3 className="font-cyber text-sm font-bold text-white uppercase tracking-wider">
              REAL WORLD ACTIVITY INPUT ENGINE
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400/80 uppercase">
            REAL ACTIVITY → XP & COINS
          </span>
        </div>

        {logSuccessMessage && (
          <div className="mb-4 p-2.5 rounded bg-emerald-950/60 border border-emerald-500 text-emerald-300 font-mono text-xs flex items-center space-x-2 animate-pulse">
            <CheckCircle2 size={16} />
            <span>{logSuccessMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Steps Logger */}
          <div className="bg-[#121c38] p-3.5 rounded-lg border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-300 flex items-center space-x-1.5">
                <Footprints size={14} className="text-cyan-400" />
                <span>Walk / Step Telemetry</span>
              </span>
              <span className="text-[11px] font-mono text-cyan-400">+{Math.round(simSteps * 0.05)} XP</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="100"
                min="100"
                value={simSteps}
                onChange={(e) => setSimSteps(e.target.value)}
                className="w-full bg-[#080d1a] border border-cyan-500/40 rounded px-3 py-1.5 text-white font-mono text-sm focus:outline-none"
              />
              <button
                onClick={handleSimulateSteps}
                className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs uppercase rounded whitespace-nowrap"
              >
                SYNC STEPS
              </button>
            </div>
          </div>

          {/* Workout Minutes Logger */}
          <div className="bg-[#121c38] p-3.5 rounded-lg border border-pink-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-300 flex items-center space-x-1.5">
                <Dumbbell size={14} className="text-pink-400" />
                <span>Workout / Training Time</span>
              </span>
              <span className="text-[11px] font-mono text-pink-400">+{Math.round(simWorkout * 12)} XP</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="5"
                min="5"
                value={simWorkout}
                onChange={(e) => setSimWorkout(e.target.value)}
                className="w-full bg-[#080d1a] border border-pink-500/40 rounded px-3 py-1.5 text-white font-mono text-sm focus:outline-none"
              />
              <button
                onClick={handleSimulateWorkout}
                className="px-4 py-1.5 bg-pink-500 hover:bg-pink-400 text-black font-cyber font-bold text-xs uppercase rounded whitespace-nowrap"
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
