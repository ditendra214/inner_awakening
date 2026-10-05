import React, { useState } from 'react';
import { 
  ArrowLeft, Dumbbell, Shield, Zap, Sparkles, Flame, 
  Check, Info, Search, Filter, Award, ChevronRight
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { navigationManager } from '../services/navigationManager';
import { sound } from '../services/soundEngine';

// Fitness Inventory Categories
const INVENTORY_CATEGORIES = [
  { id: 'EQUIPMENT', label: 'Fitness Equipment', icon: Dumbbell },
  { id: 'GEAR', label: 'Workout Gear', icon: Shield },
  { id: 'BOOSTERS', label: 'Boosters', icon: Zap },
  { id: 'REWARDS', label: 'Rewards', icon: Award },
  { id: 'CONSUMABLES', label: 'Consumables', icon: Flame },
  { id: 'COLLECTIBLES', label: 'Collectibles', icon: Sparkles }
];

// Initial Master Fitness Inventory Catalog
const INITIAL_FITNESS_INVENTORY = [
  // Fitness Equipment
  {
    id: 'eq_olympic_barbell',
    name: 'Cerakote Olympic Barbell',
    category: 'EQUIPMENT',
    quantity: 1,
    rarity: 'LEGENDARY',
    icon: '🏋️',
    description: 'Competition-grade 20kg tensile steel barbell with knurled dual grip markings for heavy deadlifts and clean power bursts.',
    statBonus: '+28 Strength, +15 Core Power',
    isEquipped: true
  },
  {
    id: 'eq_kettlebell_set',
    name: 'Cast Iron Kettlebell Pair (24kg)',
    category: 'EQUIPMENT',
    quantity: 2,
    rarity: 'EPIC',
    icon: '🔔',
    description: 'High-density cast iron bells designed for explosive hip hinges, Turkish get-ups, and unilateral strength conditioning.',
    statBonus: '+18 Stamina, +14 Grip Fortitude',
    isEquipped: false
  },
  {
    id: 'eq_speed_rope',
    name: 'High-Speed Bearing Jump Rope',
    category: 'EQUIPMENT',
    quantity: 1,
    rarity: 'RARE',
    icon: '⚡',
    description: 'Ultra-lightweight aircraft aluminum wire rope with dual ball bearings engineered for seamless double-unders.',
    statBonus: '+15 Agility, +12 Cardio Threshold',
    isEquipped: true
  },
  {
    id: 'eq_pullup_station',
    name: 'Tactical Calisthenics Rig',
    category: 'EQUIPMENT',
    quantity: 1,
    rarity: 'MYTHIC',
    icon: '🏗️',
    description: 'Reinforced carbon-steel pull-up and dip frame built for strict muscle-ups and weighted bodyweight progression.',
    statBonus: '+35 Upper Body Mass, +20 Grip Strength',
    isEquipped: false
  },

  // Workout Gear
  {
    id: 'gear_weightlifting_belt',
    name: '10mm Lever Buckle Power Belt',
    category: 'GEAR',
    quantity: 1,
    rarity: 'LEGENDARY',
    icon: '🥋',
    description: 'Premium top-grain leather support belt providing intra-abdominal stability for max-effort squatting and pulling.',
    statBonus: '+22 Lumbar Protection, +16 Core Bracing',
    isEquipped: true
  },
  {
    id: 'gear_knee_sleeves',
    name: '7mm Neoprene Knee Sleeves',
    category: 'GEAR',
    quantity: 2,
    rarity: 'EPIC',
    icon: '🦿',
    description: 'High-rebound compression sleeves maintaining joint temperature and kinetic knee extension velocity.',
    statBonus: '+16 Knee Stability, +12 Joint Recovery',
    isEquipped: true
  },
  {
    id: 'gear_wrist_wraps',
    name: 'Heavy Duty Elastic Wrist Wraps',
    category: 'GEAR',
    quantity: 2,
    rarity: 'RARE',
    icon: '🧤',
    description: 'Rigid thumb-loop elastic wraps locking wrist joints during overhead presses and bench presses.',
    statBonus: '+10 Wrist Stability, +8 Pressing Force',
    isEquipped: false
  },

  // Boosters
  {
    id: 'boost_xp_surge',
    name: 'Hyper-Focus Pre-Workout Elixir',
    category: 'BOOSTERS',
    quantity: 6,
    rarity: 'EPIC',
    icon: '🧪',
    description: 'Clinical-dose nootropic blend that grants +50% Fitness XP gained for the next 3 workout sessions.',
    statBonus: '+50% Workout XP for 3 Sessions',
    isEquipped: false
  },
  {
    id: 'boost_rp_amplifier',
    name: 'Rank Surge Catalyst',
    category: 'BOOSTERS',
    quantity: 3,
    rarity: 'LEGENDARY',
    icon: '🔥',
    description: 'Competitive catalyst that boosts Rank Points gained by +25% on your next 5 verified workouts.',
    statBonus: '+25% RP on next 5 Workouts',
    isEquipped: false
  },

  // Rewards
  {
    id: 'rew_monarch_trophy',
    name: 'Monarch Season 1 Crown Relic',
    category: 'REWARDS',
    quantity: 1,
    rarity: 'MYTHIC',
    icon: '🏆',
    description: 'Gilded sovereign chalice awarded to athletes who cross into Monarch rank during competitive Season 1.',
    statBonus: '+10% All Fitness Stat Multipliers',
    isEquipped: true
  },
  {
    id: 'rew_century_medal',
    name: '100-Day Streak Sovereign Medal',
    category: 'REWARDS',
    quantity: 1,
    rarity: 'LEGENDARY',
    icon: '🎖️',
    description: 'High-honor medallion commemorating triple-digit daily workout discipline without a single rest default.',
    statBonus: '+15 Daily Recovery Rate',
    isEquipped: false
  },

  // Consumables
  {
    id: 'con_bcaa_recovery',
    name: 'Electrolyte Intra-Workout Pack',
    category: 'CONSUMABLES',
    quantity: 14,
    rarity: 'UNCOMMON',
    icon: '💧',
    description: 'Hydration and amino acid formula instantly restoring muscular glycogen and reducing delayed soreness.',
    statBonus: 'Restores 40 Energy Points',
    isEquipped: false
  },
  {
    id: 'con_whey_isolate',
    name: 'Native Whey Protein Shard (30g)',
    category: 'CONSUMABLES',
    quantity: 22,
    rarity: 'RARE',
    icon: '🥛',
    description: 'Rapid-absorbing microfiltered protein building lean muscle fibers and repairing training micro-tears.',
    statBonus: '+2 Permanence Strength per consumption',
    isEquipped: false
  },

  // Collectibles
  {
    id: 'col_iron_badge',
    name: 'Genesis Calisthenics Crest',
    category: 'COLLECTIBLES',
    quantity: 1,
    rarity: 'LEGENDARY',
    icon: '💠',
    description: 'Commemorative genesis crystal signifying early pioneer entry into the Inner Awakening fitness universe.',
    statBonus: 'Unlocks Pioneer Lobby Banner',
    isEquipped: false
  }
];

export const InventoryPage = () => {
  const { sound } = useGame();
  const [selectedCategory, setSelectedCategory] = useState('EQUIPMENT');
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryItems, setInventoryItems] = useState(INITIAL_FITNESS_INVENTORY);
  const [selectedItem, setSelectedItem] = useState(INITIAL_FITNESS_INVENTORY[0]);

  // Filter items based on active category and search
  const filteredItems = inventoryItems.filter(item => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleEquip = (itemId) => {
    sound.playClick();
    setInventoryItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const nextState = !item.isEquipped;
        if (nextState) sound.playEquip();
        return { ...item, isEquipped: nextState };
      }
      return item;
    }));
    if (selectedItem?.id === itemId) {
      setSelectedItem(prev => ({ ...prev, isEquipped: !prev.isEquipped }));
    }
  };

  const getRarityBadge = (rarity) => {
    switch (rarity) {
      case 'MYTHIC':
        return 'text-rose-400 border-rose-500/60 bg-rose-950/40 shadow-[0_0_10px_rgba(244,63,94,0.4)]';
      case 'LEGENDARY':
        return 'text-amber-400 border-amber-400/60 bg-amber-950/40 shadow-[0_0_10px_rgba(251,191,36,0.4)]';
      case 'EPIC':
        return 'text-purple-400 border-purple-500/60 bg-purple-950/40 shadow-[0_0_10px_rgba(168,85,247,0.4)]';
      case 'RARE':
        return 'text-cyan-400 border-cyan-400/60 bg-cyan-950/40 shadow-[0_0_10px_rgba(6,182,212,0.4)]';
      default:
        return 'text-slate-400 border-slate-600 bg-slate-900/60';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050812] text-slate-100 select-none overflow-hidden animate-fade-in">
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-black font-black text-sm shadow-[0_0_12px_rgba(245,158,11,0.5)]">
              📦
            </div>
            <div>
              <h1 className="font-cyber font-black text-sm md:text-base tracking-wider text-white uppercase gold-glow-text">
                FITNESS INVENTORY
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">
                Authoritative Training Equipment & Consumables Catalog
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN INVENTORY INTERFACE */}
      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        {/* LEFT COLUMN: CATEGORIES TABS */}
        <div className="col-span-12 md:col-span-3 lg:col-span-2 border-r border-slate-800/80 bg-[#060914]/90 p-3 flex flex-row md:flex-col space-y-0 md:space-y-1.5 overflow-x-auto md:overflow-y-auto">
          {INVENTORY_CATEGORIES.map(cat => {
            const IconComp = cat.icon;
            const isActive = selectedCategory === cat.id;
            const count = inventoryItems.filter(i => i.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat.id);
                  const firstInCat = inventoryItems.find(i => i.category === cat.id);
                  if (firstInCat) setSelectedItem(firstInCat);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-cyber font-bold tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)] font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <IconComp className="w-4 h-4" />
                  <span>{cat.label}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-black/20 text-black font-black' : 'bg-slate-800 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* CENTER COLUMN: ITEM GRID */}
        <div className="col-span-12 md:col-span-5 lg:col-span-6 p-4 overflow-y-auto bg-[#070b18]/60">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredItems.map(item => {
              const isSelected = selectedItem?.id === item.id;
              const badgeStyle = getRarityBadge(item.rarity);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedItem(item);
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-[#151c2f] border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.3)] scale-[1.02]'
                      : 'bg-slate-900/40 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Equipped Indicator Badge */}
                  {item.isEquipped && (
                    <div className="absolute top-2 right-2 bg-emerald-500/20 border border-emerald-400/80 px-1.5 py-0.5 rounded text-[8px] font-cyber font-bold text-emerald-300 flex items-center space-x-0.5">
                      <Check className="w-2.5 h-2.5" />
                      <span>EQUIPPED</span>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-400 font-bold">
                    x{item.quantity}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 mx-auto my-3 flex items-center justify-center text-3xl filter drop-shadow-md group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>

                  {/* Details */}
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-100 truncate" title={item.name}>
                      {item.name}
                    </div>
                    <div className={`text-[9px] mt-1 px-1.5 py-0.5 rounded-full border inline-block uppercase font-mono font-bold ${badgeStyle}`}>
                      {item.rarity}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <Info className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs">No items found in this category.</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INSPECTOR & EQUIP ACTION PANEL */}
        <div className="col-span-12 md:col-span-4 lg:col-span-4 border-l border-slate-800/80 bg-[#060a16] p-5 flex flex-col justify-between overflow-y-auto">
          {selectedItem ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
                <div className="text-5xl my-4 filter drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                  {selectedItem.icon}
                </div>
                <h2 className="font-cyber font-black text-sm text-white uppercase tracking-wider">
                  {selectedItem.name}
                </h2>
                <span className={`text-[10px] mt-1 px-2.5 py-0.5 rounded-full border uppercase font-mono font-bold ${getRarityBadge(selectedItem.rarity)}`}>
                  {selectedItem.rarity} • {selectedItem.category}
                </span>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
                <div className="text-[10px] font-cyber text-slate-400 uppercase tracking-wider mb-1">
                  SPECIFICATIONS
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              {/* Fitness Stat Buff */}
              {selectedItem.statBonus && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-[10px] font-cyber text-amber-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>TRAINING ATTRIBUTES</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-200">
                    {selectedItem.statBonus}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => handleToggleEquip(selectedItem.id)}
                className={`w-full py-3 rounded-xl font-cyber text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                  selectedItem.isEquipped
                    ? 'bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/60'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-yellow-300'
                }`}
              >
                {selectedItem.isEquipped ? (
                  <>
                    <span>UNEQUIP GEAR</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>EQUIP TO ATHLETE</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <p className="text-xs">Select an item to view stats.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
