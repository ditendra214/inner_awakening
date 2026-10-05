import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../services/soundEngine';
import { getHunterRank } from '../utils/ranks';
import { 
  ITEM_DATABASE, 
  INITIAL_EQUIPMENT, 
  calculateStatBonuses, 
  getItemById,
  isItemOwned 
} from '../data/itemDatabase';

const GameContext = createContext();

// Catalogue of System Tones available in the game
export const SYSTEM_TONES = [
  {
    id: 'monarch_crystal',
    name: "Monarch's Crystal Bell",
    description: "Iconic crystalline ethereal chime echoing from the System.",
    badge: "DEFAULT",
    unlockedDefault: true,
    missionRewardFor: null
  },
  {
    id: 'gate_resonance',
    name: "Dimensional Gate Chime",
    description: "Ascending two-tone crystal ring marking dungeon gate breaches.",
    badge: "MISSION REWARD",
    unlockedDefault: false,
    missionId: 'm1',
    missionTitle: 'Explorer Recon'
  },
  {
    id: 'shadow_pulse',
    name: "Shadow Sovereign Pulse",
    description: "Resonant dark mana pulse echoing from the Monarch of Shadows.",
    badge: "MISSION REWARD",
    unlockedDefault: false,
    missionId: 'm2',
    missionTitle: 'Kinetic Core Burst'
  },
  {
    id: 'monarch_thunder',
    name: "Dragon Monarch's Thunder",
    description: "Thunderous shockwave strike vibrating the dimensional rift.",
    badge: "MISSION REWARD",
    unlockedDefault: false,
    missionId: 'm3',
    missionTitle: 'Weekend Cyber-Warrior'
  },
  {
    id: 'celestial_harmonic',
    name: "Ruler's Authority Harmony",
    description: "Celestial shimmering overtone emitted by cosmic arbiters.",
    badge: "MISSION REWARD",
    unlockedDefault: false,
    missionId: 'm4',
    missionTitle: 'Zen Recovery Matrix'
  }
];

// Initial baseline hunter notifications
const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_welcome',
    title: '[ SYSTEM INITIALIZATION COMPLETE ]',
    message: 'Welcome Awakened Hunter. Your trial has commenced. Complete real-world fitness missions to rank up from E Rank all the way to Monarch.',
    timestamp: 'Just now',
    type: 'system',
    unread: true
  },
  {
    id: 'notif_tone_default',
    title: '[ AUDIO MATRIX CALIBRATED ]',
    message: "Default tone 'Monarch's Crystal Bell' is active. Unlock more custom system tones by conquering specific quest trials!",
    timestamp: 'Just now',
    type: 'reward',
    unread: true
  }
];

// Fresh Account Starting Baseline (Level 1, 0 XP, 0 Coins -> E Rank)
const FRESH_PROFILE = {
  name: 'Player_One',
  gender: 'Cyber Synth',
  goal: 'Titan Strength',
  age: 21,
  height: 175,
  weight: 70,
  healthIssues: ['None / Iron Core'],
  healthNotes: '',
  department: 'Shadow Legion',
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
    current: 0,
    unit: 'steps',
    xpReward: 100,
    coinReward: 35,
    crystalReward: 5,
    statBonus: 'stamina',
    completed: false,
    description: 'Reconnaissance patrol around campus perimeter.',
    difficulty: '⭐',
    toneReward: {
      id: 'gate_resonance',
      name: 'Dimensional Gate Chime'
    }
  },
  {
    id: 'm2',
    title: 'Kinetic Core Burst',
    type: 'medium',
    category: 'Workout',
    target: 15,
    current: 0,
    unit: 'minutes',
    xpReward: 250,
    coinReward: 60,
    crystalReward: 15,
    statBonus: 'strength',
    completed: false,
    description: 'Engage 15 minutes of dynamic core & squat overdrive.',
    difficulty: '⭐⭐',
    toneReward: {
      id: 'shadow_pulse',
      name: 'Shadow Sovereign Pulse'
    }
  },
  {
    id: 'm3',
    title: 'Weekend Cyber-Warrior',
    type: 'hard',
    category: 'Cardio / Run',
    target: 30,
    current: 0,
    unit: 'minutes',
    xpReward: 600,
    coinReward: 150,
    crystalReward: 25,
    statBonus: 'energy',
    completed: false,
    description: 'High-octane sprint protocol pushing peak heart thresholds.',
    difficulty: '⭐⭐⭐',
    toneReward: {
      id: 'monarch_thunder',
      name: "Dragon Monarch's Thunder"
    }
  },
  {
    id: 'm4',
    title: 'Zen Recovery Matrix',
    type: 'recovery',
    category: 'Recovery',
    target: 5,
    current: 0,
    unit: 'minutes',
    xpReward: 120,
    coinReward: 25,
    crystalReward: 5,
    statBonus: 'flexibility',
    completed: false,
    description: 'Gentle somatic stretching session to flush lactic buildup.',
    difficulty: '🌱',
    toneReward: {
      id: 'celestial_harmonic',
      name: "Ruler's Authority Harmony"
    }
  }
];

