import React, { useState } from 'react';
import { 
  Activity, ShieldAlert, Sparkles, User, Heart, Compass, 
  Dumbbell, Target, CheckCircle2, ChevronRight, ChevronLeft, Crown, Check
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const OnboardingModal = () => {
  const { profile, initializeNewAccount, restorePreviousSession } = useGame();
  
  // 'landing' | 1 | 2 | 3 | 4 | 5 | 6 | 7
  const [currentStep, setCurrentStep] = useState(profile.completedOnboarding ? 'done' : 'landing');
  const [signInFeedback, setSignInFeedback] = useState('');

  // Form states: strictly player data without campus squad
  const [name, setName] = useState(profile.name || 'Player_One');
  const [gender, setGender] = useState(profile.gender || 'Cyber Synth');
  const [goal, setGoal] = useState(profile.goal || 'Titan Strength');
  const [age, setAge] = useState(profile.age || 21);
  const [height, setHeight] = useState(profile.height || 178);
  const [weight, setWeight] = useState(profile.weight || 72);
  const [selectedIssues, setSelectedIssues] = useState(profile.healthIssues || ['None / Iron Core']);
  const [customHealthNote, setCustomHealthNote] = useState(profile.healthNotes || '');

  if (currentStep === 'done') return null;

  const TOTAL_STEPS = 7;

  const HEALTH_ISSUE_OPTIONS = [
    { id: 'none', label: 'None / Iron Core (Full Exertion Cleared)' },
    { id: 'asthma', label: 'Asthma / Respiratory Sensitivity' },
    { id: 'joint', label: 'Joint, Knee or Spinal Discomfort' },
    { id: 'heart', label: 'Heart / Cardiovascular Sensitivity' },
    { id: 'bp', label: 'Hypertension / High Blood Pressure' },
    { id: 'diabetes', label: 'Diabetes / Blood Sugar Regulation' }
  ];

  const GOAL_OPTIONS = [
    { id: 'Titan Strength', title: 'Shadow Monarch (Strength)', desc: 'Maximal muscle power output & hyper-density' },
    { id: 'Nano Agility', title: 'Wind Runner (Agility)', desc: 'Speed acceleration, high-reflex & rapid fat burn' },
    { id: 'Neon Endurance', title: 'Endless Stamina (Cardio)', desc: 'High-VO2 respiratory endurance & stamina pool' },
    { id: 'Zen Flow', title: 'Mana Regeneration (Mobility)', desc: 'Full-body flexibility, joint healing & calmness' }
  ];

  const nextStep = () => {
    sound.playSoloLevelingMessageTone();
    if (typeof currentStep === 'number') {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      } else {
        // At the last step, directly complete registration without showing initial values screen
        handleFinalAwakening();
      }
    }
  };

  const prevStep = () => {
    sound.playClick();
    if (typeof currentStep === 'number' && currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setCurrentStep('landing');
    }
  };

  const handleToggleIssue = (label) => {
    sound.playClick();
    if (label.includes('None')) {
      setSelectedIssues(['None / Iron Core']);
      return;
    }

    let next = selectedIssues.filter(i => !i.includes('None'));
    if (next.includes(label)) {
      next = next.filter(i => i !== label);
      if (next.length === 0) next = ['None / Iron Core'];
    } else {
      next.push(label);
    }
    setSelectedIssues(next);
  };

  const handleStartNow = () => {
    sound.playSoloLevelingMessageTone();
    setCurrentStep(1); // Ask questions one by one starting from Step 1
  };

  const handleSignIn = () => {
    sound.playSoloLevelingMessageTone();
    const success = restorePreviousSession();
    if (success) {
      setCurrentStep('done');
    } else {
      setSignInFeedback("No previous saved player session detected. Starting new awakening!");
      setTimeout(() => {
        setSignInFeedback('');
        setCurrentStep(1);
      }, 1500);
    }
  };

  // Direct awakening without showing initial score preview
  const handleFinalAwakening = () => {
    sound.playLevelUp();
    initializeNewAccount({
      name,
      gender,
      goal,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      healthIssues: selectedIssues,
      healthNotes: customHealthNote,
      department: 'Shadow Legion'
    });
    setCurrentStep('done');
  };

  const heightM = height / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      {/* 0. Wireframe Landing Screen (Phone Container: INNER AWAKENING, START NOW, SIGN IN) */}
      {currentStep === 'landing' && (
        <div className="relative w-full max-w-sm border-4 border-[#ffbe3b] rounded-3xl p-8 bg-[#090602] shadow-neon-gold flex flex-col items-center justify-between min-h-[580px] my-auto system-window">
          <div className="w-20 h-1.5 bg-[#2c1d04] rounded-full mb-6"></div>

          <div className="text-center my-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#ffbe3b]/10 border border-[#ffd700] flex items-center justify-center mb-6 shadow-neon-gold">
              <Crown className="text-[#ffd700] w-9 h-9 animate-pulse" />
            </div>
            <h1 className="font-cyber text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-white to-[#ffbe3b] uppercase leading-tight gold-glow-text">
              INNER<br />AWAKENING
            </h1>
            <p className="font-mono text-xs tracking-widest text-[#ffd700]/80 mt-3 uppercase">
              [ SYSTEM: PLAYER AWAKENING ]
            </p>
            <div className="mt-4 px-3 py-1 bg-[#221603] border border-[#ffbe3b]/50 rounded text-[11px] font-mono text-[#ffd700]">
              REAL WORLD → SYSTEM → LEVEL UP
            </div>

            {signInFeedback && (
              <p className="text-xs font-mono text-amber-300 mt-3 animate-pulse">
                {signInFeedback}
              </p>
            )}
          </div>

          <div className="w-full space-y-4 mt-8">
            <button
              onClick={handleStartNow}
              className="w-full py-3.5 bg-gradient-to-r from-[#e69500] to-[#ffd700] hover:from-[#ffd700] hover:to-[#ffea75] text-black font-cyber font-black tracking-widest text-base uppercase rounded-xl shadow-neon-gold transition-transform transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>START NOW</span>
              <ChevronRight size={20} />
            </button>

            <button
              onClick={handleSignIn}
              className="w-full py-2.5 bg-transparent hover:bg-amber-950/40 text-amber-300 font-mono text-sm tracking-wider uppercase underline decoration-[#ffd700] transition-colors"
            >
              SIGN IN (CONTINUE PREVIOUS PROGRESS)
            </button>
          </div>

          <div className="w-28 h-1 bg-amber-900/60 rounded-full mt-6"></div>
        </div>
      )}

      {/* 1 to 7: Step-by-Step (One by One) Requirements */}
      {typeof currentStep === 'number' && (
        <div className="relative w-full max-w-lg bg-[#0a0702] border-2 border-[#ffbe3b] rounded-2xl p-6 md:p-8 shadow-neon-gold my-auto system-window animate-fade-in">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-3 mb-6">
            <div>
              <span className="text-[10px] font-mono text-[#ffd700] uppercase tracking-widest block">
                [ SYSTEM REGISTRATION: STEP {currentStep} OF {TOTAL_STEPS} ]
              </span>
              <span className="text-xs font-mono text-amber-400">
                {Math.round((currentStep / TOTAL_STEPS) * 100)}% Synchronized
              </span>
            </div>
            <div className="w-28 h-2 bg-[#191104] rounded-full border border-[#ffbe3b]/40 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#e69500] to-[#ffd700] transition-all duration-300"
                style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* STEP 1: Player Name */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#ffd700]">
                <User size={20} />
                <h3 className="font-cyber text-lg font-bold uppercase gold-glow-text">
                  Player Identification
                </h3>
              </div>
              <p className="text-xs text-amber-200/80">
                State your designated Player call-sign for System registry:
              </p>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Player_One"
                className="w-full bg-[#181003] border-2 border-[#ffbe3b]/60 rounded-xl px-4 py-3 text-white font-cyber text-base focus:outline-none focus:border-[#ffd700] shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]"
              />
            </div>
          )}

          {/* STEP 2: Classification / Gender */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#ffd700]">
                <ShieldAlert size={20} />
                <h3 className="font-cyber text-lg font-bold uppercase gold-glow-text">
                  Player Classification
                </h3>
              </div>
              <p className="text-xs text-amber-200/80">
                Select your gender classification:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['Male', 'Female', 'Non-Binary', 'Cyber Synth'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => { sound.playClick(); setGender(g); }}
                    className={`py-3 px-4 rounded-xl border text-sm font-cyber font-bold transition-all ${
                      gender === g 
                        ? 'border-[#ffd700] bg-[#291b05] text-[#ffd700] shadow-neon-gold' 
                        : 'border-amber-950 bg-[#140e04] text-amber-300/70 hover:border-amber-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Choose Your Goal */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#ffd700]">
                <Target size={20} />
                <h3 className="font-cyber text-lg font-bold uppercase gold-glow-text">
                  Choose Your Goal
                </h3>
              </div>
              <p className="text-xs text-amber-200/80">
                Select your primary fitness evolution goal:
              </p>
              <div className="space-y-2.5">
                {GOAL_OPTIONS.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => { sound.playClick(); setGoal(g.id); }}
                    className={`cursor-pointer p-3 rounded-xl border transition-all ${
                      goal === g.id
                        ? 'border-[#ffd700] bg-[#271b05] shadow-neon-gold'
                        : 'border-amber-950/60 bg-[#120c03] hover:border-amber-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-cyber text-sm font-bold text-white">{g.title}</h4>
                      {goal === g.id && <CheckCircle2 size={16} className="text-[#ffd700]" />}
                    </div>
                    <p className="text-xs text-amber-200/70 mt-0.5">{g.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Age */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#ffd700]">
                <Activity size={20} />
                <h3 className="font-cyber text-lg font-bold uppercase gold-glow-text">
                  Biological Age
                </h3>
              </div>
              <p className="text-xs text-amber-200/80">
                Used to calculate safe cardiovascular training limits (Karvonen formula):
              </p>
              <input
                type="number"
                min="12"
                max="100"
                autoFocus
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-[#181003] border-2 border-[#ffbe3b]/60 rounded-xl px-4 py-3 text-white font-mono text-xl focus:outline-none focus:border-[#ffd700]"
              />
              <span className="text-[11px] font-mono text-amber-400 block">
                Calculated Max Heart Rate Safe Limit: {220 - age} BPM
              </span>
            </div>
          )}

          {/* STEP 5: Height */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#ffd700]">
                <Compass size={20} />
                <h3 className="font-cyber text-lg font-bold uppercase gold-glow-text">
                  Height (cm)
                </h3>
              </div>
              <p className="text-xs text-amber-200/80">
                Input your height in centimeters:
              </p>
              <input
                type="number"
                min="100"
                max="250"
                autoFocus
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-[#181003] border-2 border-[#ffbe3b]/60 rounded-xl px-4 py-3 text-white font-mono text-xl focus:outline-none focus:border-[#ffd700]"
              />
            </div>
          )}

          {/* STEP 6: Weight */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#ffd700]">
                <Dumbbell size={20} />
                <h3 className="font-cyber text-lg font-bold uppercase gold-glow-text">
                  Weight (kg)
                </h3>
              </div>
              <p className="text-xs text-amber-200/80">
                Input your body mass in kilograms:
              </p>
              <input
                type="number"
                min="30"
                max="200"
                autoFocus
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-[#181003] border-2 border-[#ffbe3b]/60 rounded-xl px-4 py-3 text-white font-mono text-xl focus:outline-none focus:border-[#ffd700]"
              />
              <div className="bg-[#181003] p-3 rounded-lg border border-[#ffbe3b]/30 flex items-center justify-between text-xs font-mono">
                <span className="text-amber-300">Live Body Mass Index (BMI):</span>
                <span className="text-[#ffd700] font-bold text-sm">{bmi}</span>
              </div>
            </div>
          )}

          {/* STEP 7: Health Issues for User Health Care (FINAL REQUIREMENT) */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#ffd700]">
                <ShieldAlert size={20} />
                <h3 className="font-cyber text-lg font-bold uppercase gold-glow-text">
                  Health Care Safeguards
                </h3>
              </div>
              <p className="text-xs text-amber-200/80">
                Inner Awakening safeguards your health. Mark any conditions so daily quests adapt for safe training:
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {HEALTH_ISSUE_OPTIONS.map((opt) => {
                  const active = selectedIssues.includes(opt.label);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleToggleIssue(opt.label)}
                      className={`cursor-pointer px-3 py-2 rounded-lg text-xs border flex items-center space-x-2 transition-colors ${
                        active
                          ? 'border-[#ffd700] bg-[#342408] text-white font-semibold'
                          : 'border-amber-950 bg-[#100b02] text-amber-300/60 hover:border-amber-800'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${active ? 'border-[#ffd700] bg-[#ffd700]' : 'border-amber-700'}`}>
                        {active && <Check size={12} className="text-black stroke-[3]" />}
                      </div>
                      <span className="truncate">{opt.label}</span>
                    </div>
                  );
                })}
              </div>
              <input
                type="text"
                value={customHealthNote}
                onChange={(e) => setCustomHealthNote(e.target.value)}
                placeholder="Optional medical notes: e.g. recovering from knee sprain..."
                className="w-full bg-[#181003] border border-amber-900 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffd700]"
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-[#ffbe3b]/30 mt-6">
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-[#181003] hover:bg-[#281a04] text-amber-300 font-mono text-xs uppercase rounded-lg border border-[#ffbe3b]/40 flex items-center space-x-1"
            >
              <ChevronLeft size={16} />
              <span>BACK</span>
            </button>

            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2.5 bg-gradient-to-r from-[#e69500] to-[#ffd700] hover:from-[#ffd700] hover:to-[#ffea75] text-black font-cyber font-black text-xs uppercase tracking-widest rounded-lg shadow-neon-gold flex items-center space-x-1"
            >
              <span>{currentStep === TOTAL_STEPS ? 'INITIATE INNER AWAKENING' : 'NEXT'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
