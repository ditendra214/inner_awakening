import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../services/soundEngine';

const GameContext = createContext();

// Fresh Account Starting Baseline (Level 1, 0 XP, 0 Coins)
const FRESH_PROFILE = {
  name: 'Hunter_Sung',
  gender: 'Cyber Synth',
  goal: 'Titan Strength',
  age: 21,
  height: 175,
  weight: 70,
  healthIssues: ['None / Iron Core'],
  healthNotes: '',
  department: 'CSE-A',
  completedOnboarding: false
};

const FRESH_ATTRIBUTES = {
  stamina: 10,
  strength: 10,
  energy: 25,
  flexibility: 10,
  consistency: 5
};

const FRESH_BUILDINGS = [
  {
    id: 'cyber_outpost',
    name: 'Shadow Outpost Pod',
    type: 'habitation',
    level: 1,
    minPlayerLevel: 1,
    unlocked: true,
    cost: 100,
    bonus: '+5% XP on all quests',
    description: 'Your starter dimensional outpost in Neo-Arcadia 2050.',
    icon: 'Terminal'
  },
  {
    id: 'bio_gym',
    name: 'Grav-Kinetic Gym',
    type: 'training',
    level: 0,
    minPlayerLevel: 3,
    unlocked: false,
    cost: 250,
    bonus: '+15% Strength stat gains',
    description: 'Zero-G resistance pods calibrated for muscle hyper-density.',
    icon: 'Dumbbell'
  },
  {
    id: 'quantum_park',
    name: 'Bio-Luminescent Park',
    type: 'park',
    level: 0,
    minPlayerLevel: 5,
    unlocked: false,
    cost: 400,
    bonus: '+20% Stamina recovery speed',
    description: 'Oxygen-dense synthetic flora generating restorative aerosols.',
    icon: 'Trees'
  },
  {
    id: 'sky_track',
    name: 'Sky-Line Speed Track',
    type: 'track',
    level: 0,
    minPlayerLevel: 8,
    unlocked: false,
    cost: 650,
    bonus: '+25% FitCoins on outdoor runs',
    description: 'Suspended mag-lev track winding around towering arcologies.',
    icon: 'Zap'
  },
  {
    id: 'graviton_stadium',
    name: 'Graviton Mega Stadium',
    type: 'stadium',
    level: 0,
    minPlayerLevel: 12,
    unlocked: false,
    cost: 1000,
    bonus: 'Enables 2x multiplier in Guild Battles',
    description: 'Colosseum for interplanetary campus fitness supremacy.',
    icon: 'Trophy'
  },
  {
    id: 'neo_metropolis',
    name: 'Neo-Genesis Metropolis',
    type: 'city',
    level: 0,
    minPlayerLevel: 20,
    unlocked: false,
    cost: 2000,
    bonus: 'Unlocks Supreme Monarch Title & Aura',
    description: 'A thriving planetary biome powered entirely by your steps.',
    icon: 'Building2'
  }
];

const FRESH_MISSIONS = [
  {
    id: 'm1',
    title: 'Explorer Recon',
    type: 'easy',
    category: 'Walk / Steps',
    target: 2000,
    current: 0, // Starts fresh at 0
    unit: 'steps',
    xpReward: 100,
    coinReward: 35,
    statBonus: 'stamina',
    completed: false,
    description: 'Reconnaissance patrol around campus perimeter.',
    difficulty: '⭐'
  },
  {
    id: 'm2',
    title: 'Kinetic Core Burst',
    type: 'medium',
    category: 'Workout',
    target: 15,
    current: 0, // Starts fresh at 0
    unit: 'minutes',
    xpReward: 250,
    coinReward: 60,
    statBonus: 'strength',
    completed: false,
    description: 'Engage 15 minutes of dynamic core & squat overdrive.',
    difficulty: '⭐⭐'
  },
  {
    id: 'm3',
    title: 'Weekend Cyber-Warrior',
    type: 'hard',
    category: 'Cardio / Run',
    target: 30,
    current: 0, // Starts fresh at 0
    unit: 'minutes',
    xpReward: 600,
    coinReward: 150,
    statBonus: 'energy',
    completed: false,
    description: 'High-octane sprint protocol pushing peak heart thresholds.',
    difficulty: '⭐⭐⭐'
  },
  {
    id: 'm4',
    title: 'Zen Recovery Matrix',
    type: 'recovery',
    category: 'Recovery',
    target: 5,
    current: 0, // Starts fresh at 0
    unit: 'minutes',
    xpReward: 120,
    coinReward: 25,
    statBonus: 'flexibility',
    completed: false,
    description: 'Gentle somatic stretching session to flush lactic buildup.',
    difficulty: '🌱'
  }
];