export const INITIAL_FASHION = {
  hairStyle: 'Frost Flame Spikes',
  hairColor: '#7dd3fc',
  faceStyle: 'Shadow Ninja Mask',
  body: 'Cyan Flame Ripped Torso',
  lowerBody: 'Tactical Shadow Joggers',
  shoes: 'Pure White Sneakers'
};

export const INITIAL_POSTERS = [
  { id: 'poster_awakened_hero', name: 'Awakened Sovereign', title: 'Cyan Flame Monarch (A-Pose)', tag: 'AAA MYTHIC', bgGradient: 'from-cyan-950 via-black to-[#ffd700]/30', avatarEmoji: '⚡', image: '/assets/character_fullbody_hd.jpg', unlocked: true },
  { id: 'poster_throne', name: 'Shadow Throne', title: 'Ascension of the Monarch', tag: 'MYTHIC', bgGradient: 'from-purple-950 via-black to-[#ffd700]/30', avatarEmoji: '👑', unlocked: true },
  { id: 'poster_gate', name: 'Dimensional Red Gate', title: 'Frost Monarch Breach', tag: 'S-RANK', bgGradient: 'from-rose-950 via-black to-blue-900/40', avatarEmoji: '⚔️', unlocked: true },
  { id: 'poster_dragon', name: 'Dragon Sovereign', title: 'Kamish Rampage in Neo-Arcadia', tag: 'NATIONAL', bgGradient: 'from-amber-950 via-black to-orange-600/40', avatarEmoji: '🐉', unlocked: false },
  { id: 'poster_cyber', name: 'Cyber Neon Genesis', title: 'High-Tech Shadow Citadel', tag: 'ELITE', bgGradient: 'from-cyan-950 via-black to-fuchsia-900/40', avatarEmoji: '⚡', unlocked: false }
];

export const INITIAL_BADGES = [
  { id: 'badge_awakened', name: 'Awakened Hunter', icon: '⚡', title: 'System Connected', desc: 'Completed hunter awakening trial', rarity: 'Common', unlocked: true },
  { id: 'badge_kinetic', name: 'Kinetic Destroyer', icon: '💥', title: 'Core Overdrive Master', desc: 'Crushed Kinetic Core Burst workout trial', rarity: 'Rare', unlocked: true },
  { id: 'badge_monarch', name: 'Shadow Monarch', icon: '👑', title: 'Sovereign of Death', desc: 'Acquired supreme monarch presence', rarity: 'Mythic', unlocked: true },
  { id: 'badge_titan', name: 'Gait Titan', icon: '👣', title: '10,000 Step Legend', desc: 'Surpassed 10,000 physical steps in a cycle', rarity: 'Epic', unlocked: false },
  { id: 'badge_guild', name: 'Guild Pioneer', icon: '🛡️', title: 'Campus Apex Guild', desc: 'Ranked top 3 in the campus guild alliance', rarity: 'Legendary', unlocked: false }
];

