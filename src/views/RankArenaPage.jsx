import React, { useState } from 'react';
import { 
  ArrowLeft, Crown, Flame, Dumbbell, Trophy, Swords, 
  Check, User, Zap, Shield, ChevronRight, Play, Award
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { navigationManager } from '../services/navigationManager';
import { sound } from '../services/soundEngine';
import confetti from 'canvas-confetti';

export const RankArenaPage = () => {
  const { sound, profile, rankScore, setRankScore } = useGame();
  
  const [matchState, setMatchState] = useState('lobby'); // 'lobby' | 'matching' | 'in_progress' | 'victory'
  const [matchProgress, setMatchProgress] = useState(0);
  const [playerReps, setPlayerReps] = useState(0);
  const [opponentReps, setOpponentReps] = useState(0);

  // Selected Opponent
  const activeOpponent = {
    name: 'Vanguard_Jin',
    rank: 'MONARCH',
    level: 42,
    position: '#28',
    winRate: '84%',
    streak: 8,
    avatar: '⚔️'
  };

  const challengeDetails = {
    title: 'Kinetic Squat Burst Showdown',
    targetReps: 50,
    timeLimit: '2:00',
    rewardRp: 250,
    rewardCoins: 800,
    exercise: 'Full Depth Squats'
  };

  const handleStartMatch = () => {
    sound.playClick();
    setMatchState('matching');
    setMatchProgress(0);
    setPlayerReps(0);
    setOpponentReps(0);

    setTimeout(() => {
      sound.playLevelUp();
      setMatchState('in_progress');
      
      // Simulate real-time competition progression
      let currentP = 0;
      let currentO = 0;
      const interval = setInterval(() => {
        currentP += Math.floor(Math.random() * 4) + 2;
        currentO += Math.floor(Math.random() * 3) + 2;
        setPlayerReps(Math.min(50, currentP));
        setOpponentReps(Math.min(50, currentO));

        if (currentP >= 50) {
          clearInterval(interval);
          setMatchState('victory');
          sound.playLevelUp();
          if (setRankScore) setRankScore(prev => prev + challengeDetails.rewardRp);
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 }
          });
        }
      }, 350);
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050812] text-slate-100 select-none overflow-hidden animate-fade-in relative">
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white font-black text-sm shadow-[0_0_12px_rgba(239,68,68,0.5)]">
              ⚔️
            </div>
            <div>
              <h1 className="font-cyber font-black text-sm md:text-base tracking-wider text-white uppercase gold-glow-text">
                RANK ARENA
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">
                Competitive Real-Time Asynchronous Fitness Duel Arena
              </p>
            </div>
          </div>
        </div>

        {/* Season & Rank Badge */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/80 text-amber-300 font-cyber text-xs font-bold">
            <Crown className="w-3.5 h-3.5" />
            <span>SEASON 1 • GLOBAL #{27}</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT BODY */}
      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        
        {/* LEFT COLUMN: MATCHMAKING STAGE (YOU VS OPPONENT) */}
        <div className="col-span-12 lg:col-span-8 p-6 flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-[#090e1f]/60 to-[#04060d]/80">
          
          {/* ARENA HEADLINE BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-black border border-red-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Swords className="w-6 h-6 text-red-400" />
              <div>
                <div className="text-xs font-cyber font-black text-white uppercase">
                  ACTIVE CHALLENGE: {challengeDetails.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  First athlete to hit {challengeDetails.targetReps} reps with verified form claims the bounty.
                </div>
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-amber-400 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
              +{challengeDetails.rewardRp} RP
            </div>
          </div>

          {/* DUEL VERSUS CARD */}
          <div className="my-6 grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* PLAYER (YOU) */}
            <div className="md:col-span-5 p-6 rounded-3xl bg-[#0e162c]/90 border-2 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.25)] flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-3xl font-black shadow-lg mb-3">
                👑
              </div>
              <div className="text-[10px] font-cyber text-amber-400 font-bold uppercase tracking-wider">
                CHALLENGER (YOU)
              </div>
              <h3 className="font-cyber font-black text-lg text-white mt-1">
                {profile?.name || 'MONARCH_WARRIOR'}
              </h3>
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 mt-1">
                <span>Rank: MONARCH</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">Pos: #27</span>
              </div>
              
              {/* Reps Meter during match */}
              {matchState === 'in_progress' && (
                <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/80 border border-amber-500/40">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-amber-400 font-bold">YOUR REPS:</span>
                    <span className="text-white font-black">{playerReps} / 50</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${(playerReps / 50) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* VS EMBLEM */}
            <div className="md:col-span-1 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 font-cyber font-black text-sm shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                VS
              </div>
            </div>

            {/* OPPONENT */}
            <div className="md:col-span-5 p-6 rounded-3xl bg-[#121625]/80 border border-slate-700 shadow-lg flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-3xl font-black shadow-lg mb-3">
                {activeOpponent.avatar}
              </div>
              <div className="text-[10px] font-cyber text-slate-400 font-bold uppercase tracking-wider">
                DEFENDING OPPONENT
              </div>
              <h3 className="font-cyber font-black text-lg text-white mt-1">
                {activeOpponent.name}
              </h3>
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 mt-1">
                <span>Rank: {activeOpponent.rank}</span>
                <span>•</span>
                <span className="text-slate-400 font-bold">Pos: {activeOpponent.position}</span>
              </div>

              {/* Opponent Reps Meter during match */}
              {matchState === 'in_progress' && (
                <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-700">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400 font-bold">OPPONENT REPS:</span>
                    <span className="text-slate-200 font-black">{opponentReps} / 50</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full transition-all duration-300"
                      style={{ width: `${(opponentReps / 50) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTON / VICTORY BANNER */}
          {matchState === 'lobby' && (
            <button
              onClick={handleStartMatch}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:from-red-500 hover:to-amber-400 text-white font-cyber text-sm font-black uppercase tracking-widest shadow-[0_0_30px_rgba(239,68,68,0.5)] border border-yellow-300/60 transition-all flex items-center justify-center space-x-2"
            >
              <Swords className="w-5 h-5" />
              <span>ENTER COMPETITION DUEL</span>
            </button>
          )}

          {matchState === 'matching' && (
            <div className="w-full py-4 rounded-2xl bg-slate-900 border border-slate-700 text-center font-cyber text-xs text-amber-400 animate-pulse tracking-widest uppercase">
              CALIBRATING KINETIC STROBOSCOPE & SYNCHRONIZING ARENA...
            </div>
          )}

          {matchState === 'in_progress' && (
            <div className="w-full py-3.5 rounded-2xl bg-amber-950/40 border border-amber-400/60 text-center font-cyber text-xs text-amber-300 tracking-wider flex items-center justify-center space-x-2">
              <Dumbbell className="w-4 h-4 animate-bounce" />
              <span>MATCH IN PROGRESS — PERFORM 50 REP SQUATS AT FULL DEPTH!</span>
            </div>
          )}

          {matchState === 'victory' && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-black border-2 border-emerald-400 text-center space-y-2 animate-scale-up">
              <div className="text-emerald-400 font-cyber font-black text-lg uppercase tracking-wider flex items-center justify-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>VICTORY ATTAINED! ARENA BOUNTY CLAIMED</span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                You outpaced {activeOpponent.name}. Earned <strong className="text-amber-400">+{challengeDetails.rewardRp} Rank Points</strong> & <strong className="text-amber-300">+{challengeDetails.rewardCoins} FitCoins</strong>.
              </p>
              <button
                onClick={() => setMatchState('lobby')}
                className="mt-2 px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-cyber text-xs font-black uppercase tracking-wider"
              >
                RETURN TO ARENA LOBBY
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SEASON LEADERBOARD & RECENT MATCHES */}
        <div className="col-span-12 lg:col-span-4 border-l border-slate-800/80 bg-[#060914] p-5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="text-xs font-cyber font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>SEASON 1 LADDER</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">TOP GLADIATORS</span>
            </div>

            {/* Mini Leaderboard List */}
            <div className="space-y-2">
              {[
                { pos: 1, name: 'Sovereign_Shadow', rp: 5240, rank: 'MONARCH' },
                { pos: 2, name: 'Iron_Titan', rp: 4890, rank: 'NATIONAL' },
                { pos: 3, name: 'Hyper_Runner', rp: 4620, rank: 'NATIONAL' },
                { pos: 26, name: 'Vanguard_Jin', rp: 3510, rank: 'MONARCH' },
                { pos: 27, name: 'YOU', rp: rankScore || 3487, rank: 'MONARCH', isUser: true },
                { pos: 28, name: 'Calisthenic_Ace', rp: 3450, rank: 'MONARCH' }
              ].map(entry => (
                <div
                  key={entry.pos}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
                    entry.isUser 
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md' 
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-5 font-black ${entry.pos <= 3 ? 'text-amber-400' : 'text-slate-500'}`}>
                      #{entry.pos}
                    </span>
                    <span className="truncate">{entry.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-cyber">
                      {entry.rank}
                    </span>
                    <span className="font-bold">{entry.rp} RP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arena Win/Loss Record Footer */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-[10px] font-cyber text-slate-400 uppercase tracking-wider mb-1">
              YOUR ARENA RECORD
            </div>
            <div className="flex items-center justify-center space-x-4 text-xs font-mono font-black">
              <span className="text-emerald-400">24 WINS</span>
              <span className="text-slate-600">•</span>
              <span className="text-rose-400">4 LOSSES</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400">85.7% WIN RATE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
