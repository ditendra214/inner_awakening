// ============================================================================
// INNER AWAKENING - AUTHORITATIVE ITEM DATABASE
// ============================================================================

export const RARITIES = {
  MYTHIC: {
    id: 'MYTHIC',
    label: 'Mythic',
    color: '#ff0055',
    borderClass: 'border-rose-500',
    bgGradient: 'from-rose-950/80 via-[#18050e] to-black',
    glowClass: 'shadow-[0_0_18px_rgba(244,63,94,0.6)]',
    textClass: 'text-rose-400',
    order: 6
  },
  LEGENDARY: {
    id: 'LEGENDARY',
    label: 'Legendary',
    color: '#ffd700',
    borderClass: 'border-[#ffd700]',
    bgGradient: 'from-[#3a2800]/80 via-[#1a1200] to-black',
    glowClass: 'shadow-[0_0_18px_rgba(255,215,0,0.6)]',
    textClass: 'text-[#ffd700]',
    order: 5
  },
  EPIC: {
    id: 'EPIC',
    label: 'Epic',
    color: '#c084fc',
    borderClass: 'border-purple-500',
    bgGradient: 'from-purple-950/80 via-[#130722] to-black',
    glowClass: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]',
    textClass: 'text-purple-300',
    order: 4
  },
  RARE: {
    id: 'RARE',
    label: 'Rare',
    color: '#00f5ff',
    borderClass: 'border-cyan-400',
    bgGradient: 'from-cyan-950/80 via-[#041720] to-black',
    glowClass: 'shadow-[0_0_15px_rgba(6,182,212,0.5)]',
    textClass: 'text-cyan-300',
    order: 3
  },
  UNCOMMON: {
    id: 'UNCOMMON',
    label: 'Uncommon',
    color: '#34d399',
    borderClass: 'border-emerald-400',
    bgGradient: 'from-emerald-950/80 via-[#061810] to-black',
    glowClass: 'shadow-[0_0_12px_rgba(52,211,153,0.4)]',
    textClass: 'text-emerald-300',
    order: 2
  },
  COMMON: {
    id: 'COMMON',
    label: 'Common',
    color: '#94a3b8',
    borderClass: 'border-slate-500',
    bgGradient: 'from-slate-900/80 via-[#0d131f] to-black',
    glowClass: 'shadow-[0_0_8px_rgba(148,163,184,0.2)]',
    textClass: 'text-slate-300',
    order: 1
  }
};

export const ITEM_CATEGORIES = [
  { id: 'FASHION', label: 'FASHION', icon: '👕' },
  { id: 'EMOTE', label: 'EMOTE', icon: '⚡' },
  { id: 'COLLECTION', label: 'COLLECTION', icon: '🏆' },
  { id: 'PROFILE', label: 'PROFILE', icon: '👑' }
];

export const FASHION_SLOTS = [
  { id: 'all', label: 'ALL ITEMS', icon: '✨' },
  { id: 'top', label: 'TOPS', icon: '👕' },
  { id: 'bottom', label: 'BOTTOMS', icon: '👖' },
  { id: 'shoes', label: 'SHOES', icon: '👟' },
  { id: 'hair', label: 'HAIR', icon: '💇' },
  { id: 'face', label: 'FACE / MASK', icon: '🎭' },
  { id: 'accessories', label: 'ACCESSORIES', icon: '🧤' },
  { id: 'aura', label: 'SPECIAL AURA', icon: '🔮' }
];