export const INITIAL_ARTIFACTS = {
  head: {
    id: 'art_head',
    slot: 'Head',
    name: 'Monarch Shadow Crown',
    rarity: 'S-Rank',
    level: 1,
    maxLevel: 10,
    statType: 'Mana & Perception',
    statValue: 45,
    baseCostGold: 150,
    baseCostCrystals: 5,
    color: '#a855f7',
    icon: 'Crown',
    lore: 'Ancient circlet resonating with dark sovereign mana.'
  },
  body: {
    id: 'art_body',
    slot: 'Body',
    name: 'Demon Sovereign Chestplate',
    rarity: 'A-Rank',
    level: 1,
    maxLevel: 10,
    statType: 'Defense & Max HP',
    statValue: 80,
    baseCostGold: 200,
    baseCostCrystals: 8,
    color: '#3b82f6',
    icon: 'Shield',
    lore: 'Absorbs blunt force kinetic impacts and converts them to mana.'
  },
  lowerBody: {
    id: 'art_lower',
    slot: 'Lower-Body',
    name: 'Abyssal Greaves',
    rarity: 'S-Rank',
    level: 1,
    maxLevel: 10,
    statType: 'Agility & Kinetic Deflection',
    statValue: 65,
    baseCostGold: 180,
    baseCostCrystals: 6,
    color: '#ffd700',
    icon: 'ShieldAlert',
    lore: 'Reinforced with black soul ore for lightning acceleration.'
  },
  shoes: {
    id: 'art_shoes',
    slot: 'Shoes',
    name: 'Void-Walker Tabi Boots',
    rarity: 'A-Rank',
    level: 1,
    maxLevel: 10,
    statType: 'Movement Speed & Stamina',
    statValue: 55,
    baseCostGold: 160,
    baseCostCrystals: 5,
    color: '#10b981',
    icon: 'Zap',
    lore: 'Dampens recoil and allows silent stepping across dimensional rifts.'
  },
  rings: {
    id: 'art_ring',
    slot: 'Rings',
    name: "Ruler's Authority Ring",
    rarity: 'Monarch Tier',
    level: 1,
    maxLevel: 10,
    statType: 'Pure Mana Multiplier',
    statValue: 120,
    baseCostGold: 300,
    baseCostCrystals: 12,
    color: '#f43f5e',
    icon: 'Sparkles',
    lore: 'Channels invisible telekinetic grip, pulling reality towards the bearer.'
  }
};

