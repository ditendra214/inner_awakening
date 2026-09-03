import React, { useState } from 'react';
import { 
  Activity, ShieldAlert, Sparkles, User, Heart, Compass, 
  Dumbbell, Target, CheckCircle2, ChevronRight, Lock
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const OnboardingModal = () => {
  const { profile, setProfile } = useGame();
  const [step, setStep] = useState(profile.completedOnboarding ? 'done' : 'landing');

  // Form states
  const [name, setName] = useState(profile.name || 'Neo_Vanguard');
  const [gender, setGender] = useState(profile.gender || 'Cyber Synth');
  const [goal, setGoal] = useState(profile.goal || 'Titan Strength');
  const [age, setAge] = useState(profile.age || 21);
  const [height, setHeight] = useState(profile.height || 175);
  const [weight, setWeight] = useState(profile.weight || 70);
  const [selectedIssues, setSelectedIssues] = useState(profile.healthIssues || ['None / Iron Core']);
  const [customHealthNote, setCustomHealthNote] = useState(profile.healthNotes || '');
  const [department, setDepartment] = useState(profile.department || 'CSE-A');

  if (step === 'done') return null;

  const HEALTH_ISSUE_OPTIONS = [
    { id: 'none', label: 'None / Iron Core (Full Exertion Cleared)' },
    { id: 'asthma', label: 'Asthma / Respiratory Sensitivity' },
    { id: 'joint', label: 'Joint, Knee or Spinal Discomfort' },
    { id: 'heart', label: 'Heart / Cardiovascular Sensitivity' },
    { id: 'bp', label: 'Hypertension / High Blood Pressure' },
    { id: 'diabetes', label: 'Diabetes / Blood Sugar Regulation' }
  ];

  const GOAL_OPTIONS = [
    { id: 'Titan Strength', title: 'Titan Strength', desc: 'Hyper-density muscle synthesis & power output' },
    { id: 'Nano Agility', title: 'Nano Agility', desc: 'Accelerated fat oxidation & reflex speed' },
    { id: 'Neon Endurance', title: 'Neon Endurance', desc: 'High-mileage VO2 cardio conditioning' },
    { id: 'Zen Flow', title: 'Zen Flow', desc: 'Mobility, joint restoration & neural calmness' }
  ];

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
    sound.playChirp();
    setStep('form');
  };

  const handleSignIn = () => {
    sound.playClick();
    // Pre-fill and proceed
    setStep('form');
  };

  const handleComplete = (e) => {
    e.preventDefault();
    sound.playLevelUp();

    const updated = {
      ...profile,
      name,
      gender,
      goal,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      healthIssues: selectedIssues,
      healthNotes: customHealthNote,
      department,
      completedOnboarding: true
    };

    setProfile(updated);
    setStep('done');
  };

  // Calculate BMI preview
  const heightMeters = height / 100;
  const bmi = (weight / (heightMeters * heightMeters)).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      {/* 1. Landing View matching user wireframe sketch (Mobile frame with INNER AWAKENING, start now, sign in) */}
      {step === 'landing' && (
        <div className="relative w-full max-w-sm border-4 border-cyan-400 rounded-3xl p-8 bg-[#0a0f1d] shadow-neon-cyan flex flex-col items-center justify-between min-h-[580px] my-auto">
          {/* Top Speaker Slot simulation */}
          <div className="w-20 h-1.5 bg-cyan-900 rounded-full mb-6"></div>

          {/* Title Header */}
          <div className="text-center my-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400 flex items-center justify-center mb-6 shadow-neon-cyan">
              <Sparkles className="text-cyan-400 w-8 h-8 animate-pulse" />
            </div>
            <h1 className="font-cyber text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-500 uppercase leading-tight drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]">
              INNER<br />AWAKENING
            </h1>
            <p className="font-mono text-xs tracking-widest text-cyan-300/70 mt-3 uppercase">
              2050 Real-Life Fitness RPG
            </p>
            <div className="mt-4 px-3 py-1 bg-cyan-950/60 border border-cyan-500/40 rounded text-[11px] font-mono text-cyan-300">
              REAL WORLD → GAME → GROWTH
            </div>
          </div>

          {/* Buttons matching wireframe: [start now] and [sign in] */}
          <div className="w-full space-y-4 mt-8">
            <button
              onClick={handleStartNow}
              className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-cyber font-black tracking-widest text-base uppercase rounded-xl shadow-neon-cyan transition-transform transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>START NOW</span>
              <ChevronRight size={20} />
            </button>

            <button
              onClick={handleSignIn}
              className="w-full py-2.5 bg-transparent hover:bg-slate-800/40 text-slate-300 hover:text-white font-mono text-sm tracking-wider uppercase underline decoration-cyan-400 transition-colors"
            >
              SIGN IN
            </button>
          </div>

          {/* Bottom Home Indicator */}
          <div className="w-28 h-1 bg-slate-700 rounded-full mt-6"></div>
        </div>
      )}

      {/* 2. Health Care & User Intake Form */}
      {step === 'form' && (
        <div className="relative w-full max-w-2xl bg-[#0b1122] border-2 border-cyan-400/60 rounded-2xl p-6 md:p-8 shadow-neon-cyan my-auto max-h-[90vh] overflow-y-auto">
          {/* Scanline effect */}
          <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-20"></div>

          {/* Top Banner */}
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                [ PROTOCOL 2050: HEALTH & BIO-TELEMETRY ]
              </span>
              <h2 className="font-cyber text-2xl font-black tracking-wide text-white uppercase mt-1">
                AWAKEN YOUR PROFILE
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center">
              <Activity className="text-cyan-400" size={22} />
            </div>
          </div>

          <form onSubmit={handleComplete} className="space-y-6">
            {/* Alias & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-1.5">
                  Character Call-Sign (Alias)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#121a33] border border-cyan-500/40 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  placeholder="e.g. CyberRunner_99"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-1.5">
                  Biological / Synth Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-[#121a33] border border-cyan-500/40 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-cyan-400"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Cyber Synth">Cyber Synth</option>
                </select>
              </div>
            </div>

            {/* Choose Your Goal */}
            <div>
              <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-2">
                Choose Your Primary Evolution Goal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOAL_OPTIONS.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => { sound.playClick(); setGoal(g.id); }}
                    className={`cursor-pointer p-3 rounded-lg border transition-all ${
                      goal === g.id
                        ? 'border-cyan-400 bg-cyan-950/50 shadow-neon-cyan'
                        : 'border-slate-800 bg-[#0d1428] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-cyber text-sm font-bold text-white">{g.title}</h4>
                      {goal === g.id && <CheckCircle2 size={16} className="text-cyan-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{g.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Biometrics: Age, Height, Weight */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-[#121a33] border border-cyan-500/40 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  required
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-[#121a33] border border-cyan-500/40 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-[#121a33] border border-cyan-500/40 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Health issues for user health care (CRUCIAL REQUIREMENT) */}
            <div className="border border-pink-500/40 bg-pink-950/20 p-4 rounded-xl">
              <div className="flex items-center space-x-2 text-pink-400 mb-2">
                <ShieldAlert size={18} />
                <h3 className="font-cyber text-sm font-bold uppercase tracking-wider">
                  Health Care & Safe Conditioning Matrix
                </h3>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Inner Awakening prioritizes your long-term health. Mark any conditions so our AI Game Master adapts mission intensity to safeguard your well-being.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {HEALTH_ISSUE_OPTIONS.map((opt) => {
                  const active = selectedIssues.includes(opt.label);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleToggleIssue(opt.label)}
                      className={`cursor-pointer px-3 py-2 rounded text-xs border flex items-center space-x-2 transition-colors ${
                        active
                          ? 'border-pink-500 bg-pink-900/40 text-white font-semibold'
                          : 'border-slate-800 bg-[#0d1428] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${active ? 'border-pink-400 bg-pink-500' : 'border-slate-600'}`}>
                        {active && <div className="w-1.5 h-1.5 bg-black rounded-sm"></div>}
                      </div>
                      <span className="truncate">{opt.label}</span>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Additional Medical / Health Care Notes (Optional)
                </label>
                <input
                  type="text"
                  value={customHealthNote}
                  onChange={(e) => setCustomHealthNote(e.target.value)}
                  placeholder="e.g., healing from sprained ankle, low sodium requirement, etc."
                  className="w-full bg-[#121a33] border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-pink-400"
                />
              </div>
            </div>

            {/* Department / College Team Selection */}
            <div>
              <label className="block text-xs font-mono text-cyan-300 uppercase tracking-wider mb-1.5">
                Affiliated Campus / College Guild
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#121a33] border border-cyan-500/40 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-cyan-400"
              >
                <option value="CSE-A">CSE-A (Cyber Synergists)</option>
                <option value="CSE-B">CSE-B (Quantum Dynamos)</option>
                <option value="IT-A">IT-A (Neural Phantoms)</option>
                <option value="MECH-1">MECH Titan Force</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-black font-cyber font-black tracking-widest text-base uppercase rounded-xl shadow-neon-cyan transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
              >
                <Sparkles size={20} className="fill-black" />
                <span>INITIATE INNER AWAKENING</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