// Master Catalog of Equipment & Customization Items
export const ITEM_DATABASE = [
  // ==========================================
  // TOPS (Shirts, Hoodies, Jerseys, Armor)
  // ==========================================
  {
    itemId: 'top_titan_pro',
    name: 'Pro Athletic Compression Shirt',
    category: 'FASHION',
    slot: 'top',
    rarity: 'LEGENDARY',
    description: 'High-performance moisture-wicking athletic compression shirt tailored for strength conditioning.',
    icon: '👕',
    stats: { strength: 16, stamina: 14, agility: 10 },
    visual: {
      color: '#1e293b',
      accentColor: '#38bdf8',
      emissive: '#000000',
      emissiveIntensity: 0.0,
      roughness: 0.5,
      metalness: 0.1,
      pattern: 'clean'
    },
    unlock: { type: 'DEFAULT', label: 'Unlocked by Default' },
    isOwned: true
  },
  {
    itemId: 'top_crimson_surge',
    name: 'Crimson Surge Training Tee',
    category: 'FASHION',
    slot: 'top',
    rarity: 'EPIC',
    description: 'High-breathability compression fabric engineered for maximum kinetic burst output.',
    icon: '👕',
    stats: { strength: 14, stamina: 12, agility: 8 },
    visual: {
      color: '#334155',
      accentColor: '#94a3b8',
      emissive: '#000000',
      emissiveIntensity: 0.0,
      roughness: 0.5,
      metalness: 0.1,
      pattern: 'stripes'
    },
    unlock: { type: 'DEFAULT', label: 'Unlocked by Default' },
    isOwned: true
  },
  {
    itemId: 'top_cyan_flame',
    name: 'Awakened Cyan Flame Compression',
    category: 'FASHION',
    slot: 'top',
    rarity: 'MYTHIC',
    description: 'Bioluminescent mana-conductive fabric woven with pure monarch core energy.',
    icon: '🔥',
    stats: { strength: 22, stamina: 18, mana: 25 },
    visual: {
      color: '#080d1a',
      accentColor: '#00f5ff',
      emissive: '#00f5ff',
      emissiveIntensity: 0.85,
      roughness: 0.3,
      metalness: 0.4,
      pattern: 'flame'
    },
    unlock: { type: 'RANK', value: 'S', label: 'Attain Hunter Rank S' },
    isOwned: true
  },
  {
    itemId: 'top_shadow_hoodie',
    name: 'Shadow Citadel Techwear Hoodie',
    category: 'FASHION',
    slot: 'top',
    rarity: 'EPIC',
    description: 'Stealth-coated combat hoodie with thermo-regulating microfiber.',
    icon: '🧥',
    stats: { strength: 10, agility: 15, stamina: 10 },
    visual: {
      color: '#111319',
      accentColor: '#9333ea',
      emissive: '#7e22ce',
      emissiveIntensity: 0.4,
      roughness: 0.7,
      metalness: 0.1,
      pattern: 'solid'
    },
    unlock: { type: 'LEVEL', value: 10, label: 'Reach Player Level 10' },
    isOwned: true
  },
  {
    itemId: 'top_gold_sovereign',
    name: 'Golden Sovereign Battle Plate',
    category: 'FASHION',
    slot: 'top',
    rarity: 'LEGENDARY',
    description: 'Ceremonial golden vanguard breastplate forged in dimensional rifts.',
    icon: '🛡️',
    stats: { strength: 25, stamina: 20, agility: -4 },
    visual: {
      color: '#ffd700',
      accentColor: '#f59e0b',
      emissive: '#b45309',
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.9,
      pattern: 'metallic'
    },
    unlock: { type: 'RANK', value: 'NATIONAL', label: 'Reach National Rank' },
    isOwned: false
  },
  {
    itemId: 'top_standard_tee',
    name: 'Vanguard Cadet Athletic Shirt',
    category: 'FASHION',
    slot: 'top',
    rarity: 'COMMON',
    description: 'Standard issue training t-shirt for newly awakened hunters.',
    icon: '🥋',
    stats: { strength: 4, stamina: 4 },
    visual: {
      color: '#293548',
      accentColor: '#64748b',
      emissive: '#000000',
      emissiveIntensity: 0,
      roughness: 0.8,
      metalness: 0.05,
      pattern: 'solid'
    },
    unlock: { type: 'DEFAULT', label: 'Starter Gear' },
    isOwned: true
  },

  // ==========================================
  // BOTTOMS (Shorts, Joggers, Tactical Pants)
  // ==========================================
  {
    itemId: 'bottom_denim_shorts',
    name: 'Coastline Athletic Denim Shorts',
    category: 'FASHION',
    slot: 'bottom',
    rarity: 'RARE',
    description: 'Distressed stretch-denim training shorts with reinforced stitching for leg mobility.',
    icon: '🩳',
    stats: { agility: 12, stamina: 10 },
    visual: {
      color: '#38bdf8',
      accentColor: '#e0f2fe',
      emissive: '#0284c7',
      emissiveIntensity: 0.1,
      roughness: 0.65,
      metalness: 0.05,
      pattern: 'denim'
    },
    unlock: { type: 'DEFAULT', label: 'Unlocked by Default' },
    isOwned: true
  },
  {
    itemId: 'bottom_shadow_joggers',
    name: 'Tactical Shadow Combat Joggers',
    category: 'FASHION',
    slot: 'bottom',
    rarity: 'EPIC',
    description: 'Tapered techwear joggers with magnetic utility straps and shock-dampening knee inserts.',
    icon: '👖',
    stats: { agility: 16, stamina: 14, strength: 8 },
    visual: {
      color: '#090a0f',
      accentColor: '#00f5ff',
      emissive: '#00f5ff',
      emissiveIntensity: 0.35,
      roughness: 0.75,
      metalness: 0.2,
      pattern: 'tech'
    },
    unlock: { type: 'LEVEL', value: 8, label: 'Reach Player Level 8' },
    isOwned: true
  },
  {
    itemId: 'bottom_sovereign_greaves',
    name: 'Monarch Titanium Greaves',
    category: 'FASHION',
    slot: 'bottom',
    rarity: 'MYTHIC',
    description: 'Weightless alloy leg armor channeling gravitational burst power.',
    icon: '🦿',
    stats: { strength: 20, stamina: 24, agility: 14 },
    visual: {
      color: '#1a1025',
      accentColor: '#ffd700',
      emissive: '#a855f7',
      emissiveIntensity: 0.6,
      roughness: 0.25,
      metalness: 0.85,
      pattern: 'metallic'
    },
    unlock: { type: 'RANK', value: 'MONARCH', label: 'Reach Monarch Tier' },
    isOwned: false
  },
  {
    itemId: 'bottom_cadet_pants',
    name: 'Cadet Workout Sweatpants',
    category: 'FASHION',
    slot: 'bottom',
    rarity: 'COMMON',
    description: 'Standard cotton fleece workout bottoms for calisthenics routines.',
    icon: '👖',
    stats: { stamina: 5 },
    visual: {
      color: '#334155',
      accentColor: '#475569',
      emissive: '#000000',
      emissiveIntensity: 0,
      roughness: 0.85,
      metalness: 0.05,
      pattern: 'solid'
    },
    unlock: { type: 'DEFAULT', label: 'Starter Gear' },
    isOwned: true
  },

  // ==========================================
  // SHOES (Runners, Trainers, Sneakers)
  // ==========================================
  {
    itemId: 'shoes_pure_white',
    name: 'Pure White Street Runners',
    category: 'FASHION',
    slot: 'shoes',
    rarity: 'RARE',
    description: 'Crisp vulcanized low-top sneakers with responsive rebound midsole cushioning.',
    icon: '👟',
    stats: { agility: 14, stamina: 8 },
    visual: {
      color: '#f8fafc',
      accentColor: '#cbd5e1',
      emissive: '#ffffff',
      emissiveIntensity: 0.15,
      roughness: 0.3,
      metalness: 0.1
    },
    unlock: { type: 'DEFAULT', label: 'Unlocked by Default' },
    isOwned: true
  },
  {
    itemId: 'shoes_grav_pulse',
    name: 'Grav-Pulse Sprint Boosters',
    category: 'FASHION',
    slot: 'shoes',
    rarity: 'EPIC',
    description: 'High-frequency gravimetric propulsion treads designed for explosive HIIT sprint cycles.',
    icon: '⚡',
    stats: { agility: 22, stamina: 12 },
    visual: {
      color: '#0f172a',
      accentColor: '#00f5ff',
      emissive: '#00f5ff',
      emissiveIntensity: 0.7,
      roughness: 0.35,
      metalness: 0.5
    },
    unlock: { type: 'WORKOUT', value: '10000_steps', label: 'Log 10,000 Physical Steps' },
    isOwned: true
  },
  {
    itemId: 'shoes_crimson_apex',
    name: 'Crimson Apex Combat High-Tops',
    category: 'FASHION',
    slot: 'shoes',
    rarity: 'LEGENDARY',
    description: 'Heavy shock-absorber boots with dragon-scale traction outsoles.',
    icon: '🥾',
    stats: { strength: 12, stamina: 18, agility: 10 },
    visual: {
      color: '#881337',
      accentColor: '#ffd700',
      emissive: '#f43f5e',
      emissiveIntensity: 0.5,
      roughness: 0.4,
      metalness: 0.6
    },
    unlock: { type: 'RANK', value: 'A', label: 'Attain Hunter Rank A' },
    isOwned: false
  },

  // ==========================================
  // HAIR (Styles & Colors)
  // ==========================================
  {
    itemId: 'hair_frost_flame',
    name: 'Frost Flame Spiky Fringe',
    category: 'FASHION',
    slot: 'hair',
    rarity: 'LEGENDARY',
    description: 'Volumetric anime spikes tipped with icy cyan mana highlights.',
    icon: '💇‍♂️',
    stats: { agility: 8, mana: 15 },
    visual: {
      attachment: 'hair_spiky',
      color: '#7dd3fc',
      emissive: '#0284c7',
      emissiveIntensity: 0.5
    },
    unlock: { type: 'DEFAULT', label: 'Unlocked by Default' },
    isOwned: true
  },
  {
    itemId: 'hair_shadow_slick',
    name: 'Sovereign Undercut Flow',
    category: 'FASHION',
    slot: 'hair',
    rarity: 'EPIC',
    description: 'Sleek swept-back dark hair with razor undercut fades.',
    icon: '💇',
    stats: { strength: 6, agility: 10 },
    visual: {
      attachment: 'hair_undercut',
      color: '#1e293b',
      emissive: '#475569',
      emissiveIntensity: 0.1
    },
    unlock: { type: 'LEVEL', value: 5, label: 'Reach Level 5' },
    isOwned: true
  },
  {
    itemId: 'hair_cyber_punk',
    name: 'Neon Cyber Mohawk',
    category: 'FASHION',
    slot: 'hair',
    rarity: 'MYTHIC',
    description: 'Electrified dual-color punk crest with fiber-optic hair strands.',
    icon: '🦹',
    stats: { agility: 15, mana: 20 },
    visual: {
      attachment: 'hair_mohawk',
      color: '#f43f5e',
      accentColor: '#38bdf8',
      emissive: '#f43f5e',
      emissiveIntensity: 0.8
    },
    unlock: { type: 'RANK', value: 'S', label: 'Attain Rank S' },
    isOwned: false
  },

  // ==========================================
  // FACE / MASKS
  // ==========================================
  {
    itemId: 'face_ninja_mask',
    name: 'Tactical Stealth Ninja Mask',
    category: 'FASHION',
    slot: 'face',
    rarity: 'RARE',
    description: 'Matte black particulate filtration mask covering nose and jaw.',
    icon: '😷',
    stats: { stamina: 8, agility: 6 },
    visual: {
      attachment: 'mask_ninja',
      color: '#0f172a',
      emissive: '#00f5ff',
      emissiveIntensity: 0.2
    },
    unlock: { type: 'DEFAULT', label: 'Unlocked by Default' },
    isOwned: true
  },
  {
    itemId: 'face_cyber_visor',
    name: 'Holographic HUD Combat Visor',
    category: 'FASHION',
    slot: 'face',
    rarity: 'LEGENDARY',
    description: 'Heads-up tactical eyepiece displaying live biomechanical telemetry and heart rate.',
    icon: '🥽',
    stats: { agility: 14, mana: 16 },
    visual: {
      attachment: 'visor_cyber',
      color: '#06b6d4',
      emissive: '#00f5ff',
      emissiveIntensity: 0.95
    },
    unlock: { type: 'RANK', value: 'A', label: 'Attain Rank A' },
    isOwned: true
  },

  // ==========================================
  // ACCESSORIES (Gloves, Wings, Gauntlets)
  // ==========================================
  {
    itemId: 'acc_combat_gauntlets',
    name: 'Silver Filigree Combat Gauntlets',
    category: 'FASHION',
    slot: 'accessories',
    rarity: 'EPIC',
    description: 'Engraved steel vambraces with layered tactical wrist wraps.',
    icon: '🧤',
    stats: { strength: 16, stamina: 8 },
    visual: {
      attachment: 'gauntlets_silver',
      color: '#94a3b8',
      emissive: '#00f5ff',
      emissiveIntensity: 0.3
    },
    unlock: { type: 'DEFAULT', label: 'Unlocked by Default' },
    isOwned: true
  },
  {
    itemId: 'acc_sovereign_cape',
    name: 'Monarch Shadow Cape',
    category: 'FASHION',
    slot: 'accessories',
    rarity: 'MYTHIC',
    description: 'Woven darkness rippling behind the hunter like phantom wings.',
    icon: '🦹‍♂️',
    stats: { strength: 20, mana: 30, stamina: 15 },
    visual: {
      attachment: 'cape_monarch',
      color: '#0f051d',
      emissive: '#9333ea',
      emissiveIntensity: 0.8
    },
    unlock: { type: 'RANK', value: 'MONARCH', label: 'Monarch Rank Exclusive' },
    isOwned: false
  },
  {
    itemId: 'acc_shadow_wings',
    name: 'Phantom Shadow Energy Wings',
    category: 'FASHION',
    slot: 'accessories',
    rarity: 'LEGENDARY',
    description: 'Bioluminescent photonic wings radiating crystalline mana plumes.',
    icon: '🪶',
    stats: { agility: 24, stamina: 10, mana: 15 },
    visual: {
      attachment: 'wings_shadow',
      color: '#38bdf8',
      emissive: '#00f5ff',
      emissiveIntensity: 0.95
    },
    unlock: { type: 'RANK', value: 'S', label: 'Unlock at S-Rank' },
    isOwned: true
  },
  {
    itemId: 'face_oni_halfmask',
    name: 'Cyber Oni Armored Half-Mask',
    category: 'FASHION',
    slot: 'face',
    rarity: 'EPIC',
    description: 'Reinforced ballistic half-mask adorned with menacing cybernetic fangs.',
    icon: '👺',
    stats: { strength: 12, stamina: 10 },
    visual: {
      attachment: 'mask_oni',
      color: '#e11d48',
      emissive: '#f43f5e',
      emissiveIntensity: 0.6
    },
    unlock: { type: 'LEVEL', value: 15, label: 'Reach Level 15' },
    isOwned: true
  },

  // ==========================================
  // SPECIAL AURAS (Particle Effects)
  // ==========================================
  {
    itemId: 'aura_matrix_code',
    name: 'Digital Matrix Mana Rain',
    category: 'FASHION',
    slot: 'aura',
    rarity: 'MYTHIC',
    description: 'Cascading holographic blue and cyan system glyphs radiating around the character.',
    icon: '✨',
    stats: { mana: 40, strength: 10 },
    visual: {
      attachment: 'aura_matrix',
      color: '#00f5ff',
      emissive: '#00f5ff',
      emissiveIntensity: 1.0
    },
    unlock: { type: 'RANK', value: 'S', label: 'Unlock at S-Rank or 500 Daily Quests' },
    isOwned: true
  },
  {
    itemId: 'aura_golden_sovereign',
    name: 'Golden Monarch Radiance Corona',
    category: 'FASHION',
    slot: 'aura',
    rarity: 'LEGENDARY',
    description: 'Blinding golden solar flares and crown particles orbiting your body.',
    icon: '👑',
    stats: { strength: 25, stamina: 15, mana: 25 },
    visual: {
      attachment: 'aura_gold',
      color: '#ffd700',
      emissive: '#ffbe3b',
      emissiveIntensity: 1.0
    },
    unlock: { type: 'RANK', value: 'MONARCH', label: 'Reach Monarch Tier' },
    isOwned: true
  },
  {
    itemId: 'aura_crimson_berserk',
    name: 'Crimson Berserker Flame Surge',
    category: 'FASHION',
    slot: 'aura',
    rarity: 'EPIC',
    description: 'Spiraling crimson and obsidian heat waves surging with kinetic intensity.',
    icon: '🔥',
    stats: { strength: 20, agility: 12 },
    visual: {
      attachment: 'aura_crimson',
      color: '#e11d48',
      emissive: '#ff0055',
      emissiveIntensity: 0.8
    },
    unlock: { type: 'WORKOUT', value: 'burst', label: 'Complete 5 HIIT Missions' },
    isOwned: true
  },

  // ==========================================
  // EMOTES
  // ==========================================
  {
    itemId: 'emote_muscle_flex',
    name: 'Apex Bodybuilder Flex',
    category: 'EMOTE',
    slot: 'emote',
    rarity: 'RARE',
    description: 'Strike a double bicep isometric flex showing off muscular definition.',
    icon: '💪',
    animClip: 'Idle',
    unlock: { type: 'DEFAULT', label: 'Default' },
    isOwned: true
  },
  {
    itemId: 'emote_samba_dance',
    name: 'Victory Samba Rhythm',
    category: 'EMOTE',
    slot: 'emote',
    rarity: 'EPIC',
    description: 'High-speed energetic celebratory dance step.',
    icon: '💃',
    animClip: 'SambaDance',
    unlock: { type: 'LEVEL', value: 12, label: 'Level 12' },
    isOwned: true
  },
  {
    itemId: 'emote_walk_patrol',
    name: 'Tactical Hunter Stride',
    category: 'EMOTE',
    slot: 'emote',
    rarity: 'UNCOMMON',
    description: 'Calculated, authoritative military march.',
    icon: '🚶‍♂️',
    animClip: 'Walk',
    unlock: { type: 'DEFAULT', label: 'Default' },
    isOwned: true
  },
  {
    itemId: 'emote_sprint_dash',
    name: 'Supersonic Sprint Protocol',
    category: 'EMOTE',
    slot: 'emote',
    rarity: 'RARE',
    description: 'Full-tilt athletic sprint bursting with forward kinetic energy.',
    icon: '🏃‍♂️',
    animClip: 'Run',
    unlock: { type: 'DEFAULT', label: 'Default' },
    isOwned: true
  },

  // ==========================================
  // COLLECTION (Badges & Titles)
  // ==========================================
  {
    itemId: 'badge_shadow_monarch',
    name: 'Shadow Monarch Supreme Insignia',
    category: 'COLLECTION',
    slot: 'badge',
    rarity: 'MYTHIC',
    description: 'Imperial emblem awarded exclusively to rulers of the shadow legion.',
    icon: '👑',
    stats: { mana: 50 },
    unlock: { type: 'RANK', value: 'MONARCH', label: 'Attain Monarch Tier' },
    isOwned: true
  },
  {
    itemId: 'badge_titan_stride',
    name: 'Titan 10K Step Vanguard Crest',
    category: 'COLLECTION',
    slot: 'badge',
    rarity: 'LEGENDARY',
    description: 'Commemorates crushing 10,000 real-world steps in a single cycle.',
    icon: '👣',
    stats: { stamina: 30 },
    unlock: { type: 'WORKOUT', value: '10k', label: 'Log 10,000 Steps' },
    isOwned: true
  },
  {
    itemId: 'badge_kinetic_overdrive',
    name: 'Kinetic Core Destroyer Medal',
    category: 'COLLECTION',
    slot: 'badge',
    rarity: 'EPIC',
    description: 'Awarded for conquering the brutal Kinetic Core Burst workout trial.',
    icon: '💥',
    stats: { strength: 25 },
    unlock: { type: 'MISSION', value: 'm2', label: 'Clear Mission m2' },
    isOwned: true
  },
  {
    itemId: 'title_awakened_sovereign',
    name: 'Title: [ The Awakened Sovereign ]',
    category: 'COLLECTION',
    slot: 'title',
    rarity: 'LEGENDARY',
    description: 'Displays a golden shimmering title above your hunter tag across lobbies.',
    icon: '🏷️',
    stats: { strength: 10, stamina: 10, mana: 10 },
    unlock: { type: 'RANK', value: 'S', label: 'Attain Rank S' },
    isOwned: true
  },
  {
    itemId: 'title_gate_crusher',
    name: 'Title: [ Gate Crusher ]',
    category: 'COLLECTION',
    slot: 'title',
    rarity: 'RARE',
    description: 'Displays an electric blue title marking rapid gate clear times.',
    icon: '⚔️',
    stats: { agility: 15 },
    unlock: { type: 'DEFAULT', label: 'Unlocked by Default' },
    isOwned: true
  },

  // ==========================================
  // PROFILE (Posters, Banners & Avatars)
  // ==========================================
  {
    itemId: 'prof_banner_monarch',
    name: 'Monarch Shadow Domain Banner',
    category: 'PROFILE',
    slot: 'banner',
    rarity: 'MYTHIC',
    description: 'Animated royal banner depicting the Monarch of Shadows throne.',
    icon: '🖼️',
    bgGradient: 'from-purple-950 via-black to-[#ffd700]/30',
    stats: {},
    unlock: { type: 'DEFAULT', label: 'Default' },
    isOwned: true
  },
  {
    itemId: 'prof_banner_cyber',
    name: 'Neo-Arcadia Cyber Matrix Banner',
    category: 'PROFILE',
    slot: 'banner',
    rarity: 'EPIC',
    description: 'High-tech neon skyscraper panorama of futuristic Neo-Arcadia.',
    icon: '🏙️',
    bgGradient: 'from-cyan-950 via-black to-fuchsia-900/40',
    stats: {},
    unlock: { type: 'LEVEL', value: 5, label: 'Reach Level 5' },
    isOwned: true
  },
  {
    itemId: 'prof_avatar_hunter',
    name: 'Awakened Sovereign Avatar Portrait',
    category: 'PROFILE',
    slot: 'avatar',
    rarity: 'LEGENDARY',
    description: 'High-res stylized portrait of the cyan flame sovereign.',
    icon: '👤',
    image: '/assets/character_fullbody_hd.jpg',
    stats: {},
    unlock: { type: 'DEFAULT', label: 'Default' },
    isOwned: true
  }
];