const INITIAL_COLLEGE_TEAMS = [
  { id: 'cse-a', name: 'CSE-A (Shadow Legion)', xp: 82450, members: 48, rank: 1, color: '#ffd700' },
  { id: 'cse-b', name: 'CSE-B (White Tiger)', xp: 76800, members: 45, rank: 2, color: '#ff9900' },
  { id: 'it-a', name: 'IT-A (Fiend Guild)', xp: 71200, members: 42, rank: 3, color: '#f59e0b' },
  { id: 'mech-1', name: 'MECH Titan Guild', xp: 63100, members: 39, rank: 4, color: '#39ff14' }
];

const INITIAL_SHOP_ITEMS = [
  {
    id: 'item_visor',
    name: 'Holo-HUD Visor v4',
    type: 'gear',
    cost: 150,
    purchased: false,
    equipped: false,
    bonus: '+5% Mission XP',
    desc: 'Retinal AR overlay with real-time biometric telemetry.'
  },
  {
    id: 'item_kicks',
    name: 'Grav-Pulsed Velocity Kicks',
    type: 'shoes',
    cost: 280,
    purchased: false,
    equipped: false,
    bonus: '+8 Stamina Stat',
    desc: 'Kinetic dampening footwear with sub-atomic recoil generators.'
  },
  {
    id: 'item_exoskeleton',
    name: 'Nano-Fiber Muscle Weave',
    type: 'armor',
    cost: 500,
    purchased: false,
    equipped: false,
    bonus: '+12 Strength Stat',
    desc: 'Adaptive exoskeleton harness stabilizing spinal posture.'
  },
  {
    id: 'item_neural_band',
    name: 'Quantum Bio-Band',
    type: 'accessory',
    cost: 750,
    purchased: false,
    equipped: false,
    bonus: '+15 Energy Stat',
    desc: 'Monitors mitochondrial resonance and accelerates recovery.'
  }
];

