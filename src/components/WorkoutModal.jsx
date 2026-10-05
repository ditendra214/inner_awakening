import React, { useState } from 'react';
import { 
  X, Dumbbell, Flame, Zap, Award, CheckCircle2, 
  ChevronRight, Timer, Activity, ShieldCheck
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';
import { getRankByPoints, getNextRank } from '../utils/rankSystem';
import confetti from 'canvas-confetti';

export const WorkoutModal = ({ isOpen, onClose, onRankUpCelebration }) => {
  const { 
    rankScore, 
    setRankScore, 
    level, 
    setLevel,
    fitCoins,
    setFitCoins,
    blueCrystals,
    setBlueCrystals
  } = useGame();

  const [exerciseType, setExerciseType] = useState('squat');
  const [reps, setReps] = useState(30);
  const [formAccuracy, setFormAccuracy] = useState(95);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(null);

  if (!isOpen) return null;

  const handleCompleteWorkout = () => {
    sound.playClick();
    setIsSubmitting(true);

    const validReps = Math.round(reps * (formAccuracy / 100));
    const caloriesBurned = Math.round(reps * 2.8);
    const earnedXp = Math.round(validReps * 15);
    const earnedCoins = Math.round(validReps * 4);
    const earnedRp = Math.round(validReps * 3.5);

    setTimeout(() => {
      const oldRp = rankScore || 3487;
      const newRp = oldRp + earnedRp;

      const oldRank = getRankByPoints(oldRp);
      const newRank = getRankByPoints(newRp);
      const isRankUp = newRank.tierOrder > oldRank.tierOrder;

      // Update state
      if (setRankScore) setRankScore(newRp);
      if (setFitCoins) setFitCoins(prev => (prev || 0) + earnedCoins);
      if (setBlueCrystals) setBlueCrystals(prev => (prev || 0) + 15);

      sound.playLevelUp();
      confetti({
        particleCount: isRankUp ? 150 : 70,
        spread: 80,
        origin: { y: 0.5 }
      });

      if (isRankUp && onRankUpCelebration) {
        onRankUpCelebration({ oldRank, newRank });
      }

      setSessionCompleted({
        reps,
        validReps,
        caloriesBurned,
        earnedXp,
        earnedCoins,
        earnedRp,
        isRankUp,
        newRank
      });
      setIsSubmitting(false);
    }, 600);
  };

  const handleFinish = () => {
    sound.playClick();
    setSessionCompleted(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="w-full max-w-lg p-6 rounded-3xl bg-[#0b0f1d] border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.3)] relative">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
        >
          <X className="w-4 h-4" />
        </button>

        {!sessionCompleted ? (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-black font-black text-xl">
                🏋️
              </div>
              <div>
                <h3 className="font-cyber font-black text-base text-white uppercase tracking-wider gold-glow-text">
                  FITNESS SESSION WORKBENCH
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Perform or simulate kinetic exercise reps to calculate verified RP
                </p>
              </div>
            </div>

            {/* Exercise Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'squat', label: 'Squats', icon: '🦵' },
                { id: 'pushup', label: 'Push-ups', icon: '💪' },
                { id: 'jumping_jacks', label: 'Jumping Jacks', icon: '⚡' }
              ].map(ex => (
                <button
                  key={ex.id}
                  onClick={() => {
                    sound.playClick();
                    setExerciseType(ex.id);
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center text-xs font-cyber font-bold tracking-wider transition-all ${
                    exerciseType === ex.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xl mb-1">{ex.icon}</span>
                  <span>{ex.label}</span>
                </button>
              ))}
            </div>

            {/* Reps Slider */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Target Repetitions:</span>
                <span className="font-cyber text-sm font-black text-amber-400">{reps} REPS</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Form Accuracy Slider */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Kinetic Form Accuracy:</span>
                <span className="font-cyber text-sm font-black text-emerald-400">{formAccuracy}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="100"
                step="1"
                value={formAccuracy}
                onChange={(e) => setFormAccuracy(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>

            {/* Projected Gains Preview */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-center font-mono">
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Rank Points</div>
                <div className="text-xs font-black text-amber-400">+{Math.round(reps * (formAccuracy / 100) * 3.5)} RP</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Calories</div>
                <div className="text-xs font-black text-red-400">~{Math.round(reps * 2.8)} kcal</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Fitness XP</div>
                <div className="text-xs font-black text-cyan-400">+{Math.round(reps * (formAccuracy / 100) * 15)} XP</div>
              </div>
            </div>

            {/* Complete Workout Action */}
            <button
              disabled={isSubmitting}
              onClick={handleCompleteWorkout}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-cyber text-xs font-black uppercase tracking-widest shadow-[0_0_25px_rgba(245,158,11,0.6)] border border-yellow-300 transition-all flex items-center justify-center space-x-2"
            >
              <Dumbbell className="w-4 h-4" />
              <span>{isSubmitting ? 'CALCULATING BIOMETRIC SCORE...' : 'EXECUTE WORKOUT SESSION'}</span>
            </button>
          </div>
        ) : (
          /* SESSION COMPLETED SUMMARY */
          <div className="text-center space-y-4 animate-scale-up">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl font-black text-black shadow-lg">
              ✓
            </div>
            
            <div>
              <h3 className="font-cyber font-black text-lg text-white uppercase tracking-wider">
                {sessionCompleted.isRankUp ? '🎉 RANK PROMOTION ATTAINED!' : 'WORKOUT VERIFIED & LOGGED'}
              </h3>
              <p className="text-xs text-slate-300 font-mono mt-1">
                Completed {sessionCompleted.reps} reps with {sessionCompleted.validReps} validated kinetic repetitions.
              </p>
            </div>

            {/* Bounties Awarded */}
            <div className="grid grid-cols-3 gap-2 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center font-mono">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="text-[10px] text-amber-400 uppercase">Rank Points</div>
                <div className="text-base font-black text-amber-300">+{sessionCompleted.earnedRp} RP</div>
              </div>
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <div className="text-[10px] text-cyan-400 uppercase">Fitness XP</div>
                <div className="text-base font-black text-cyan-300">+{sessionCompleted.earnedXp} XP</div>
              </div>
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30">
                <div className="text-[10px] text-red-400 uppercase">Calories</div>
                <div className="text-base font-black text-red-300">{sessionCompleted.caloriesBurned} kcal</div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-cyber text-xs font-black uppercase tracking-wider shadow-lg"
            >
              CLAIM REWARDS & RETURN TO LOBBY
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