// Default Initial Equipment State
export const INITIAL_EQUIPMENT = {
  top: 'top_titan_pro',
  bottom: 'bottom_denim_shorts',
  shoes: 'shoes_pure_white',
  hair: null,
  face: null,
  accessories: 'acc_combat_gauntlets',
  aura: null
};

// ==========================================
// UTILITY HELPERS
// ==========================================
export const getItemById = (itemId) => {
  return ITEM_DATABASE.find(item => item.itemId === itemId) || null;
};

export const getItemsByCategoryAndSlot = (category = 'FASHION', slot = 'all') => {
  let items = ITEM_DATABASE.filter(item => item.category === category);
  if (slot && slot !== 'all') {
    items = items.filter(item => item.slot === slot);
  }
  return items;
};

export const calculateStatBonuses = (equippedMap) => {
  const totals = { strength: 0, stamina: 0, agility: 0, mana: 0 };
  if (!equippedMap) return totals;

  Object.values(equippedMap).forEach(itemId => {
    if (!itemId) return;
    const item = getItemById(itemId);
    if (item && item.stats) {
      if (item.stats.strength) totals.strength += item.stats.strength;
      if (item.stats.stamina) totals.stamina += item.stats.stamina;
      if (item.stats.agility) totals.agility += item.stats.agility;
      if (item.stats.mana) totals.mana += item.stats.mana;
    }
  });

  return totals;
};

export const isItemOwned = (item, ownedIds = []) => {
  if (!item) return false;
  if (item.isOwned) return true;
  return ownedIds.includes(item.itemId);
};