const INITIAL_COLLEGE_TEAMS = [
  { id: 'shadow-legion', name: 'Shadow Legion (Guild #1)', xp: 82450, members: 48, rank: 1, color: '#ffd700' },
  { id: 'white-tiger', name: 'White Tiger Guild', xp: 76800, members: 45, rank: 2, color: '#ff9900' },
  { id: 'fiend-guild', name: 'Fiend Guild', xp: 71200, members: 42, rank: 3, color: '#f59e0b' },
  { id: 'titan-guild', name: 'Titan Guild', xp: 63100, members: 39, rank: 4, color: '#39ff14' }
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
  // Profile
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('ia_profile');
    return saved ? JSON.parse(saved) : FRESH_PROFILE;
  });

  // Level & XP
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

  // Blue Crystals Currency (used to upgrade artifacts)
  const [blueCrystals, setBlueCrystals] = useState(() => {
    const saved = localStorage.getItem('ia_blue_crystals');
    return saved !== null ? parseInt(saved, 10) : 45;
  });

  // Authoritative Modular Character Equipment State
  const [playerEquipment, setPlayerEquipment] = useState(() => {
    const saved = localStorage.getItem('ia_player_equipment');
    if (!saved) return INITIAL_EQUIPMENT;
    try {
      return { ...INITIAL_EQUIPMENT, ...JSON.parse(saved) };
    } catch {
      return INITIAL_EQUIPMENT;
    }
  });

  const [ownedItems, setOwnedItems] = useState(() => {
    const saved = localStorage.getItem('ia_owned_items');
    const defaults = ITEM_DATABASE.filter(i => i.isOwned).map(i => i.itemId);
    if (!saved) return defaults;
    try {
      const parsed = JSON.parse(saved);
      return Array.from(new Set([...defaults, ...parsed]));
    } catch {
      return defaults;
    }
  });

  // Calculate live stat bonuses from equipped items
  const equipmentStats = calculateStatBonuses(playerEquipment);

  // Equip an item from database
  const equipItem = (itemId) => {
    const item = getItemById(itemId);
    if (!item) return { success: false, reason: 'Item not found in catalog' };

    const owned = isItemOwned(item, ownedItems);
    if (!owned) {
      sound.playClick();
      return { success: false, reason: 'Item is locked. Complete unlock criteria first.' };
    }

    sound.playEquip();

    setPlayerEquipment(prev => {
      const next = { ...prev, [item.slot]: itemId };
      return next;
    });

    // Synchronize legacy fashion state for backwards compatibility
    setFashion(prev => {
      const next = { ...prev };
      if (item.slot === 'hair') next.hairStyle = item.name;
      if (item.slot === 'face') next.faceStyle = item.name;
      if (item.slot === 'top') next.body = item.name;
      if (item.slot === 'bottom') next.lowerBody = item.name;
      if (item.slot === 'shoes') next.shoes = item.name;
      return next;
    });

    if (item.rarity === 'MYTHIC' || item.rarity === 'LEGENDARY') {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    return { success: true, item };
  };

  // Unequip item slot (removes attachment or resets to default)
  const unequipItem = (slot) => {
    sound.playUnequip();
    setPlayerEquipment(prev => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  };

  // Unlock an item into player inventory
  const unlockItem = (itemId) => {
    setOwnedItems(prev => {
      if (prev.includes(itemId)) return prev;
      return [...prev, itemId];
    });
  };

  // Fashion Customization for 3D Character (Legacy Sync)
  const [fashion, setFashion] = useState(() => {
    const saved = localStorage.getItem('ia_fashion');
    return saved ? JSON.parse(saved) : INITIAL_FASHION;
  });

  // Posters for Profile Picture
  const [posters, setPosters] = useState(() => {
    const saved = localStorage.getItem('ia_posters');
    if (!saved) return INITIAL_POSTERS;
    try {
      const parsed = JSON.parse(saved);
      if (!parsed.some(p => p.id === 'poster_awakened_hero')) {
        return [INITIAL_POSTERS[0], ...parsed];
      }
      return parsed;
    } catch {
      return INITIAL_POSTERS;
    }
  });
  const [activePoster, setActivePoster] = useState(() => {
    const saved = localStorage.getItem('ia_active_poster');
    return (saved && saved !== 'poster_throne') ? saved : 'poster_awakened_hero';
  });

  // Badges ("baches")
  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('ia_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });
  const [activeBadge, setActiveBadge] = useState(() => {
    const saved = localStorage.getItem('ia_active_badge');
    return saved || 'badge_monarch';
  });

  // Artifact Gears Collection & Upgrades
  const [artifacts, setArtifacts] = useState(() => {
    const saved = localStorage.getItem('ia_artifacts');
    return saved ? JSON.parse(saved) : INITIAL_ARTIFACTS;
  });

  // Ranked Score & Display Rank Toggle
  const [rankScore, setRankScore] = useState(() => {
    const saved = localStorage.getItem('ia_rank_score');
    return saved !== null ? parseInt(saved, 10) : 3463;
  });
  const [displayRankInLobby, setDisplayRankInLobby] = useState(() => {
    const saved = localStorage.getItem('ia_display_rank_lobby');
    return saved !== null ? saved === 'true' : true;
  });

  // Audio & Settings State
  const [soundMuted, setSoundMuted] = useState(() => {
    const saved = localStorage.getItem('ia_sound_muted');
    return saved === 'true';
  });

  const [soundVolume, setSoundVolume] = useState(() => {
    const saved = localStorage.getItem('ia_sound_volume');
    return saved ? parseFloat(saved) : 0.75;
  });

  const [ambientActive, setAmbientActive] = useState(false);

  // Unlocked Tones Collection (only unlocked tones available for user selection)
  const [unlockedTones, setUnlockedTones] = useState(() => {
    const saved = localStorage.getItem('ia_unlocked_tones');
    return saved ? JSON.parse(saved) : ['monarch_crystal'];
  });

  // Active User System Tone
  const [activeSystemTone, setActiveSystemTone] = useState(() => {
    const saved = localStorage.getItem('ia_active_tone');
    return saved || 'monarch_crystal';
  });

  // System Notifications
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('ia_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Wireframe Level Up modal state
  const [showLevelUpAlert, setShowLevelUpAlert] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState("Your next level awaits. Are you ready to prove yourself?");

  // Calculate XP threshold for current level
  const getXpThreshold = (lvl) => lvl * 200 + (lvl - 1) * 100;
  const currentThreshold = getXpThreshold(level);

  // Compute Hunter Rank dynamically
  const hunterRank = getHunterRank(level);

  // Initialize audio settings on load
  useEffect(() => {
    sound.setCurrentTone(activeSystemTone);
    sound.setMuted(soundMuted);
    sound.setVolume(soundVolume);
  }, []);

  // Save changes to localStorage
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

  useEffect(() => {
    localStorage.setItem('ia_unlocked_tones', JSON.stringify(unlockedTones));
  }, [unlockedTones]);

  useEffect(() => {
    localStorage.setItem('ia_active_tone', activeSystemTone);
    sound.setCurrentTone(activeSystemTone);
  }, [activeSystemTone]);

  useEffect(() => {
    localStorage.setItem('ia_sound_muted', soundMuted.toString());
    sound.setMuted(soundMuted);
  }, [soundMuted]);

  useEffect(() => {
    localStorage.setItem('ia_sound_volume', soundVolume.toString());
    sound.setVolume(soundVolume);
  }, [soundVolume]);

  useEffect(() => {
    localStorage.setItem('ia_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ia_blue_crystals', blueCrystals.toString());
  }, [blueCrystals]);

  useEffect(() => {
    localStorage.setItem('ia_fashion', JSON.stringify(fashion));
  }, [fashion]);

  useEffect(() => {
    localStorage.setItem('ia_player_equipment', JSON.stringify(playerEquipment));
  }, [playerEquipment]);

  useEffect(() => {
    localStorage.setItem('ia_owned_items', JSON.stringify(ownedItems));
  }, [ownedItems]);

  useEffect(() => {
    localStorage.setItem('ia_posters', JSON.stringify(posters));
  }, [posters]);

  useEffect(() => {
    localStorage.setItem('ia_active_poster', activePoster);
  }, [activePoster]);

  useEffect(() => {
    localStorage.setItem('ia_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('ia_active_badge', activeBadge);
  }, [activeBadge]);

  useEffect(() => {
    localStorage.setItem('ia_artifacts', JSON.stringify(artifacts));
  }, [artifacts]);

  useEffect(() => {
    localStorage.setItem('ia_rank_score', rankScore.toString());
  }, [rankScore]);

  useEffect(() => {
    localStorage.setItem('ia_display_rank_lobby', displayRankInLobby.toString());
  }, [displayRankInLobby]);

  // Audio handlers
  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  const setVolumeLevel = (val) => {
    const num = Math.max(0, Math.min(1, parseFloat(val)));
    setSoundVolume(num);
    sound.setVolume(num);
  };

  const toggleAmbient = () => {
    const active = sound.toggleAmbientDrone();
    setAmbientActive(active);
  };

  // Change user's active system tone
  const changeActiveSystemTone = (toneId) => {
    if (!unlockedTones.includes(toneId)) {
      console.warn("Attempted to set locked system tone:", toneId);
      return;
    }
    setActiveSystemTone(toneId);
    sound.setCurrentTone(toneId);
    sound.playSystemTone(toneId);
  };

  // Notification helpers
  const addNotification = (notif) => {
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: true,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, unread: false } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (notifId) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const clearAllNotifications = () => {
    sound.playClick();
    setNotifications([]);
  };

  const sendTestNotification = () => {
    sound.playSoloLevelingMessageTone();
    const rankInfo = getHunterRank(level);
    addNotification({
      title: `[ TRANSMISSION: ${rankInfo.badge} BROADCAST ]`,
      message: `System status normal. Your current rank is ${rankInfo.rank}. Complete daily trials to advance your awakening!`,
      type: 'system'
    });
  };

  // Create Fresh Hunter Account
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
    setUnlockedTones(['monarch_crystal']);
    setActiveSystemTone('monarch_crystal');
    setNotifications(INITIAL_NOTIFICATIONS);

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
    localStorage.setItem('ia_unlocked_tones', JSON.stringify(['monarch_crystal']));
    localStorage.setItem('ia_active_tone', 'monarch_crystal');
    localStorage.setItem('ia_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
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
  const logoutPlayer = () => {
    sound.playClick();
    setProfile(prev => ({ ...prev, completedOnboarding: false }));
  };

  // Add XP and handle level up + rank check
  const addXP = (amount) => {
    const newXp = xp + amount;
    const threshold = getXpThreshold(level);

    if (newXp >= threshold) {
      const leftover = newXp - threshold;
      const nextLevel = level + 1;
      const oldRank = getHunterRank(level).rank;
      const newRank = getHunterRank(nextLevel).rank;

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

      let alertText = `Your level ${nextLevel} ascension is ready. Are you prepared to test your limits?`;
      if (oldRank !== newRank) {
        alertText = `RANK ASCENSION! You have achieved [${newRank}]! The world trembles before your strength.`;
        addNotification({
          title: `[ RANK ASCENSION: ${newRank.toUpperCase()} ]`,
          message: `Congratulations Hunter! Reaching Level ${nextLevel} has elevated your status to ${newRank}.`,
          type: 'level_up'
        });
      }

      setLevelUpMessage(alertText);
      setShowLevelUpAlert(true);
    } else {
      setXp(newXp);
    }
  };

  const addFitCoins = (amount) => {
    sound.playCoin();
    setFitCoins(prev => prev + amount);
  };

  const addBlueCrystals = (amount) => {
    sound.playSoloLevelingMessageTone();
    setBlueCrystals(prev => prev + amount);
    addNotification({
      title: '[ BLUE CRYSTALS HARVESTED ]',
      message: `System granted +${amount} Blue Crystals. Available for Artifact Upgrades in the Lobby!`,
      type: 'reward'
    });
  };

  const upgradeArtifact = (slotKey) => {
    const art = artifacts[slotKey];
    if (!art) return { success: false, message: 'Artifact not found.' };
    if (art.level >= art.maxLevel) return { success: false, message: 'Artifact already at max tier.' };

    const costGold = art.baseCostGold * art.level;
    const costCrystals = art.baseCostCrystals * art.level;

    if (fitCoins < costGold) {
      return { success: false, message: `Insufficient Gold. Needs ${costGold.toLocaleString()} Gold.` };
    }
    if (blueCrystals < costCrystals) {
      return { success: false, message: `Insufficient Blue Crystals. Needs ${costCrystals} Crystals. Claim from Quests (e.g. Kinetic Core Burst)!` };
    }

    setFitCoins(prev => prev - costGold);
    setBlueCrystals(prev => prev - costCrystals);
    sound.playLevelUp();

    setArtifacts(prev => {
      const current = prev[slotKey];
      const nextLvl = current.level + 1;
      const nextStat = Math.round(current.statValue * 1.35);
      return {
        ...prev,
        [slotKey]: {
          ...current,
          level: nextLvl,
          statValue: nextStat
        }
      };
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#ffd700', '#60a5fa']
    });

    addNotification({
      title: `[ ARTIFACT UPGRADED: ${art.name.toUpperCase()} ]`,
      message: `${art.name} enhanced to Level ${art.level + 1}! Attributes significantly increased.`,
      type: 'reward'
    });

    return { success: true, message: `${art.name} successfully upgraded to Lv. ${art.level + 1}!` };
  };

  // Complete a mission & handle Tone Rewards!
  const completeMission = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.completed) return;

    sound.playSoloLevelingMessageTone();
    addXP(mission.xpReward);
    addFitCoins(mission.coinReward);
    if (mission.crystalReward) {
      addBlueCrystals(mission.crystalReward);
    }

    if (mission.statBonus && attributes[mission.statBonus] !== undefined) {
      setAttributes(prev => ({
        ...prev,
        [mission.statBonus]: Math.min(100, prev[mission.statBonus] + 2)
      }));
    }

    // Check if this mission rewards a unique system tone
    if (mission.toneReward && !unlockedTones.includes(mission.toneReward.id)) {
      const newToneId = mission.toneReward.id;
      const newToneName = mission.toneReward.name;

      setUnlockedTones(prev => [...prev, newToneId]);

      // Broadcast system reward notification
      addNotification({
        title: `[ NEW SYSTEM TONE UNLOCKED: ${newToneName.toUpperCase()} ]`,
        message: `Outstanding performance! Conquering '${mission.title}' has unlocked the '${newToneName}' tone in your collection. You can equip it now in Settings.`,
        type: 'reward'
      });

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#38bdf8', '#ffd700', '#ffffff']
      });
    }

    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, completed: true, current: m.target } : m));
  };

  // Simulate or Log Real Activity
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

  // Upgrade Facility
  const upgradeBuilding = (buildingId) => {
    const building = buildings.find(b => b.id === buildingId);
    if (!building) return { success: false, message: 'Structure not found.' };

    if (fitCoins < building.cost) {
      return { success: false, message: 'Insufficient FitCoins. Complete quests to harvest coins.' };
    }

    if (level < building.minPlayerLevel) {
      return { success: false, message: `Access restricted: Requires Player Level ${building.minPlayerLevel}.` };
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

  // Purchase Equipment
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

  // Generate dynamic AI quest
  const generateAIMission = () => {
    sound.playSoloLevelingMessageTone();
    const hasHeartIssue = profile.healthIssues && profile.healthIssues.some(i => i.toLowerCase().includes('heart') || i.toLowerCase().includes('cardiac') || i.toLowerCase().includes('bp'));
    const hasAsthma = profile.healthIssues && profile.healthIssues.some(i => i.toLowerCase().includes('asthma'));
    const hasJointPain = profile.healthIssues && profile.healthIssues.some(i => i.toLowerCase().includes('joint') || i.toLowerCase().includes('back'));

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
        hunterRank,
        fitCoins,
        gold: fitCoins,
        blueCrystals,
        setBlueCrystals,
        addBlueCrystals,
        fashion,
        setFashion,
        playerEquipment,
        setPlayerEquipment,
        ownedItems,
        setOwnedItems,
        equipItem,
        unequipItem,
        unlockItem,
        equipmentStats,
        posters,
        setPosters,
        activePoster,
        setActivePoster,
        badges,
        setBadges,
        activeBadge,
        setActiveBadge,
        artifacts,
        setArtifacts,
        upgradeArtifact,
        rankScore,
        setRankScore,
        displayRankInLobby,
        setDisplayRankInLobby,
        streak,
        energy,
        attributes,
        buildings,
        missions,
        collegeTeams,
        inventory,
        soundMuted,
        toggleSound,
        soundVolume,
        setVolumeLevel,
        ambientActive,
        toggleAmbient,
        unlockedTones,
        activeSystemTone,
        changeActiveSystemTone,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        clearAllNotifications,
        sendTestNotification,
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
        logoutPlayer,
        logoutHunter: logoutPlayer
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
