import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shirt, Sparkles, Trophy, Crown, Search, Filter, Check, X, 
  Lock, Unlock, Shield, Zap, Flame, Activity, User, Eye,
  ChevronRight, RefreshCw, ArrowUpRight, Award, Layers
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CharacterViewer3D } from '../CharacterViewer3D';
import { 
  ITEM_DATABASE, 
  RARITIES, 
  ITEM_CATEGORIES, 
  FASHION_SLOTS, 
  getItemById, 
  isItemOwned,
  calculateStatBonuses 
} from '../../data/itemDatabase';
import { sound } from '../../services/soundEngine';

export const InventoryUI = ({ onClose }) => {
  const { 
    playerEquipment, 
    equipItem, 
    unequipItem, 
    ownedItems, 
    equipmentStats,
    hunterRank,
    level
  } = useGame();

  // Selected Category ('FASHION', 'EMOTE', 'COLLECTION', 'PROFILE')
  const [activeCategory, setActiveCategory] = useState('FASHION');
  // Selected Subcategory / Slot ('all', 'top', 'bottom', 'shoes', 'hair', 'face', 'accessories', 'aura')
  const [activeSlot, setActiveSlot] = useState('all');

  // Search and Rarity Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState('ALL');

  // Live 3D Preview State: clone of playerEquipment that updates on item click
  const [previewEquipment, setPreviewEquipment] = useState({ ...(playerEquipment || {}) });
  // Currently inspected item in the detail drawer
  const [selectedItem, setSelectedItem] = useState(() => {
    // Default to currently equipped top
    return getItemById(playerEquipment?.top) || ITEM_DATABASE[0];
  });

  // Emote animation clip to preview in 3D viewer
  const [previewAnimation, setPreviewAnimation] = useState(null);

  // Sync preview equipment whenever playerEquipment changes externally
  useEffect(() => {
    if (playerEquipment) {
      setPreviewEquipment({ ...playerEquipment });
    }
  }, [playerEquipment]);

  // Check if preview equipment differs from committed playerEquipment
  const hasPreviewChanges = useMemo(() => {
    const slots = ['top', 'bottom', 'shoes', 'hair', 'face', 'accessories', 'aura'];
    const current = playerEquipment || {};
    return slots.some(slot => previewEquipment[slot] !== current[slot]);
  }, [previewEquipment, playerEquipment]);

  // Subcategory tabs for the current category
  const currentSubSlots = useMemo(() => {
    if (activeCategory === 'FASHION') return FASHION_SLOTS;
    if (activeCategory === 'EMOTE') return [{ id: 'all', label: 'ALL EMOTES', icon: '⚡' }];
    if (activeCategory === 'COLLECTION') {
      return [
        { id: 'all', label: 'ALL GEAR', icon: '✨' },
        { id: 'badge', label: 'FITNESS BADGES', icon: '🏆' },
        { id: 'title', label: 'HUNTER TITLES', icon: '🏷️' }
      ];
    }
    if (activeCategory === 'PROFILE') {
      return [
        { id: 'all', label: 'ALL PROFILE', icon: '✨' },
        { id: 'banner', label: 'BANNERS', icon: '🖼️' },
        { id: 'avatar', label: 'AVATARS', icon: '👤' }
      ];
    }
    return [{ id: 'all', label: 'ALL', icon: '✨' }];
  }, [activeCategory]);

  // Filter items based on Category, Slot, Rarity, and Search Query
  const filteredItems = useMemo(() => {
    return ITEM_DATABASE.filter(item => {
      // Category Match
      if (item.category !== activeCategory) return false;

      // Slot Match
      if (activeSlot !== 'all' && item.slot !== activeSlot) return false;

      // Rarity Filter
      if (rarityFilter !== 'ALL' && item.rarity !== rarityFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchSlot = item.slot.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchSlot) return false;
      }

      return true;
    });
  }, [activeCategory, activeSlot, rarityFilter, searchQuery]);

  // Handle Item Click (Preview on 3D character + select in detail card)
  const handleItemClick = (item) => {
    sound.playClick();
    setSelectedItem(item);

    if (item.category === 'FASHION' && item.slot) {
      setPreviewEquipment(prev => ({
        ...prev,
        [item.slot]: item.itemId
      }));
    } else if (item.category === 'EMOTE' && item.animClip) {
      setPreviewAnimation(item.animClip);
    }
  };

  // Commit Equip Action
  const handleCommitEquip = (itemToEquip) => {
    const target = itemToEquip || selectedItem;
    if (!target) return;

    const res = equipItem(target.itemId);
    if (res.success) {
      // Sync preview to match newly equipped
      setPreviewEquipment(prev => ({
        ...prev,
        [target.slot]: target.itemId
      }));
    }
  };

  // Unequip Slot Action
  const handleUnequip = (slot) => {
    if (!slot) return;
    unequipItem(slot);
    setPreviewEquipment(prev => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  };

  // Cancel Live Preview & Revert to Committed Equipment
  const handleCancelPreview = () => {
    sound.playClick();
    setPreviewEquipment({ ...(playerEquipment || {}) });
  };

  // Equip All Preview Changes
  const handleCommitAllPreview = () => {
    Object.entries(previewEquipment).forEach(([slot, itemId]) => {
      if (itemId) equipItem(itemId);
    });
  };

  // Current selected item equipped state
  const isSelectedEquipped = selectedItem && playerEquipment?.[selectedItem.slot] === selectedItem.itemId;
  const isSelectedPreviewing = selectedItem && previewEquipment[selectedItem.slot] === selectedItem.itemId && !isSelectedEquipped;
  const isSelectedOwned = selectedItem ? isItemOwned(selectedItem, ownedItems) : false;

  // Stat comparison for selected item vs currently equipped item in the same slot
  const statComparison = useMemo(() => {
    if (!selectedItem || !selectedItem.stats) return null;
    const currentEquippedId = playerEquipment?.[selectedItem.slot];
    const currentEquippedItem = currentEquippedId ? getItemById(currentEquippedId) : null;
    const currentStats = currentEquippedItem?.stats || {};

    const diffs = {};
    const allKeys = new Set([...Object.keys(selectedItem.stats), ...Object.keys(currentStats)]);

    allKeys.forEach(key => {
      const newVal = selectedItem.stats[key] || 0;
      const oldVal = currentStats[key] || 0;
      diffs[key] = {
        value: newVal,
        diff: newVal - oldVal
      };
    });

    return diffs;
  }, [selectedItem, playerEquipment]);

  return (
    <div className="w-full bg-[#080a10] border-2 border-[#ffbe3b]/60 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col system-window">
      {/* ==================================================================== */}
      {/* 1. VAULT TOP HEADER */}
      {/* ==================================================================== */}
      <div className="bg-gradient-to-r from-[#140e03] via-[#090b12] to-[#140e03] border-b border-[#ffbe3b]/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ffd700] to-[#f59e0b] text-black flex items-center justify-center font-bold shadow-neon-gold">
            <Layers size={18} />
          </div>
          <div>
            <h2 className="font-cyber text-sm md:text-base font-black tracking-wider text-white flex items-center space-x-2">
              <span>CHARACTER VAULT & CUSTOMIZATION</span>
              <span className="text-[10px] bg-[#ffd700]/20 border border-[#ffd700]/60 text-[#ffd700] px-2 py-0.5 rounded font-mono">
                FREE FIRE SPEC
              </span>
            </h2>
            <p className="text-[10px] font-mono text-amber-300/70">
              Modular 3D Equipment • Real-Time Bone Attachments • Stat Buff Synchronizer
            </p>
          </div>
        </div>

        {/* Aggregate Stats Pill Strip */}
        <div className="hidden lg:flex items-center space-x-3 bg-[#0d111d] border border-cyan-500/30 px-3 py-1.5 rounded-xl font-mono text-xs">
          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">GEAR BUFFS:</span>
          <span className="text-[#f59e0b] flex items-center space-x-1">
            <span>💪</span>
            <span>+{equipmentStats.strength} STR</span>
          </span>
          <span className="text-emerald-400 flex items-center space-x-1">
            <span>🏃</span>
            <span>+{equipmentStats.stamina} STA</span>
          </span>
          <span className="text-cyan-400 flex items-center space-x-1">
            <span>⚡</span>
            <span>+{equipmentStats.agility} AGI</span>
          </span>
          <span className="text-purple-400 flex items-center space-x-1">
            <span>🔮</span>
            <span>+{equipmentStats.mana} MP</span>
          </span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. MAIN 3-COLUMN LAYOUT (LEFT: TABS | CENTER: GRID | RIGHT: 3D VIEWER) */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[640px] items-stretch">
        
        {/* ------------------------------------------------------------------ */}
        {/* COLUMN 1: CATEGORIES & SLOTS (LEFT SIDEBAR) */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-2 bg-[#0a0d17] border-r border-[#ffbe3b]/20 p-2.5 flex flex-row lg:flex-col justify-start gap-1 overflow-x-auto lg:overflow-visible">
          {/* Main Categories Selector */}
          <div className="flex lg:flex-col gap-1 w-full pb-2 border-b border-white/10 mb-2">
            {ITEM_CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveCategory(cat.id);
                    setActiveSlot('all');
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl font-cyber text-xs uppercase tracking-wider flex items-center space-x-2 transition-all text-left whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ffd700] to-[#f59e0b] text-black font-black shadow-neon-gold'
                      : 'bg-[#121727] text-gray-300 hover:text-white hover:bg-cyan-950/40 border border-white/5'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Subcategory / Slot Selector Tabs */}
          <div className="flex lg:flex-col gap-1 w-full overflow-y-auto max-h-[380px] pr-1">
            <span className="hidden lg:block text-[9px] font-mono text-gray-400 uppercase tracking-wider px-2 py-1">
              SLOT CATEGORIES
            </span>
            {currentSubSlots.map(slot => {
              const isActive = activeSlot === slot.id;
              // Check if any item is currently equipped in this slot
              const equippedInSlot = playerEquipment?.[slot.id];
              return (
                <button
                  key={slot.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveSlot(slot.id);
                  }}
                  className={`w-full py-2 px-2.5 rounded-lg font-mono text-xs uppercase transition-all flex items-center justify-between whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-[#0e121f] text-gray-400 hover:text-gray-200 hover:bg-[#14192a] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs">{slot.icon}</span>
                    <span className="text-[11px] truncate">{slot.label}</span>
                  </div>
                  {equippedInSlot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_6px_#ffd700]"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* COLUMN 2: SCROLLABLE ITEM GRID & FILTERS (CENTER) */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-5 bg-[#06080e] p-3 md:p-4 flex flex-col border-r border-[#ffbe3b]/20">
          {/* Search Bar & Rarity Filter Dropdown */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog by name or stats..."
                className="w-full bg-[#0e1220] border border-cyan-500/30 rounded-xl pl-9 pr-7 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Rarity Selector */}
            <select
              value={rarityFilter}
              onChange={(e) => { sound.playClick(); setRarityFilter(e.target.value); }}
              className="bg-[#0e1220] border border-cyan-500/30 rounded-xl px-2.5 py-2 text-xs font-cyber text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="ALL">ALL TIERS</option>
              <option value="MYTHIC">MYTHIC</option>
              <option value="LEGENDARY">LEGENDARY</option>
              <option value="EPIC">EPIC</option>
              <option value="RARE">RARE</option>
              <option value="UNCOMMON">UNCOMMON</option>
              <option value="COMMON">COMMON</option>
            </select>
          </div>

          {/* Catalog Metrics Counter */}
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-2 px-1">
            <span>
              DISPLAYING <strong className="text-cyan-300">{filteredItems.length}</strong> ITEMS
            </span>
            <span>
              CATALOG SLOT: <strong className="text-[#ffd700] uppercase">{activeSlot}</strong>
            </span>
          </div>

          {/* Grid of Items */}
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[540px]">
            {filteredItems.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-gray-500 space-y-2">
                <Filter size={32} className="opacity-40 text-cyan-400" />
                <p className="font-cyber text-xs">No items match current filter</p>
                <button
                  onClick={() => { setSearchQuery(''); setRarityFilter('ALL'); setActiveSlot('all'); }}
                  className="text-[11px] text-cyan-400 hover:underline font-mono"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredItems.map(item => {
                const rarityConfig = RARITIES[item.rarity] || RARITIES.COMMON;
                const isEquipped = playerEquipment?.[item.slot] === item.itemId;
                const isPreviewing = previewEquipment?.[item.slot] === item.itemId && !isEquipped;
                const isSelected = selectedItem?.itemId === item.itemId;
                const owned = isItemOwned(item, ownedItems);

                return (
                  <div
                    key={item.itemId}
                    onClick={() => handleItemClick(item)}
                    className={`relative p-2.5 rounded-xl border-2 cursor-pointer transition-all duration-150 flex flex-col justify-between select-none ${
                      isSelected
                        ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,245,255,0.5)] scale-[1.02]'
                        : `${rarityConfig.borderClass} hover:border-white/80`
                    } bg-gradient-to-b ${rarityConfig.bgGradient}`}
                  >
                    {/* Top Tag Badges */}
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-[8px] font-cyber font-black uppercase px-1.5 py-0.2 rounded border border-current ${rarityConfig.textClass}`}>
                        {rarityConfig.label}
                      </span>

                      {/* Lock / Ownership Status */}
                      {!owned ? (
                        <span className="text-gray-400 p-0.5 rounded bg-black/60" title={item.unlock?.label || 'Locked'}>
                          <Lock size={10} className="text-amber-400" />
                        </span>
                      ) : isEquipped ? (
                        <span className="bg-[#ffd700] text-black font-cyber font-black text-[8px] px-1.5 py-0.2 rounded shadow-neon-gold flex items-center space-x-0.5">
                          <Check size={9} />
                          <span>EQUIPPED</span>
                        </span>
                      ) : isPreviewing ? (
                        <span className="bg-cyan-400 text-black font-cyber font-black text-[8px] px-1.5 py-0.2 rounded animate-pulse">
                          PREVIEW
                        </span>
                      ) : null}
                    </div>

                    {/* Visual Item Icon / Thumbnail */}
                    <div className="w-full h-16 rounded-lg bg-black/40 flex items-center justify-center text-3xl my-1 relative overflow-hidden group">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="transform transition-transform group-hover:scale-110 duration-200">
                          {item.icon}
                        </span>
                      )}

                      {/* Glowing ambient radial light matching rarity */}
                      <div 
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ backgroundColor: rarityConfig.color }}
                      />
                    </div>

                    {/* Item Name */}
                    <div className="mt-1">
                      <h4 className="font-cyber text-[11px] font-bold text-white truncate leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[9px] font-mono text-gray-400 uppercase">
                        {item.slot}
                      </p>
                    </div>

                    {/* Stat Badges Snippet */}
                    {item.stats && Object.keys(item.stats).length > 0 && (
                      <div className="mt-1.5 pt-1 border-t border-white/10 flex items-center space-x-1 text-[9px] font-mono text-cyan-300">
                        {item.stats.strength && <span>+{item.stats.strength} STR</span>}
                        {item.stats.stamina && <span>+{item.stats.stamina} STA</span>}
                        {item.stats.agility && <span>+{item.stats.agility} AGI</span>}
                        {item.stats.mana && <span>+{item.stats.mana} MP</span>}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* COLUMN 3: 3D CHARACTER VIEWPORT & ACTION DRAWER (RIGHT) */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-5 bg-[#05070d] flex flex-col justify-between relative overflow-hidden">
          
          {/* Live 3D Character Viewport with real-time equipment override */}
          <div className="relative w-full h-[380px] md:h-[420px] bg-gradient-to-b from-[#0b0e1b] via-[#05070d] to-[#0b0e1b]">
            <CharacterViewer3D 
              className="w-full h-full"
              equippedOverride={previewEquipment}
              previewAnimation={previewAnimation}
              showTopBar={true}
              showBottomBar={true}
            />

            {/* Live Preview Active Banner */}
            {hasPreviewChanges && (
              <div className="absolute top-12 left-3 z-30 flex items-center space-x-2 bg-cyan-950/90 border border-cyan-400 px-3 py-1 rounded-xl shadow-[0_0_15px_rgba(0,245,255,0.4)] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="font-cyber text-[10px] font-black text-cyan-200 uppercase tracking-wider">
                  LIVE PREVIEWING UNSAVED LOOK
                </span>
              </div>
            )}
          </div>

          {/* Bottom Item Inspection & Equip Drawer */}
          {selectedItem && (
            <div className="p-3.5 bg-[#0a0d18] border-t-2 border-[#ffbe3b]/40 flex flex-col justify-between space-y-3">
              {/* Item Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-cyber font-bold uppercase px-2 py-0.5 rounded border border-current ${RARITIES[selectedItem.rarity]?.textClass}`}>
                      {selectedItem.rarity}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">
                      SLOT: {selectedItem.slot}
                    </span>
                  </div>
                  <h3 className="font-cyber text-sm font-black text-white mt-1">
                    {selectedItem.name}
                  </h3>
                  <p className="text-[11px] font-sans text-gray-300 mt-0.5 line-clamp-2">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="text-3xl p-2 bg-[#121626] rounded-xl border border-white/10">
                  {selectedItem.icon}
                </div>
              </div>

              {/* Stat Comparison Card */}
              {statComparison && Object.keys(statComparison).length > 0 && (
                <div className="bg-[#0e1322] border border-cyan-500/20 rounded-xl p-2.5 grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(statComparison).map(([statName, data]) => {
                    const isPositive = data.diff > 0;
                    const isNegative = data.diff < 0;
                    return (
                      <div key={statName} className="flex items-center justify-between">
                        <span className="text-gray-400 uppercase text-[10px]">{statName}:</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-white font-bold">+{data.value}</span>
                          {data.diff !== 0 && (
                            <span className={`text-[10px] ${isPositive ? 'text-emerald-400 font-bold' : isNegative ? 'text-rose-400' : ''}`}>
                              ({isPositive ? `+${data.diff}` : data.diff})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Unlock Requirement Warning if Locked */}
              {!isSelectedOwned && selectedItem.unlock && (
                <div className="flex items-center space-x-2 p-2 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-200 text-xs font-mono">
                  <Lock size={14} className="text-amber-400 shrink-0" />
                  <span>Requirement: <strong>{selectedItem.unlock.label}</strong></span>
                </div>
              )}

              {/* Action Buttons: [EQUIP NOW] / [UNEQUIP] / [CANCEL PREVIEW] */}
              <div className="flex items-center space-x-2 pt-1">
                {isSelectedEquipped ? (
                  <button
                    onClick={() => handleUnequip(selectedItem.slot)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500 text-rose-200 font-cyber text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                  >
                    <X size={14} />
                    <span>UNEQUIP ITEM</span>
                  </button>
                ) : isSelectedOwned ? (
                  <button
                    onClick={() => handleCommitEquip(selectedItem)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#f59e0b] hover:from-[#ffe23b] hover:to-[#ffb703] text-black font-cyber font-black text-xs uppercase tracking-wider transition-all shadow-neon-gold flex items-center justify-center space-x-2"
                  >
                    <Check size={16} />
                    <span>EQUIP TO CHARACTER</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gray-900 border border-gray-700 text-gray-500 font-cyber text-xs uppercase tracking-wider cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Lock size={14} />
                    <span>LOCKED REQUIREMENT</span>
                  </button>
                )}

                {/* Cancel / Revert Preview Button */}
                {hasPreviewChanges && (
                  <button
                    onClick={handleCancelPreview}
                    className="py-2.5 px-3 rounded-xl bg-[#141824] hover:bg-[#20273a] border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center space-x-1.5 transition-colors"
                    title="Cancel live preview and restore current equipped setup"
                  >
                    <RefreshCw size={13} />
                    <span>RESET</span>
                  </button>
                )}

                {/* Save All Changes Button */}
                {hasPreviewChanges && isSelectedOwned && (
                  <button
                    onClick={handleCommitAllPreview}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-cyber text-xs uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all"
                    title="Commit all active preview items"
                  >
                    SAVE ALL
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
