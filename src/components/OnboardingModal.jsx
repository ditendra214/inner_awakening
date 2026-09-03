import React, { useState } from 'react';
import { 
  Activity, ShieldAlert, Sparkles, User, Heart, Compass, 
  Dumbbell, Target, CheckCircle2, ChevronRight, Crown
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const OnboardingModal = () => {
  const { profile, setProfile } = useGame();
  const [step, setStep] = useState(profile.completedOnboarding ? 'done' : 'landing');

  // Form states
  const [name, setName] = useState(profile.name || 'Sung_Jin_Woo');
  const [gender, setGender] = useState(profile.gender || 'Cyber Synth');
  const [goal, setGoal] = useState(profile.goal || 'Titan Strength');
  const [age, setAge] = useState(profile.age || 22);
  const [height, setHeight] = useState(profile.height || 178);
  const [weight, setWeight] = useState(profile.weight || 72);
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
    { id: 'Titan Strength', title: 'Shadow Monarch (Strength)', desc: 'Maximal muscle power output & hyper-density' },
    { id: 'Nano Agility', title: 'Wind Runner (Agility)', desc: 'Speed acceleration, high-reflex & rapid fat burn' },
    { id: 'Neon Endurance', title: 'Endless Stamina (Cardio)', desc: 'High-VO2 respiratory endurance & stamina pool' },
    { id: 'Zen Flow', title: 'Mana Regeneration (Mobility)', desc: 'Full-body flexibility, joint healing & calmness' }
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
    sound.playSoloLevelingMessageTone();
    setStep('form');
  };

  const handleSignIn = () => {
    sound.playSoloLevelingMessageTone();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      {/* 1. Landing View matching user wireframe sketch with Solo Leveling Gold styling */}
      {step === 'landing' && (
        <div className="relative w-full max-w-sm border-4 border-[#ffbe3b] rounded-3xl p-8 bg-[#090602] shadow-neon-gold flex flex-col items-center justify-between min-h-[580px] my-auto">
          {/* Top Speaker Slot */}
          <div className="w-20 h-1.5 bg-[#2c1d04] rounded-full mb-6"></div>

          {/* Title Header */}
          <div className="text-center my-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#ffbe3b]/10 border border-[#ffd700] flex items-center justify-center mb-6 shadow-neon-gold">
              <Crown className="text-[#ffd700] w-9 h-9 animate-pulse" />
            </div>
            <h1 className="font-cyber text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-white to-[#ffbe3b] uppercase leading-tight gold-glow-text">
              INNER<br />AWAKENING
            </h1>
            <p className="font-mono text-xs tracking-widest text-[#ffd700]/80 mt-3 uppercase">
              [ SYSTEM: SHADOW HUNTER PROTOCOL ]
            </p>
            <div className="mt-4 px-3 py-1 bg-[#221603] border border-[#ffbe3b]/50 rounded text-[11px] font-mono text-[#ffd700]">
              REAL WORLD → SYSTEM → LEVEL UP
            </div>
          </div>

          {/* Buttons matching wireframe: [start now] and [sign in] */}
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
              SIGN IN
            </button>
          </div>

          {/* Bottom Home Bar */}
          <div className="w-28 h-1 bg-amber-900/60 rounded-full mt-6"></div>
        </div>
      )}

      {/* 2. Health Care & User Intake Form with Solo Leveling Golden HUD */}
      {step === 'form' && (
        <div className="relative w-full max-w-2xl bg-[#0a0702] border-2 border-[#ffbe3b] rounded-2xl p-6 md:p-8 shadow-neon-gold my-auto max-h-[90vh] overflow-y-auto system-window">
          {/* Top Banner */}
          <div className="flex items-center justify-between border-b border-[#ffbe3b]/40 pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono text-[#ffd700] uppercase tracking-widest">
                [ SYSTEM: HUNTER REGISTRATION & HEALTH TELEMETRY ]
              </span>
              <h2 className="font-cyber text-2xl font-black tracking-wide text-white uppercase mt-1 gold-glow-text">
                AWAKEN YOUR STATUS WINDOW
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#ffbe3b]/10 border border-[#ffd700] flex items-center justify-center">
              <Activity className="text-[#ffd700]" size={22} />
            </div>
          </div>

          <form onSubmit={handleComplete} className="space-y-6">
            {/* Alias & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#ffd700] uppercase tracking-wider mb-1.5">
                  Hunter Call-Sign (Alias)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#181003] border border-[#ffbe3b]/50 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-[#ffd700]"
                  placeholder="e.g. Sung_Jin_Woo"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#ffd700] uppercase tracking-wider mb-1.5">
                  Hunter Classification / Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-[#181003] border border-[#ffbe3b]/50 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-[#ffd700]"
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
              <label className="block text-xs font-mono text-[#ffd700] uppercase tracking-wider mb-2">
                Choose Your Hunter Path (Evolution Goal)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOAL_OPTIONS.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => { sound.playClick(); setGoal(g.id); }}
                    className={`cursor-pointer p-3 rounded-lg border transition-all ${
                      goal === g.id
                        ? 'border-[#ffd700] bg-[#271b05] shadow-neon-gold'
                        : 'border-amber-950/60 bg-[#120c03] hover:border-amber-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-cyber text-sm font-bold text-white">{g.title}</h4>
                      {goal === g.id && <CheckCircle2 size={16} className="text-[#ffd700]" />}
                    </div>
                    <p className="text-xs text-amber-200/70 mt-1">{g.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Biometrics: Age, Height, Weight */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#ffd700] uppercase tracking-wider mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-[#181003] border border-[#ffbe3b]/50 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-[#ffd700]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#ffd700] uppercase tracking-wider mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  required
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-[#181003] border border-[#ffbe3b]/50 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-[#ffd700]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#ffd700] uppercase tracking-wider mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-[#181003] border border-[#ffbe3b]/50 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-[#ffd700]"
                />
              </div>
            </div>

            {/* Health issues for user health care */}
            <div className="border border-amber-500/50 bg-[#1c1203] p-4 rounded-xl">
              <div className="flex items-center space-x-2 text-[#ffd700] mb-2">
                <ShieldAlert size={18} />
                <h3 className="font-cyber text-sm font-bold uppercase tracking-wider">
                  Health Care & Safe Conditioning Matrix
                </h3>
              </div>
              <p className="text-xs text-amber-200/80 mb-3">
                Inner Awakening safeguards your physical body. The System calibrates daily quests to prevent joint strain or cardiovascular damage.
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
                          ? 'border-[#ffd700] bg-[#342408] text-white font-semibold shadow-[0_0_8px_rgba(255,215,0,0.3)]'
                          : 'border-amber-950 bg-[#100b02] text-amber-300/60 hover:border-amber-800'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${active ? 'border-[#ffd700] bg-[#ffd700]' : 'border-amber-700'}`}>
                        {active && <div className="w-1.5 h-1.5 bg-black rounded-sm"></div>}
                      </div>
                      <span className="truncate">{opt.label}</span>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-[11px] font-mono text-amber-300/70 uppercase tracking-wider mb-1">
                  Additional Medical / Health Care Notes (Optional)
                </label>
                <input
                  type="text"
                  value={customHealthNote}
                  onChange={(e) => setCustomHealthNote(e.target.value)}
                  placeholder="e.g., healing from sprained ankle, low sodium requirement, etc."
                  className="w-full bg-[#140e04] border border-amber-900 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ffd700]"
                />
              </div>
            </div>

            {/* Department / College Team Selection */}
            <div>
              <label className="block text-xs font-mono text-[#ffd700] uppercase tracking-wider mb-1.5">
                Affiliated Hunter Guild (Campus Squad)
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#181003] border border-[#ffbe3b]/50 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-[#ffd700]"
              >
                <option value="CSE-A">CSE-A (Shadow Legion Guild)</option>
                <option value="CSE-B">CSE-B (White Tiger Guild)</option>
                <option value="IT-A">IT-A (Fiend Guild)</option>
                <option value="MECH-1">MECH Titan Guild</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#e69500] via-[#ffd700] to-[#fff1a8] hover:from-[#ffd700] hover:to-[#fff9cc] text-black font-cyber font-black tracking-widest text-base uppercase rounded-xl shadow-neon-gold transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
              >
                <Sparkles size={20} className="fill-black" />
                <span>ACCEPT AWAKENING & ENTER SYSTEM</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
