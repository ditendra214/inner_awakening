import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Sparkles, CheckCircle2, Play, Pause, RotateCcw, 
  Flame, Award, Heart, Compass, ShieldAlert, Zap, Clock
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
    addFitCoins 
  } = useGame();

  const [activeTimerQuest, setActiveTimerQuest] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [filter, setFilter] = useState('all');

  // Live workout timer loop
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
    sound.playClick();
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
    sound.playQuestComplete();
    completeMission(activeTimerQuest.id);
    setTimerRunning(false);
    setActiveTimerQuest(null);
    setTimerSeconds(0);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredMissions = missions.filter(m => {
    if (filter === 'all') return true;
    if (filter === 'completed') return m.completed;
    if (filter === 'active') return !m.completed;
    return m.type === filter;
  });

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Top Banner with AI Quest Generator */}
      <div className="bg-[#0c142b] border border-cyan-500/40 rounded-2xl p-5 shadow-neon-cyan flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-pink-950/70 border border-pink-500 text-[10px] font-mono text-pink-300 rounded uppercase tracking-wider">
              GAME ENGINE: MISSIONS
            </span>
            <span className="text-xs font-mono text-cyan-400">HEALTH ADAPTIVE</span>
          </div>
          <h2 className="font-cyber text-2xl font-black text-white uppercase mt-1">
            MISSION DIRECTORY
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Turn real-world exertion into game progress. Complete missions to harvest XP, unlock cyber buildings, and level up your character.
          </p>
        </div>

        <button
          onClick={generateAIMission}
          className="w-full md:w-auto px-5 py-3 bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-black font-cyber font-black text-xs uppercase tracking-widest rounded-xl shadow-neon-pink flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
        >
          <Sparkles size={16} className="fill-black" />
          <span>GENERATE AI QUEST</span>
        </button>
      </div>

      {/* Live Active Mission HUD (if one is engaged) */}
      {activeTimerQuest && (
        <div className="bg-[#091124] border-2 border-pink-500 rounded-xl p-5 shadow-neon-pink animate-pulse-slow">
          <div className="flex items-center justify-between border-b border-pink-500/30 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="text-pink-400 animate-spin" size={18} />
              <span className="font-cyber text-sm font-bold text-pink-300 uppercase tracking-wider">
                LIVE MISSION HUD: {activeTimerQuest.title}
              </span>
            </div>
            <span className="font-mono text-xs text-slate-400">
              Target: {activeTimerQuest.target} {activeTimerQuest.unit}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="font-mono text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 tracking-wider">
                {formatTime(timerSeconds)}
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1 block">
                ACTIVE BIO-METRIC RUNTIME
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePauseTimer}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs uppercase rounded border border-slate-600 flex items-center space-x-1"
              >
                {timerRunning ? <Pause size={14} /> : <Play size={14} />}
                <span>{timerRunning ? 'PAUSE' : 'RESUME'}</span>
              </button>

              <button
                onClick={handleCompleteActiveTimer}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-cyber font-black text-xs uppercase rounded shadow-[0_0_10px_#39ff14] flex items-center space-x-1"
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
            className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap ${
              filter === f
                ? 'bg-cyan-500 text-black font-bold shadow-neon-cyan'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
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
            className={`relative rounded-xl p-5 border transition-all ${
              m.completed
                ? 'bg-[#080d1a]/60 border-emerald-500/30 opacity-75'
                : 'bg-[#0c1429] border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.08)]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                  m.type === 'easy' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40' :
                  m.type === 'medium' ? 'bg-blue-950 text-blue-400 border border-blue-500/40' :
                  m.type === 'hard' ? 'bg-rose-950 text-rose-400 border border-rose-500/40' :
                  'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {m.type}
                </span>
                <span className="text-xs font-mono text-amber-400">{m.difficulty}</span>
              </div>
              <span className="text-xs font-mono text-slate-400">{m.category}</span>
            </div>

            <h3 className="font-cyber text-base font-bold text-white mb-1">
              {m.title}
            </h3>
            <p className="text-xs text-slate-300 mb-4 min-h-[36px]">
              {m.description}
            </p>

            {/* Target & Rewards Strip */}
            <div className="flex items-center justify-between bg-[#121c38] p-2.5 rounded-lg border border-slate-800/80 mb-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Target Exertion</span>
                <span className="text-cyan-300 font-bold">{m.target} {m.unit}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] block uppercase">Bounty</span>
                <span className="text-amber-400 font-bold">+{m.xpReward} XP • +{m.coinReward} Coins</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {m.completed ? (
                <div className="w-full py-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-xs uppercase rounded text-center flex items-center justify-center space-x-1.5">
                  <CheckCircle2 size={14} />
                  <span>MISSION COMPLETED</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleStartTimer(m)}
                    className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-black text-xs uppercase tracking-wider rounded transition-all shadow-neon-cyan flex items-center justify-center space-x-1.5"
                  >
                    <Play size={12} className="fill-black" />
                    <span>START RUNTIME</span>
                  </button>

                  <button
                    onClick={() => completeMission(m.id)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs uppercase rounded border border-slate-700"
                    title="Quick complete for real activity"
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
