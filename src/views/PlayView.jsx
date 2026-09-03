import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Sparkles, CheckCircle2, Play, Pause, RotateCcw, 
  Flame, Award, Heart, Compass, ShieldAlert, Zap, Clock, Music
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
    <div className="space-y-6 pb-20 animate-fade-in relative z-10">
      {/* Top Banner with Solo Leveling Quest Generator */}
      <div className="bg-[#0e0903] border border-[#ffbe3b]/50 rounded-2xl p-5 shadow-neon-gold flex flex-col md:flex-row items-center justify-between gap-4 system-window">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-[#2a1b05] border border-[#ffd700] text-[10px] font-mono text-[#ffd700] rounded uppercase tracking-wider font-bold">
              [ SYSTEM: DAILY QUEST LOG ]
            </span>
            <span className="text-xs font-mono text-amber-300">HEALTH ADAPTIVE PROTOCOL</span>
          </div>
          <h2 className="font-cyber text-2xl font-black text-white uppercase mt-1 gold-glow-text">
            QUEST DIRECTORY
          </h2>
          <p className="text-xs text-amber-100/80 mt-1 max-w-xl">
            "Your body is the vessel of the Monarch." Complete the System's daily training quotas to accumulate XP, unlock dimensional facilities, and ascend your player rank.
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
                <span className="text-[#39ff14] font-bold">+{m.xpReward} XP • +{m.coinReward} Coins</span>
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