export const GameProvider = ({ children }) => {
  // Load previously exited data from localStorage or start with fresh initial values
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('ia_profile');
    return saved ? JSON.parse(saved) : FRESH_PROFILE;
  });

  // Initial starting values for fresh account: Level 1, 0 XP, 0 FitCoins, 1 Day Streak, 100% Energy
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('ia_level');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('ia_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [fitCoins, setFitCoins] = useState(() => {
    const saved = localStorage.getItem('ia_coins');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('ia_streak');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [energy, setEnergy] = useState(() => {
    const saved = localStorage.getItem('ia_energy');
    return saved ? parseInt(saved, 10) : 100;
  });

  const [attributes, setAttributes] = useState(() => {
    const saved = localStorage.getItem('ia_attributes');
    return saved ? JSON.parse(saved) : FRESH_ATTRIBUTES;
  });

  const [buildings, setBuildings] = useState(() => {
    const saved = localStorage.getItem('ia_buildings');
    return saved ? JSON.parse(saved) : FRESH_BUILDINGS;
  });

  const [missions, setMissions] = useState(() => {
    const saved = localStorage.getItem('ia_missions');
    return saved ? JSON.parse(saved) : FRESH_MISSIONS;
  });

  const [collegeTeams, setCollegeTeams] = useState(() => {
    const saved = localStorage.getItem('ia_teams');
    return saved ? JSON.parse(saved) : INITIAL_COLLEGE_TEAMS;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('ia_inventory');
    return saved ? JSON.parse(saved) : INITIAL_SHOP_ITEMS;
  });

  const [soundMuted, setSoundMuted] = useState(false);
  const [ambientActive, setAmbientActive] = useState(false);

  // Notification alert modal state
  const [showLevelUpAlert, setShowLevelUpAlert] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState("Your next level awaits. Are you ready to prove yourself?");

  // Calculate XP threshold for current level
  const getXpThreshold = (lvl) => lvl * 200 + (lvl - 1) * 100;
  const currentThreshold = getXpThreshold(level);

  // Persistent storage: save continuous state whenever updated
  useEffect(() => {
    localStorage.setItem('ia_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('ia_level', level.toString());
  }, [level]);

  useEffect(() => {
    localStorage.setItem('ia_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('ia_coins', fitCoins.toString());
  }, [fitCoins]);

  useEffect(() => {
    localStorage.setItem('ia_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('ia_energy', energy.toString());
  }, [energy]);

  useEffect(() => {
    localStorage.setItem('ia_attributes', JSON.stringify(attributes));
  }, [attributes]);

  useEffect(() => {
    localStorage.setItem('ia_buildings', JSON.stringify(buildings));
  }, [buildings]);

  useEffect(() => {
    localStorage.setItem('ia_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('ia_teams', JSON.stringify(collegeTeams));
  }, [collegeTeams]);

  useEffect(() => {
    localStorage.setItem('ia_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Sound handlers
  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  const toggleAmbient = () => {
    const active = sound.toggleAmbientDrone();
    setAmbientActive(active);
  };

  // Create Fresh Hunter Account with initial starting scores (Level 1, 0 XP, 0 Coins)
  const initializeNewAccount = (newProfileData) => {
    const fullProfile = {
      ...newProfileData,
      completedOnboarding: true
    };
    setProfile(fullProfile);
    setLevel(1);
    setXp(0);
    setFitCoins(0);
    setStreak(1);
    setEnergy(100);
    setAttributes(FRESH_ATTRIBUTES);
    setBuildings(FRESH_BUILDINGS);
    setMissions(FRESH_MISSIONS);
    setInventory(INITIAL_SHOP_ITEMS);

    localStorage.setItem('ia_profile', JSON.stringify(fullProfile));
    localStorage.setItem('ia_level', '1');
    localStorage.setItem('ia_xp', '0');
    localStorage.setItem('ia_coins', '0');
    localStorage.setItem('ia_streak', '1');
    localStorage.setItem('ia_energy', '100');
    localStorage.setItem('ia_attributes', JSON.stringify(FRESH_ATTRIBUTES));
    localStorage.setItem('ia_buildings', JSON.stringify(FRESH_BUILDINGS));
    localStorage.setItem('ia_missions', JSON.stringify(FRESH_MISSIONS));
    localStorage.setItem('ia_inventory', JSON.stringify(INITIAL_SHOP_ITEMS));
  };

  // Sign In / Restore Previously Exited Session
  const restorePreviousSession = () => {
    const saved = localStorage.getItem('ia_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile({ ...parsed, completedOnboarding: true });
      return true;
    }
    return false;
  };

  // Log Out / Disconnect from System
  const logoutHunter = () => {
    sound.playClick();
    setProfile(prev => ({ ...prev, completedOnboarding: false }));
    // Data remains preserved in localStorage so signing back in resumes the exact state
  };

  // Add XP and handle level up
  const addXP = (amount) => {
    const newXp = xp + amount;
    const threshold = getXpThreshold(level);

    // Contribute to guild score
    setCollegeTeams(prev => prev.map(t => {
      if (t.id === profile.department.toLowerCase().replace(/[^a-z0-9]/g, '-') || t.name.includes(profile.department)) {
        return { ...t, xp: t.xp + amount };
      }
      return t;
    }));

    if (newXp >= threshold) {
      const leftover = newXp - threshold;
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setXp(leftover);
      setFitCoins(prev => prev + 100);
      sound.playLevelUp();

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ffbe3b', '#ffffff', '#e69500']
      });

      setLevelUpMessage(`Your level ${nextLevel} ascension is ready. Are you prepared to test your limits?`);
      setShowLevelUpAlert(true);
    } else {
      setXp(newXp);
    }
  };

  const addFitCoins = (amount) => {
    sound.playCoin();
    setFitCoins(prev => prev + amount);
  };

  // Complete a mission
  const completeMission = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.completed) return;

    sound.playSoloLevelingMessageTone();
    addXP(mission.xpReward);
    addFitCoins(mission.coinReward);

    if (mission.statBonus && attributes[mission.statBonus] !== undefined) {
      setAttributes(prev => ({
        ...prev,
        [mission.statBonus]: Math.min(100, prev[mission.statBonus] + 2)
      }));
    }

    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, completed: true, current: m.target } : m));
  };

  // Simulate or Log Real Activity (Steps, Minutes, etc.)
  const logActivity = (type, amount) => {
    let earnedXp = 0;
    let earnedCoins = 0;

    if (type === 'steps') {
      earnedXp = Math.round(amount * 0.05);
      earnedCoins = Math.round(amount * 0.015);
      setMissions(prev => prev.map(m => {
        if (m.unit === 'steps' && !m.completed) {
          const nextVal = m.current + amount;
          if (nextVal >= m.target) {
            completeMission(m.id);
            return { ...m, current: m.target, completed: true };
          }
          return { ...m, current: nextVal };
        }
        return m;
      }));
      setAttributes(prev => ({ ...prev, stamina: Math.min(100, prev.stamina + 1) }));
    } else if (type === 'workout') {
      earnedXp = Math.round(amount * 12);
      earnedCoins = Math.round(amount * 4);
      setMissions(prev => prev.map(m => {
        if (m.unit === 'minutes' && m.category.includes('Workout') && !m.completed) {
          const nextVal = m.current + amount;
          if (nextVal >= m.target) {
            completeMission(m.id);
            return { ...m, current: m.target, completed: true };
          }
          return { ...m, current: nextVal };
        }
        return m;
      }));
      setAttributes(prev => ({ ...prev, strength: Math.min(100, prev.strength + 2) }));
    } else if (type === 'run') {
      earnedXp = Math.round(amount * 15);
      earnedCoins = Math.round(amount * 5);
      setAttributes(prev => ({ ...prev, stamina: Math.min(100, prev.stamina + 2), energy: Math.min(100, prev.energy + 1) }));
    }

    if (earnedXp > 0) {
      addXP(earnedXp);
      addFitCoins(earnedCoins);
    }
  };

  // Build or Upgrade Facility in "Build Your Fitness World"
  const upgradeBuilding = (buildingId) => {
    const building = buildings.find(b => b.id === buildingId);
    if (!building) return { success: false, message: 'Structure not found.' };

    if (fitCoins < building.cost) {
      return { success: false, message: 'Insufficient FitCoins. Complete quests to harvest coins.' };
    }

    if (level < building.minPlayerLevel) {
      return { success: false, message: `Access restricted: Requires Hunter Level ${building.minPlayerLevel}.` };
    }

    setFitCoins(prev => prev - building.cost);
    sound.playLevelUp();

    setBuildings(prev => prev.map(b => {
      if (b.id === buildingId) {
        return {
          ...b,
          unlocked: true,
          level: b.level + 1,
          cost: Math.round(b.cost * 1.6)
        };
      }
      return b;
    }));

    addXP(150);
    return { success: true, message: `${building.name} upgraded successfully! Domain expanded.` };
  };

  // Purchase Equipment in Me tab
  const buyEquipment = (itemId) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    if (item.purchased) {
      sound.playClick();
      setInventory(prev => prev.map(i => i.id === itemId ? { ...i, equipped: !i.equipped } : i));
      return;
    }

    if (fitCoins >= item.cost) {
      sound.playCoin();
      setFitCoins(prev => prev - item.cost);
      setInventory(prev => prev.map(i => i.id === itemId ? { ...i, purchased: true, equipped: true } : i));
    }
  };

  // Generate dynamic AI quest tailored to health profile & activity
  const generateAIMission = () => {
    sound.playSoloLevelingMessageTone();
    const hasHeartIssue = profile.healthIssues.some(i => i.toLowerCase().includes('heart') || i.toLowerCase().includes('cardiac') || i.toLowerCase().includes('bp'));
    const hasAsthma = profile.healthIssues.some(i => i.toLowerCase().includes('asthma'));
    const hasJointPain = profile.healthIssues.some(i => i.toLowerCase().includes('joint') || i.toLowerCase().includes('back'));

    let questTitle = "[DAILY TRIAL: AEROBIC ACCELERATION]";
    let category = "Walk / Steps";
    let target = 2500;
    let unit = "steps";
    let desc = "The System computed an optimal aerobic pace for metabolic activation.";
    let xpRew = 200;
    let coinRew = 50;

    if (hasJointPain) {
      questTitle = "[LOW-IMPACT TRIAL: RECOVERY GLIDE]";
      category = "Low-Impact Walk";
      target = 1800;
      unit = "steps";
      desc = "Joint-friendly low impact movement designed to cushion articular cartilage.";
      xpRew = 220;
    } else if (hasHeartIssue) {
      questTitle = "[ZONE 2 TRIAL: STEADY-STATE MATRIX]";
      category = "Paced Walk";
      target = 12;
      unit = "minutes";
      desc = "Heart-safe moderate pacing strictly maintaining sub-maximal cardiac BPM.";
      xpRew = 240;
    } else if (hasAsthma) {
      questTitle = "[PULSED TRIAL: INTERVAL CADENCE]";
      category = "Interval Walk";
      target = 15;
      unit = "minutes";
      desc = "Controlled respiration rhythm with scheduled recovery pauses.";
      xpRew = 210;
    } else {
      questTitle = "[HARD TRIAL: MONARCH SPRINTS]";
      category = "HIIT / Cardio";
      target = 20;
      unit = "minutes";
      desc = "Maximal bio-energy exertion calibrated for peak cardiovascular stamina.";
      xpRew = 350;
      coinRew = 80;
    }

    const newQuest = {
      id: `ai_${Date.now()}`,
      title: questTitle,
      type: 'medium',
      category: category,
      target: target,
      current: 0,
      unit: unit,
      xpReward: xpRew,
      coinReward: coinRew,
      statBonus: 'energy',
      completed: false,
      description: desc,
      difficulty: '⭐⭐'
    };

    setMissions(prev => [newQuest, ...prev]);
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        setProfile,
        level,
        xp,
        currentThreshold,
        fitCoins,
        streak,
        energy,
        attributes,
        buildings,
        missions,
        collegeTeams,
        inventory,
        soundMuted,
        toggleSound,
        ambientActive,
        toggleAmbient,
        showLevelUpAlert,
        setShowLevelUpAlert,
        levelUpMessage,
        addXP,
        addFitCoins,
        completeMission,
        logActivity,
        upgradeBuilding,
        buyEquipment,
        generateAIMission,
        initializeNewAccount,
        restorePreviousSession,
        logoutHunter
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
