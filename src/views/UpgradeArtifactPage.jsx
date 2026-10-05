import React, { useState } from 'react';
import { 
  ArrowLeft, Zap, Sparkles, Check, AlertTriangle, 
  ArrowRight, Coins, ShieldAlert, ArrowUpCircle
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { navigationManager } from '../services/navigationManager';
import { sound } from '../services/soundEngine';
import { INITIAL_ARTIFACT_CORES } from './ArtifactGearPage';
import confetti from 'canvas-confetti';

export const UpgradeArtifactPage = () => {
  const { sound, fitCoins, setFitCoins, blueCrystals, setBlueCrystals } = useGame();
  const navParams = navigationManager.getParams();
  
  // Find target artifact or default to Strength Core
  const targetId = navParams?.artifactId || 'strength_core';
  const initialTarget = INITIAL_ARTIFACT_CORES.find(a => a.id === targetId) || INITIAL_ARTIFACT_CORES[0];

  const [artifact, setArtifact] = useState(initialTarget);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  // Upgrade costs calculation
  const nextLevel = artifact.level + 1;
  const isMaxLevel = artifact.level >= artifact.maxLevel;
  const coinsCost = artifact.level * 600;
  const shardsCost = artifact.level * 25;

  const userCoins = fitCoins || 3450;
  const userShards = blueCrystals || 420;

  const hasEnoughCoins = userCoins >= coinsCost;
  const hasEnoughShards = userShards >= shardsCost;
  const canUpgrade = hasEnoughCoins && hasEnoughShards && !isMaxLevel;

  const handleConfirmUpgrade = () => {
    if (!canUpgrade) return;
    
    sound.playLevelUp();
    setIsUpgrading(true);
    setShowConfirmModal(false);

    // Deduct resources
    if (setFitCoins) setFitCoins(prev => Math.max(0, prev - coinsCost));
    if (setBlueCrystals) setBlueCrystals(prev => Math.max(0, prev - shardsCost));

    setTimeout(() => {
      setArtifact(prev => ({
        ...prev,
        level: prev.level + 1,
        statValue: prev.statValue + 12,
        statBonus: `+${prev.statValue + 12} Raw Power Output`
      }));
      setIsUpgrading(false);
      setUpgradeSuccess(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => setUpgradeSuccess(false), 3000);
    }, 600);
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-black font-black text-sm shadow-[0_0_12px_rgba(245,158,11,0.5)]">
              ⚡
            </div>
            <div>
              <h1 className="font-cyber font-black text-sm md:text-base tracking-wider text-white uppercase gold-glow-text">
                UPGRADE ARTIFACT
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">
                Enhance Bio-Kinetic Resonance & Tier Multipliers
              </p>
            </div>
          </div>
        </div>

        {/* Player Resources Bar */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
            <span>🪙</span>
            <span>{userCoins.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
            <span>💎</span>
            <span>{userShards.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 2. UPGRADE PREVIEW BENCH (Current -> Preview) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        {/* Main Compare Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center w-full mb-8">
          
          {/* CURRENT CARD */}
          <div className="md:col-span-5 p-6 rounded-3xl bg-[#0a0f20]/90 border border-slate-700/80 shadow-[0_0_25px_rgba(0,0,0,0.5)] flex flex-col items-center text-center relative overflow-hidden">
            <div className="text-[10px] font-cyber text-slate-400 tracking-widest uppercase mb-2">
              CURRENT ARTIFACT
            </div>
            <div className="text-6xl my-3 filter drop-shadow-md">
              {artifact.icon}
            </div>
            <h2 className="font-cyber font-black text-base text-white uppercase">
              {artifact.name}
            </h2>
            <div className="my-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-amber-400">
              LEVEL {artifact.level}
            </div>
            <div className="w-full mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300">
              {artifact.primaryStat}: <span className="text-white font-bold">+{artifact.statValue}</span>
            </div>
          </div>

          {/* ARROW CONNECTOR */}
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* UPGRADE PREVIEW CARD */}
          <div className="md:col-span-5 p-6 rounded-3xl bg-gradient-to-b from-[#161205] to-[#0c0902] border-2 border-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.25)] flex flex-col items-center text-center relative overflow-hidden">
            <div className="text-[10px] font-cyber text-amber-400 tracking-widest uppercase mb-2">
              UPGRADE PREVIEW
            </div>
            <div className="text-6xl my-3 filter drop-shadow-[0_0_20px_rgba(255,215,0,0.5)] scale-105 transition-transform">
              {artifact.icon}
            </div>
            <h2 className="font-cyber font-black text-base text-white uppercase">
              {artifact.name}
            </h2>
            <div className="my-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-xs font-mono font-black text-amber-300">
              LEVEL {isMaxLevel ? 'MAX' : nextLevel}
            </div>
            <div className="w-full mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-200">
              {artifact.primaryStat}: <span className="text-emerald-400 font-bold">+{artifact.statValue + 12}</span>
            </div>
          </div>
        </div>

        {/* 3. RESOURCE REQUIREMENTS & UPGRADE BUTTON */}
        <div className="w-full max-w-xl p-5 rounded-2xl bg-[#090e1c]/90 border border-slate-800 flex flex-col items-center space-y-4">
          <div className="text-xs font-cyber font-bold tracking-wider uppercase text-slate-300">
            REQUIRED REAGENTS
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            {/* Shards Requirement */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              hasEnoughShards 
                ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-300' 
                : 'bg-rose-950/20 border-rose-500/50 text-rose-300'
            }`}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">💎</span>
                <div className="text-left leading-tight">
                  <div className="text-[10px] uppercase font-mono text-slate-400">Fitness Shards</div>
                  <div className="font-mono text-xs font-bold">{shardsCost} Shards</div>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold ${hasEnoughShards ? 'text-emerald-400' : 'text-rose-400'}`}>
                {userShards} / {shardsCost}
              </span>
            </div>

            {/* Coins Requirement */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              hasEnoughCoins 
                ? 'bg-amber-950/20 border-amber-500/40 text-amber-300' 
                : 'bg-rose-950/20 border-rose-500/50 text-rose-300'
            }`}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🪙</span>
                <div className="text-left leading-tight">
                  <div className="text-[10px] uppercase font-mono text-slate-400">FitCoins</div>
                  <div className="font-mono text-xs font-bold">{coinsCost.toLocaleString()} Coins</div>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold ${hasEnoughCoins ? 'text-emerald-400' : 'text-rose-400'}`}>
                {userCoins} / {coinsCost}
              </span>
            </div>
          </div>

          {/* Insufficient Resources Warning if needed */}
          {!canUpgrade && !isMaxLevel && (
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-cyber tracking-wide py-1">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>INSUFFICIENT RESOURCES — Complete workouts or challenges to earn reagents.</span>
            </div>
          )}

          {isMaxLevel && (
            <div className="text-amber-400 text-xs font-cyber tracking-wide py-1">
              ⭐ THIS ARTIFACT CORE HAS REACHED MAXIMUM RESONANCE LEVEL.
            </div>
          )}

          {/* Upgrade Action Button */}
          <button
            disabled={!canUpgrade || isUpgrading}
            onClick={() => {
              sound.playClick();
              setShowConfirmModal(true);
            }}
            className={`w-full py-3.5 rounded-xl font-cyber text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
              canUpgrade && !isUpgrading
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black shadow-[0_0_25px_rgba(245,158,11,0.6)] border border-yellow-300 cursor-pointer'
                : 'bg-slate-800/60 text-slate-500 border border-slate-700/40 cursor-not-allowed'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>{isUpgrading ? 'TRANSMUTING CORE...' : 'UPGRADE CORE'}</span>
          </button>
        </div>
      </div>

      {/* CONFIRMATION POPUP MODAL */}
      {showConfirmModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0d1222] border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.3)] text-center space-y-4 animate-scale-up">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-3xl">
              ⚡
            </div>
            <h3 className="font-cyber font-black text-lg text-white uppercase tracking-wider">
              CONFIRM CORE UPGRADE
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Enhancing <strong className="text-amber-400">{artifact.name}</strong> to <strong className="text-emerald-400">Level {nextLevel}</strong> will consume <strong className="text-amber-300">{coinsCost.toLocaleString()} Coins</strong> and <strong className="text-cyan-300">{shardsCost} Shards</strong>.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowConfirmModal(false);
                }}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-cyber text-xs font-bold uppercase tracking-wider border border-slate-600"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmUpgrade}
                className="py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-cyber text-xs font-black uppercase tracking-wider shadow-lg border border-yellow-300"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPGRADE SUCCESS BANNER */}
      {upgradeSuccess && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-cyber text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(52,211,153,0.8)] animate-bounce flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>TRANSMUTATION SUCCESSFUL! CORE ATTRIBUTES INCREASED.</span>
        </div>
      )}
    </div>
  );
};
