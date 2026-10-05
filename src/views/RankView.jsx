import React, { useState, useEffect } from 'react';
import { 
  Crown, Flame, Dumbbell, Zap, ChevronRight, Award, Shield, 
  Sparkles, Check, Lock, Gift, Trophy, RefreshCw, Star, ArrowRight,
  Maximize, Settings, Bell, Swords, Shirt, ArrowUpCircle, Package
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CharacterViewer3D } from '../components/CharacterViewer3D';
import { WorkoutModal } from '../components/WorkoutModal';
import { SettingsModal } from '../components/SettingsModal';
import { navigationManager } from '../services/navigationManager';
import { sound } from '../services/soundEngine';
import { 
  FITNESS_RANKS, getRankByPoints, getNextRank, calculateRankProgress, getRankById 
} from '../utils/rankSystem';
import confetti from 'canvas-confetti';

export const RankView = () => {
  const { 
    profile, 
    level, 
    fitCoins, 
    blueCrystals, 
    rankScore, 
    setRankScore,
    playerEquipment 
  } = useGame();

  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [rankUpCelebration, setRankUpCelebration] = useState(false);
  const [promotedModal, setPromotedModal] = useState(null);

  // Current Rank Calculations from dynamic RP
  const currentPoints = rankScore || 3487;
  const currentRank = getRankByPoints(currentPoints);
  const nextRank = getNextRank(currentRank.id);
  const progressPercent = calculateRankProgress(currentPoints, currentRank);
  const pointsToNext = nextRank ? Math.max(0, nextRank.minRp - currentPoints) : 0;

  // Streak, Workouts, Calories statistics
  const fitnessStats = {
    streak: 5,
    workouts: 178,
    calories: 52340
  };

  const handleOpenWorkout = () => {
    sound.playClick();
    setWorkoutModalOpen(true);
  };

  const handleRankUpEvent = ({ oldRank, newRank }) => {
    setRankUpCelebration(true);
    setPromotedModal({ oldRank, newRank });
    setTimeout(() => setRankUpCelebration(false), 5000);
  };

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#03060f] text-slate-100 select-none overflow-hidden relative font-sans">
      
      {/* 0. ATMOSPHERIC DEEP NEON GAME LIGHTING IN BACKGROUND */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-60" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[600px] h-[350px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* ========================================================================= */}
      {/* 1. FULL-WIDTH TOP BAR (Logo, Profile, Level, XP, Currencies, System Controls) */}
      {/* ========================================================================= */}
      <header className="relative z-30 h-14 px-4 md:px-6 border-b border-amber-500/20 bg-[#060914]/90 backdrop-blur-md flex items-center justify-between">
        
        {/* Left: Original Fitness Brand Identity */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-transparent px-3 py-1 rounded-xl border-l-2 border-amber-400">
            <Dumbbell className="text-amber-400 w-4 h-4" />
            <span className="font-cyber font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 uppercase text-xs md:text-sm">
              INNER AWAKENING
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">| FITNESS GAMING ARENA</span>
        </div>

        {/* Center: Player Status, Level & Mini XP Bar */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700/60 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center font-bold text-black text-xs shadow-md">
              👑
            </div>
            <div className="text-left leading-none">
              <div className="text-xs font-bold text-slate-200">{profile?.name || 'FitWarrior'}</div>
              <div className="text-[9px] text-amber-400 font-mono mt-0.5">LVL {level || 32}</div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="hidden lg:flex flex-col w-32 space-y-0.5">
            <div className="flex justify-between text-[8px] font-mono text-slate-400">
              <span>XP</span>
              <span>85%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right: Currencies, Notifications, Settings, Fullscreen */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* FitCoins */}
          <div className="flex items-center space-x-1.5 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-mono text-amber-300 font-bold">
            <span>🪙</span>
            <span>{(fitCoins || 3450).toLocaleString()}</span>
          </div>

          {/* Blue Crystals */}
          <div className="flex items-center space-x-1.5 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-full text-xs font-mono text-cyan-300 font-bold">
            <span>💎</span>
            <span>{(blueCrystals || 420).toLocaleString()}</span>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => {
              sound.playClick();
              setSettingsModalOpen(true);
            }}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="Open Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700/60 transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN 3-PANEL RESPONSIVE BODY (LEFT NAV | OPEN 3D STAGE | RIGHT DASHBOARD) */}
      {/* ========================================================================= */}
      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden relative">
        
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT COLUMN: MAIN GAME NAVIGATION (Matches Reference Layout) */}
        {/* ----------------------------------------------------------------------- */}
        <div className="col-span-12 md:col-span-3 lg:col-span-2 p-3 md:p-4 flex flex-col justify-between z-20 bg-gradient-to-r from-[#060914]/95 via-[#060914]/80 to-transparent">
          <nav className="space-y-1.5">
            {/* Active RANK Button */}
            <button
              onClick={() => sound.playClick()}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-cyber font-black text-xs md:text-sm tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-yellow-300 transition-all"
            >
              <Crown className="w-4 h-4 text-black fill-black" />
              <span>RANK LOBBY</span>
            </button>

            {[
              { label: 'WORKOUT', icon: Dumbbell, action: handleOpenWorkout },
              { label: 'CHALLENGES', icon: Zap, action: () => { sound.playClick(); navigationManager.openPage('arena'); } },
              { label: 'LEADERBOARD', icon: Trophy, action: () => { sound.playClick(); navigationManager.openPage('arena'); } }
            ].map(item => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl bg-slate-900/50 hover:bg-slate-800/70 text-slate-300 hover:text-white font-cyber font-bold text-xs tracking-wider border border-slate-800/60 hover:border-slate-700 transition-all"
                >
                  <IconComp className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* SEPARATOR TO DEDICATED SUB-PAGES */}
            <div className="pt-2 pb-1">
              <div className="h-[1px] bg-slate-800/80 w-full" />
              <div className="text-[9px] font-cyber text-slate-500 uppercase tracking-widest mt-2 px-1">
                DEDICATED SYSTEMS
              </div>
            </div>

            {/* DEDICATED SEPARATE PAGES BUTTONS */}
            <button
              onClick={() => {
                sound.playClick();
                navigationManager.openPage('inventory');
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/70 hover:bg-amber-500/20 text-slate-200 hover:text-amber-400 font-cyber text-xs font-bold tracking-wider border border-slate-800 hover:border-amber-500/50 transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <Package className="w-4 h-4 text-amber-400" />
                <span>INVENTORY</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                navigationManager.openPage('artifacts');
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/70 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 font-cyber text-xs font-bold tracking-wider border border-slate-800 hover:border-purple-500/50 transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>ARTIFACT GEAR</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                navigationManager.openPage('upgrade');
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/70 hover:bg-yellow-500/20 text-slate-200 hover:text-yellow-300 font-cyber text-xs font-bold tracking-wider border border-slate-800 hover:border-yellow-500/50 transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <ArrowUpCircle className="w-4 h-4 text-yellow-400" />
                <span>UPGRADE CORES</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                navigationManager.openPage('arena');
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/70 hover:bg-red-500/20 text-slate-200 hover:text-red-400 font-cyber text-xs font-bold tracking-wider border border-slate-800 hover:border-red-500/50 transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <Swords className="w-4 h-4 text-red-400" />
                <span>RANK ARENA</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </nav>

          {/* Bottom Motivation Banner */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 text-center">
            <div className="text-[10px] font-cyber font-black tracking-widest text-amber-400 uppercase">
              TRAIN • COMPETE • AWAKEN
            </div>
            <div className="text-[8px] text-slate-500 mt-0.5 font-mono">
              Inner Awakening Engine v1.0
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* CENTER COLUMN: OPEN 3D CHARACTER VIEWPORT (NO BOX, PBR LIGHTING) */}
        {/* ----------------------------------------------------------------------- */}
        <div className="col-span-12 md:col-span-5 lg:col-span-6 relative flex items-center justify-center min-h-[420px] md:min-h-0 overflow-visible z-10">
          
          {/* Subtle atmospheric ambient glow ring behind character */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Athlete Identity Nameplate */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-slate-950/80 border border-amber-500/30 flex items-center space-x-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] backdrop-blur-md pointer-events-none">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-cyber font-bold text-xs text-white uppercase tracking-wider">
              {profile?.name || 'MONARCH WARRIOR'}
            </span>
            <span className="text-[9px] font-mono text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10 font-bold">
              LVL {level || 32}
            </span>
          </div>

          {/* 3D Character Canvas (Full body, realistic PBR materials, no box enclosure) */}
          <div className="w-full h-full flex items-center justify-center">
            <CharacterViewer3D 
              className="w-full h-full"
              celebrateRankUp={rankUpCelebration}
              equippedOverride={playerEquipment}
              showTopBar={true}
              showBottomBar={true}
            />
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT COLUMN: RANK DASHBOARD & PROGRESSION LADDER (Matches Reference Layout) */}
        {/* ----------------------------------------------------------------------- */}
        <div className="col-span-12 md:col-span-4 lg:col-span-4 p-4 md:p-5 flex flex-col justify-between z-20 bg-gradient-to-l from-[#060914]/95 via-[#060914]/80 to-transparent overflow-y-auto space-y-3">
          
          {/* 1. RANK CREST & DETAILS CARD */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/80 via-[#0a0e1c]/90 to-slate-950/95 border border-amber-500/30 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            
            {/* Background Glow */}
            <div className="absolute -top-10 w-44 h-44 bg-amber-500/15 blur-[50px] pointer-events-none rounded-full" />

            {/* Rank Badge Header */}
            <div className="text-[10px] font-cyber text-amber-400 font-bold tracking-widest uppercase mb-1">
              CURRENT FITNESS RANK
            </div>

            {/* Official 3D Emblem with Floating Glow Animation */}
            <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center my-1 transition-transform hover:scale-105 duration-300">
              <img 
                src={currentRank.badge} 
                alt={currentRank.name}
                className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse"
              />
            </div>

            {/* Rank Name Glowing Title */}
            <div className="font-cyber font-black text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 uppercase">
              {currentRank.name}
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              {currentRank.title}
            </div>

            {/* Animated Rank Points Counter & Progress Bar */}
            <div className="w-full mt-3 px-2">
              <div className="flex justify-between items-center text-xs mb-1 font-mono">
                <span className="text-amber-400 font-bold flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 inline fill-amber-500" />
                  <span>RANK POINTS</span>
                </span>
                <span className="text-slate-200 font-bold">
                  {currentPoints.toLocaleString()} / {currentRank.maxRp.toLocaleString()} RP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                  style={{ width: `${Math.min(100, Math.max(8, progressPercent))}%` }}
                />
              </div>

              {/* Next Rank Info */}
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-1">
                <span>Progress: {progressPercent}%</span>
                {nextRank ? (
                  <span>{pointsToNext} RP to {nextRank.name}</span>
                ) : (
                  <span className="text-amber-400 font-bold">MAXIMUM RANK REACHED</span>
                )}
              </div>
            </div>

            {/* 3 Quick Fitness Statistic Cards */}
            <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80">
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 text-center">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider flex items-center justify-center space-x-1">
                  <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                  <span>STREAK</span>
                </div>
                <div className="text-sm font-black text-white font-mono mt-0.5">
                  {fitnessStats.streak} DAYS
                </div>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 text-center">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider flex items-center justify-center space-x-1">
                  <Dumbbell className="w-3 h-3 text-blue-400" />
                  <span>WORKOUTS</span>
                </div>
                <div className="text-sm font-black text-white font-mono mt-0.5">
                  {fitnessStats.workouts}
                </div>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 text-center">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider flex items-center justify-center space-x-1">
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>CALORIES</span>
                </div>
                <div className="text-sm font-black text-white font-mono mt-0.5">
                  {fitnessStats.calories.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* 2. RANK PROGRESSION HIERARCHY BREADCRUMB (E to MONARCH) */}
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
            <div className="text-[10px] font-cyber text-slate-400 uppercase tracking-wider mb-2">
              RANK PROGRESSION HIERARCHY
            </div>
            <div className="flex items-center justify-between overflow-x-auto py-1 px-1">
              {FITNESS_RANKS.slice().reverse().map((r, idx, arr) => {
                const isActive = r.id === currentRank.id;
                return (
                  <React.Fragment key={r.id}>
                    <div className="flex flex-col items-center flex-shrink-0" title={`${r.name} (${r.minRp}+ RP)`}>
                      <div className={`w-7 h-7 rounded-lg p-0.5 flex items-center justify-center transition-all ${
                        isActive 
                          ? 'ring-2 ring-amber-400 scale-110 bg-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.6)]' 
                          : 'opacity-50 hover:opacity-80'
                      }`}>
                        <img src={r.badge} alt={r.name} className="w-full h-full object-contain" />
                      </div>
                      <span className={`text-[9px] font-mono mt-0.5 font-black ${isActive ? 'text-amber-400' : 'text-slate-500'}`}>
                        {r.id}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <span className="text-slate-600 text-xs mx-0.5">→</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* 3. PRIMARY CTA BUTTON: PLAY & IMPROVE */}
          <button
            onClick={handleOpenWorkout}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-cyber font-black text-xs md:text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(245,158,11,0.6)] border border-yellow-300 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
          >
            <Dumbbell className="w-4 h-4 text-black fill-black" />
            <span>PLAY & IMPROVE</span>
            <ChevronRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MODALS (Workout, Settings, Rank-Up Fanfare) */}
      {/* ========================================================================= */}
      <WorkoutModal 
        isOpen={workoutModalOpen} 
        onClose={() => setWorkoutModalOpen(false)}
        onRankUpCelebration={handleRankUpEvent}
      />

      <SettingsModal 
        isOpen={settingsModalOpen} 
        onClose={() => setSettingsModalOpen(false)} 
      />

      {/* RANK UP FANFARE MODAL */}
      {promotedModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-scale-up">
          <div className="w-full max-w-md p-8 rounded-3xl bg-gradient-to-b from-[#181104] via-[#0d0901] to-black border-2 border-amber-400 shadow-[0_0_60px_rgba(245,158,11,0.5)] text-center space-y-4">
            <div className="w-24 h-24 mx-auto my-2 filter drop-shadow-[0_0_25px_rgba(255,215,0,0.8)]">
              <img src={promotedModal.newRank.badge} alt="Promoted" className="w-full h-full object-contain animate-bounce" />
            </div>
            <div className="text-amber-400 font-cyber font-black text-xs tracking-widest uppercase">
              RANK PROMOTION ATTAINED!
            </div>
            <h2 className="font-cyber font-black text-2xl text-white uppercase gold-glow-text">
              {promotedModal.newRank.name}
            </h2>
            <p className="text-xs text-slate-300 font-mono">
              Congratulations! Your consistent training has elevated your hunter tier to {promotedModal.newRank.title}.
            </p>
            <button
              onClick={() => {
                sound.playClick();
                setPromotedModal(null);
              }}
              className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-cyber text-xs font-black uppercase tracking-wider shadow-lg border border-yellow-300"
            >
              ACCEPT HONOR & CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
