import React, { useState } from 'react';
import { 
  Crown, Shield, Coins, Sparkles, Users, UserPlus, Bell, Settings, 
  MessageSquare, ShoppingBag, Gift, Award, Flame, Zap, ArrowRight,
  Check, CheckCircle2, ChevronRight, Info, Trophy, Play, X, ExternalLink, Shirt
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CharacterViewer3D } from '../components/CharacterViewer3D';
import { InventoryUI } from '../components/inventory/InventoryUI';
import { sound } from '../services/soundEngine';
import { getHunterRank } from '../utils/ranks';
import confetti from 'canvas-confetti';

export const HomeView = ({ setActiveTab }) => {
  const { 
    profile, 
    level, 
    hunterRank, 
    fitCoins, 
    blueCrystals, 
    fashion, 
    setFashion,
    posters,
    activePoster,
    setActivePoster,
    badges,
    activeBadge,
    setActiveBadge,
    artifacts,
    upgradeArtifact,
    rankScore,
    setRankScore,
    displayRankInLobby,
    setDisplayRankInLobby
  } = useGame();

  // Bottom 4 Action Modules: 'inventory' | 'artifacts' | 'upgrade' | 'rank'
  const [activeBottomTab, setActiveBottomTab] = useState('inventory');

  // Artifact selected for upgrade
  const [selectedArtifactSlot, setSelectedArtifactSlot] = useState('head');
  const [upgradeMessage, setUpgradeMessage] = useState(null);

  // Rank Ladder "View All" toggle (to reveal C, D, E ranks)
  const [showAllRanks, setShowAllRanks] = useState(false);

  // Modals for Left Menu & Header buttons
  const [activeModal, setActiveModal] = useState(null); // 'store' | 'luck' | 'pass' | 'events' | 'chat' | 'friends' | 'rules' | 'leaderboard'
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Yoo Jinho', text: 'Guild Master! Ready for the next Gate raid whenever you are!', time: '10m ago' },
    { sender: 'Cha Hae-in', text: 'Good pace on today’s morning run. Keep your stance balanced.', time: '25m ago' }
  ]);

  // Team Lobby slots state (4 slots)
  const [teamSlots, setTeamSlots] = useState([
    { id: 1, name: null, avatar: null },
    { id: 2, name: null, avatar: null },
    { id: 3, name: null, avatar: null },
    { id: 4, name: null, avatar: null }
  ]);

  const onlineFriends = [
    { id: 'f1', name: 'Yoo Jinho', rank: 'D-Rank', role: 'Tanker', status: 'Online' },
    { id: 'f2', name: 'Cha Hae-in', rank: 'S-Rank', role: 'Sword Master', status: 'Online' },
    { id: 'f3', name: 'Baek Yoonho', rank: 'S-Rank', role: 'White Tiger', status: 'In Dungeon' }
  ];

  const offlineFriends = [
    { id: 'f4', name: 'Choi Jong-In', rank: 'S-Rank', role: 'Flame Mage', status: 'Offline' },
    { id: 'f5', name: 'Woo Jin-Chul', rank: 'A-Rank', role: 'HAA Chairman', status: 'Offline' }
  ];

  // Fashion Options Catalogue
  const fashionOptions = {
    hair: [
      { id: 'Frost Flame Spikes', name: 'Frost Flame Spikes', color: '#7dd3fc', desc: 'Ice-cyan anime spiky fringe with frosted highlights.' },
      { id: 'Shadow Spikes', name: 'Shadow Spikes', color: '#3b82f6', desc: 'Edgy spiked locks with dark indigo mana.' },
      { id: 'Sovereign Flow', name: 'Sovereign Flow', color: '#ffd700', desc: 'Flowing golden blonde anime strands.' },
      { id: 'Cyber Undercut', name: 'Cyber Undercut', color: '#06b6d4', desc: 'Electric cyan undercut with neon taper.' },
      { id: 'Silver Ghost', name: 'Silver Ghost', color: '#e2e8f0', desc: 'Icy platinum swept-back sovereign locks.' }
    ],
    face: [
      { id: 'Shadow Ninja Mask', name: 'Shadow Ninja Mask', desc: 'Black tactical ninja cloth mask with piercing blue hunter eyes.' },
      { id: 'Determined Monarch', name: 'Determined Monarch', desc: 'Piercing violet eyes with regal stoicism.' },
      { id: 'Cold Assassin', name: 'Cold Assassin', desc: 'Crimson aura eyes trained in stealth eliminations.' },
      { id: 'Cyber Visor Eyes', name: 'Cyber Visor Eyes', desc: 'Golden holographic retinal HUD overlay.' }
    ],
    body: [
      { id: 'Cyan Flame Ripped Torso', name: 'Cyan Flame Ripped Torso', desc: 'Ripped 6-pack muscular torso surging with glowing cyan mana flame tattoos.' },
      { id: 'Shadow Trenchcoat', name: 'Shadow Trenchcoat', desc: 'Long flowing dark coat lined with monarch crests.' },
      { id: 'Golden Sovereign Armor', name: 'Golden Sovereign Armor', desc: 'Heavy gilded breastplate forged in divine light.' },
      { id: 'Shadow Leather Vest', name: 'Shadow Leather Vest', desc: 'Tactical light harness offering maximum agility.' }
    ],
    lowerBody: [
      { id: 'Tactical Shadow Joggers', name: 'Tactical Shadow Joggers', desc: 'Tapered black combat joggers with dangling side techwear straps.' },
      { id: 'Tactical Cargo Pants', name: 'Tactical Cargo Pants', desc: 'Reinforced combat slacks with utility pouches.' },
      { id: 'Royal Monarch Greaves', name: 'Royal Monarch Greaves', desc: 'Gold-accented armored leg guards.' }
    ],
    shoes: [
      { id: 'Pure White Sneakers', name: 'Pure White Sneakers', desc: 'Crisp clean white low-top street kicks with white laces.' },
      { id: 'Grav-Pulse Sneakers', name: 'Grav-Pulse Sneakers', desc: 'Cyan hover-soles dampening kinetic landing.' },
      { id: 'Shadow Monarch Boots', name: 'Shadow Monarch Boots', desc: 'High leather boots imbued with shadow resonance.' }
    ]
  };

  // Rank Ladder Configuration (strictly adhering to Sketch 2)
  const rankLadder = [
    { rank: 'Monarch', minScore: 5000, symbol: '👑', reward: 'Sovereign Shadow Crown & Wings', bonus: '+30% All Stats', color: '#c084fc' },
    { rank: 'National-Rank', minScore: 4000, symbol: '⚔️', reward: "Kamish's Dragon Wrath Dagger", bonus: '+25% All Stats', color: '#ffd700' },
    { rank: 'S-Rank', minScore: 3500, symbol: '🛡️', reward: 'High Orc Warlord Relic Plate', bonus: '+20% All Stats', color: '#f43f5e' },
    { rank: 'A-Rank', minScore: 2500, symbol: '⚡', reward: 'Shadow Sovereign Ring of Mana', bonus: '+15% All Stats', color: '#38bdf8' },
    { rank: 'B-Rank', minScore: 1800, symbol: '🦅', reward: 'Knight Commander Greatsword', bonus: '+10% All Stats', color: '#34d399' },
    // Expandable ranks via "View all >>"
    { rank: 'C-Rank', minScore: 1000, symbol: '💎', reward: 'Dungeon Explorer Cloak', bonus: '+7% All Stats', color: '#fbbf24', hidden: true },
    { rank: 'D-Rank', minScore: 500, symbol: '🗡️', reward: 'Iron Vanguard Gauntlets', bonus: '+5% All Stats', color: '#94a3b8', hidden: true },
    { rank: 'E-Rank', minScore: 0, symbol: '🌱', reward: 'Awakened Starter Compass', bonus: '+2% All Stats', color: '#a8a29e', hidden: true }
  ];

  // Compute current rank from score
  const currentRankObj = rankLadder.find(r => rankScore >= r.minScore) || rankLadder[rankLadder.length - 1];
  const nextRankIndex = rankLadder.findIndex(r => r.rank === currentRankObj.rank) - 1;
  const nextRankObj = nextRankIndex >= 0 ? rankLadder[nextRankIndex] : null;

  const handleEquipFashion = (category, value) => {
    sound.playClick();
    setFashion(prev => ({
      ...prev,
      [category === 'hair' ? 'hairStyle' :
       category === 'face' ? 'faceStyle' :
       category === 'body' ? 'body' :
       category === 'lowerBody' ? 'lowerBody' : 'shoes']: value
    }));
  };

  const handleUpgradeArtifact = (slotKey) => {
    const res = upgradeArtifact(slotKey);
    setUpgradeMessage(res);
    setTimeout(() => setUpgradeMessage(null), 4000);
  };

  const handleInviteFriend = (friend) => {
    sound.playClick();
    const emptyIndex = teamSlots.findIndex(s => s.name === null);
    if (emptyIndex !== -1) {
      const updated = [...teamSlots];
      updated[emptyIndex] = { id: updated[emptyIndex].id, name: friend.name, avatar: '👤' };
      setTeamSlots(updated);
      setActiveModal(null);
    }
  };

  const handleRemoveSlot = (slotId) => {
    sound.playClick();
    setTeamSlots(prev => prev.map(s => s.id === slotId ? { ...s, name: null, avatar: null } : s));
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sound.playClick();
    setChatMessages(prev => [...prev, { sender: profile.name, text: chatInput, time: 'Just now' }]);
    setChatInput('');
  };

  const handleLuckRoyaleSpin = () => {
    sound.playSoloLevelingMessageTone();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#ffd700', '#38bdf8', '#ff9900']
    });
    setActiveModal(null);
  };

  const currentPoster = posters.find(p => p.id === activePoster) || posters[0];
  const currentBadge = badges.find(b => b.id === activeBadge) || badges[0];

  return (
    <div className="space-y-4 pb-24 animate-fade-in relative z-10 select-none">
      {/* 1. TOP HEADER (As drawn in Sketch 1: Avatar/Poster + Player Name + Gold + Blue Crystals + Quick Actions) */}
      <div className="bg-[#0b0803]/90 border border-[#ffbe3b]/40 rounded-2xl px-4 py-3 shadow-neon-gold flex flex-wrap items-center justify-between gap-3 system-window backdrop-blur-md">
        {/* Left: Poster / Profile Picture & Player Name */}
        <div className="flex items-center space-x-3">
          <div 
            onClick={() => { sound.playClick(); setActiveBottomTab('inventory'); setInventorySubTab('poster'); }}
            className={`relative w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br ${currentPoster.bgGradient} border-2 border-[#ffd700] flex items-center justify-center cursor-pointer shadow-neon-gold group hover:scale-105 transition-transform`}
            title="Click to customize Profile Poster in Inventory"
          >
            {currentPoster.image ? (
              <img src={currentPoster.image} alt={currentPoster.name} className="w-full h-full object-cover object-top" />
            ) : (
              <span className="text-xl filter drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">
                {currentPoster.avatarEmoji || '👑'}
              </span>
            )}
            <span className="absolute -bottom-1 -right-1 text-[8px] bg-black border border-[#ffd700] px-1 rounded font-cyber text-[#ffd700] z-10">
              POSTER
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="font-cyber font-black text-sm md:text-base text-white tracking-wider uppercase gold-glow-text">
                {profile.name}
              </h2>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#201503] border border-[#ffd700]/50 text-[#ffd700] font-mono font-bold">
                LVL {level}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-amber-300/80">
              <span>{hunterRank.rank}</span>
              <span>•</span>
              <span className="flex items-center space-x-0.5 text-cyan-300">
                <span>{currentBadge.icon}</span>
                <span>{currentBadge.name}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Currencies (Gold & Blue Crystals) */}
        <div className="flex items-center space-x-3">
          {/* Gold (FitCoins) */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#170f03] border border-[#ffd700]/60 text-[#ffd700] shadow-[0_0_10px_rgba(255,215,0,0.2)]" title="Gold Mana Coins">
            <Coins size={15} className="text-[#ffd700] animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-amber-400/70 leading-none">GOLD</span>
              <span className="font-mono text-xs md:text-sm font-black leading-tight">{fitCoins.toLocaleString()}</span>
            </div>
          </div>

          {/* Blue Crystals */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#061421] border border-cyan-500/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]" title="Blue Crystals for Artifact Upgrades">
            <span className="text-base animate-pulse">💎</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-cyan-400/80 leading-none">CRYSTALS</span>
              <span className="font-mono text-xs md:text-sm font-black leading-tight text-cyan-200">{(blueCrystals || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right: Friends, Notification, Settings Shortcuts */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => { sound.playClick(); setActiveModal('friends'); }}
            className="p-2 rounded-lg bg-[#181105] hover:bg-[#281b08] text-[#ffd700] border border-[#ffbe3b]/40 transition-colors relative"
            title="Friends & Team Lobby"
          >
            <Users size={16} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
          </button>

          <button
            onClick={() => { sound.playSoloLevelingMessageTone(); setActiveTab('notifications'); }}
            className="p-2 rounded-lg bg-[#181105] hover:bg-[#281b08] text-[#ffd700] border border-[#ffbe3b]/40 transition-colors"
            title="System Notifications"
          >
            <Bell size={16} />
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('me'); }}
            className="p-2 rounded-lg bg-[#181105] hover:bg-[#281b08] text-[#ffd700] border border-[#ffbe3b]/40 transition-colors"
            title="Settings & System Status Window"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* 2. MAIN LOBBY ARENA (Left Menu, Center 3D Character Viewer, Right Team Slots) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* LEFT COLUMN: SIDE MENU (STORE, Luck Royale, Pass, EVENTS, Message to Friends) */}
        <div className="lg:col-span-2 flex flex-row lg:flex-col justify-between gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 order-2 lg:order-1">
          <div className="flex lg:flex-col gap-2 w-full">
            <button
              onClick={() => { 
                sound.playClick(); 
                setActiveBottomTab('inventory');
                document.getElementById('action-modules-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#201402] to-[#3a2606] hover:from-[#3a2606] hover:to-[#553808] border-2 border-[#ffd700] text-[#ffd700] font-cyber text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-neon-gold whitespace-nowrap"
            >
              <Shirt size={16} className="text-[#ffd700]" />
              <span className="font-black">VAULT</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setActiveModal('store'); }}
              className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#170e03] to-[#251806] hover:from-[#251806] hover:to-[#362309] border border-[#ffd700]/50 text-[#ffd700] font-cyber text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-[0_0_10px_rgba(255,215,0,0.15)] whitespace-nowrap"
            >
              <ShoppingBag size={16} className="text-[#ffd700]" />
              <span className="font-bold">STORE</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setActiveModal('luck'); }}
              className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#1b0826] to-[#2b0c3d] hover:from-[#2b0c3d] hover:to-[#3e1257] border border-purple-500/50 text-purple-200 font-cyber text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)] whitespace-nowrap"
            >
              <Sparkles size={16} className="text-purple-300" />
              <span className="font-bold">LUCK ROYALE</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setActiveModal('pass'); }}
              className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#1b1404] to-[#2e2105] hover:from-[#2e2105] hover:to-[#422f08] border border-[#ffbe3b]/50 text-amber-200 font-cyber text-xs uppercase tracking-wider flex items-center space-x-2 transition-all whitespace-nowrap"
            >
              <Crown size={16} className="text-[#ffd700]" />
              <span className="font-bold">PASS</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setActiveModal('events'); }}
              className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#041d1a] to-[#072f2a] hover:from-[#072f2a] hover:to-[#0a423b] border border-emerald-500/50 text-emerald-200 font-cyber text-xs uppercase tracking-wider flex items-center space-x-2 transition-all whitespace-nowrap"
            >
              <Flame size={16} className="text-emerald-300" />
              <span className="font-bold">EVENTS</span>
            </button>
          </div>

          {/* Message to Friends Quick Shortcut */}
          <button
            onClick={() => { sound.playClick(); setActiveModal('chat'); }}
            className="py-2.5 px-3 rounded-xl bg-[#140e04] hover:bg-[#201606] border border-[#ffbe3b]/40 text-amber-200 text-xs font-mono flex items-center justify-center space-x-2 transition-colors whitespace-nowrap mt-auto"
          >
            <MessageSquare size={14} className="text-[#ffd700]" />
            <span>MESSAGE TO FRIENDS</span>
          </button>
        </div>

        {/* CENTER COLUMN: 3D CHARACTER VIEWER / MODEL VIEWER */}
        <div className="lg:col-span-7 bg-gradient-to-b from-[#110d05] via-[#080501] to-[#120e06] border-2 border-[#ffbe3b] rounded-2xl shadow-neon-gold relative flex flex-col items-center justify-between p-3 min-h-[420px] md:min-h-[480px] system-window overflow-hidden order-1 lg:order-2">
          {/* Subtle glowing halo aura in background */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#ffd700]/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Lobby Rank Emblem HUD (if displayRankInLobby is active) */}
          {displayRankInLobby && (
            <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5 px-2.5 py-1 bg-[#1a1104]/85 border border-[#ffd700] rounded-xl shadow-[0_0_10px_rgba(255,215,0,0.3)] backdrop-blur-md">
              <span className="text-sm">{currentRankObj.symbol}</span>
              <span className="font-cyber text-[10px] font-bold text-[#ffd700] uppercase tracking-wider">
                {currentRankObj.rank} • {rankScore} PTS
              </span>
            </div>
          )}

          {/* 3D Character Model Viewer Canvas */}
          <CharacterViewer3D className="flex-1 w-full" />
        </div>

        {/* RIGHT COLUMN: TEAM / PARTY LOBBY SLOTS (+ + + + Friends List) */}
        <div className="lg:col-span-3 bg-[#0d0903]/90 border border-[#ffbe3b]/40 rounded-2xl p-4 shadow-neon-gold flex flex-col justify-between system-window order-3">
          <div>
            <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-2 mb-3">
              <span className="font-cyber text-xs font-bold text-[#ffd700] tracking-wider uppercase">
                PARTY RAID TEAM
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span>LOBBY READY</span>
              </span>
            </div>

            {/* 4 Team Slots with [+] Buttons */}
            <div className="space-y-2">
              {teamSlots.map((slot, index) => (
                <div 
                  key={slot.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    slot.name
                      ? 'bg-[#1c1305] border-[#ffd700]/60 text-white'
                      : 'bg-[#100b03] border-dashed border-[#ffbe3b]/30 text-amber-400/60 hover:border-[#ffd700]/60 hover:text-amber-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-cyber text-xs font-bold ${
                      slot.name ? 'bg-[#ffbe3b]/20 text-[#ffd700] border border-[#ffd700]' : 'bg-[#181105] text-amber-500/50'
                    }`}>
                      {slot.name ? slot.avatar : index + 1}
                    </div>
                    <div>
                      <div className="font-cyber text-xs font-bold truncate max-w-[95px]">
                        {slot.name || `Slot ${index + 1}`}
                      </div>
                      <div className="text-[9px] font-mono text-amber-400/60">
                        {slot.name ? 'Ready' : 'Empty / Offline'}
                      </div>
                    </div>
                  </div>

                  {slot.name ? (
                    <button
                      onClick={() => handleRemoveSlot(slot.id)}
                      className="p-1 rounded text-rose-400 hover:bg-rose-950/40 transition-colors"
                      title="Dismiss Member"
                    >
                      <X size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => { sound.playClick(); setActiveModal('friends'); }}
                      className="p-1.5 rounded-lg bg-[#241704] hover:bg-[#382407] text-[#ffd700] border border-[#ffbe3b]/40 font-mono text-xs flex items-center space-x-1 transition-all"
                      title="Invite Friend"
                    >
                      <UserPlus size={12} />
                      <span>+ INVITE</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Friends Online Preview Strip */}
          <div className="mt-4 pt-3 border-t border-[#ffbe3b]/20 text-xs font-mono">
            <div className="flex justify-between items-center text-[10px] text-amber-400/80 mb-2">
              <span>ONLINE ALLIES (3)</span>
              <button 
                onClick={() => { sound.playClick(); setActiveModal('friends'); }}
                className="text-[#ffd700] hover:underline"
              >
                VIEW ALL
              </button>
            </div>
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
              {onlineFriends.slice(0, 3).map(f => (
                <div key={f.id} className="px-2 py-1 bg-[#160f04] border border-[#ffbe3b]/30 rounded text-[10px] whitespace-nowrap text-amber-200">
                  {f.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM 4 ACTION MODULES (From Sketch 1: Inventory, Artifact Gear, Upgrade Artifacts, Rank) */}
      <div id="action-modules-section" className="bg-[#0c0803] border-2 border-[#ffbe3b] rounded-2xl shadow-neon-gold overflow-hidden system-window">
        {/* Module Sub-Header Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#ffbe3b]/30 bg-[#070502]">
          <button
            onClick={() => { sound.playClick(); setActiveBottomTab('inventory'); }}
            className={`py-3 px-4 font-cyber text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
              activeBottomTab === 'inventory'
                ? 'bg-gradient-to-r from-[#e69500] to-[#ffd700] text-black font-black shadow-neon-gold'
                : 'text-amber-300/70 hover:text-white hover:bg-[#160f04]'
            }`}
          >
            <span>1. INVENTORY</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveBottomTab('artifacts'); }}
            className={`py-3 px-4 font-cyber text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 border-l border-[#ffbe3b]/20 ${
              activeBottomTab === 'artifacts'
                ? 'bg-gradient-to-r from-[#e69500] to-[#ffd700] text-black font-black shadow-neon-gold'
                : 'text-amber-300/70 hover:text-white hover:bg-[#160f04]'
            }`}
          >
            <span>2. ARTIFACT GEAR</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveBottomTab('upgrade'); }}
            className={`py-3 px-4 font-cyber text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 border-l border-[#ffbe3b]/20 ${
              activeBottomTab === 'upgrade'
                ? 'bg-gradient-to-r from-[#e69500] to-[#ffd700] text-black font-black shadow-neon-gold'
                : 'text-amber-300/70 hover:text-white hover:bg-[#160f04]'
            }`}
          >
            <span>3. UPGRADE ARTIFACTS</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveBottomTab('rank'); }}
            className={`py-3 px-4 font-cyber text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 border-l border-[#ffbe3b]/20 ${
              activeBottomTab === 'rank'
                ? 'bg-gradient-to-r from-[#e69500] to-[#ffd700] text-black font-black shadow-neon-gold'
                : 'text-amber-300/70 hover:text-white hover:bg-[#160f04]'
            }`}
          >
            <span>4. RANK ARENA</span>
          </button>
        </div>

        {/* Content Body for the Active Module */}
        <div className="p-4 md:p-6 min-h-[300px]">
          {/* ======================================================== */}
          {/* MODULE 1: INVENTORY & CHARACTER CUSTOMIZATION (FREE FIRE SPEC) */}
          {/* ======================================================== */}
          {activeBottomTab === 'inventory' && (
            <div className="space-y-4">
              <InventoryUI />
            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 2: ARTIFACT GEAR COLLECTION */}
          {/* ======================================================== */}
          {activeBottomTab === 'artifacts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#ffbe3b]/20 pb-3">
                <div>
                  <h3 className="font-cyber text-sm font-bold text-white uppercase tracking-wider">
                    EQUIPPED ARTIFACT COLLECTION (5 SLOTS)
                  </h3>
                  <p className="text-xs text-amber-200/80 font-mono">
                    Ancient Hunter Relics empowering Head, Body, Lower-Body, Shoes, and Rings.
                  </p>
                </div>
                <button
                  onClick={() => { sound.playClick(); setActiveBottomTab('upgrade'); }}
                  className="px-3.5 py-1.5 bg-[#ffd700] text-black font-cyber font-bold text-xs uppercase rounded-lg shadow-neon-gold flex items-center space-x-1"
                >
                  <span>GO TO UPGRADE FORGE</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(artifacts).map(([key, art]) => (
                  <div
                    key={key}
                    onClick={() => { sound.playClick(); setSelectedArtifactSlot(key); setActiveBottomTab('upgrade'); }}
                    className="p-3.5 rounded-xl bg-[#120d04] border border-[#ffbe3b]/40 hover:border-[#ffd700] cursor-pointer transition-all flex flex-col justify-between group hover:scale-[1.02]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#251704] border border-[#ffd700]/40 text-[#ffd700] uppercase font-bold">
                          {art.slot}
                        </span>
                        <span className="text-[10px] font-cyber text-purple-300 font-bold">
                          {art.rarity}
                        </span>
                      </div>

                      <div className="my-2 flex items-center justify-center h-16 bg-[#1a1104] rounded-lg border border-[#ffbe3b]/20">
                        <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
                          {key === 'head' ? '👑' :
                           key === 'body' ? '🛡️' :
                           key === 'lowerBody' ? '🥋' :
                           key === 'shoes' ? '👟' : '💍'}
                        </span>
                      </div>

                      <h4 className="font-cyber text-xs font-bold text-white truncate">{art.name}</h4>
                      <p className="text-[10px] font-mono text-[#39ff14] mt-1 font-bold">
                        +{art.statValue} {art.statType}
                      </p>
                      <p className="text-[10px] text-amber-100/60 font-sans line-clamp-2 mt-1">
                        {art.lore}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#ffbe3b]/20 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-amber-300 font-bold">TIER LVL {art.level} / {art.maxLevel}</span>
                      <span className="text-[#ffd700] group-hover:underline">ENHANCE &gt;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 3: UPGRADE ARTIFACTS (Using Blue Crystals & Gold) */}
          {/* ======================================================== */}
          {activeBottomTab === 'upgrade' && (
            <div className="space-y-5">
              {/* Forge Currency Resource Status Bar */}
              <div className="bg-[#120d04] border border-[#ffbe3b]/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-[#251704] border border-[#ffd700] flex items-center justify-center text-xl">
                    ⚒️
                  </div>
                  <div>
                    <h3 className="font-cyber text-sm font-bold text-white uppercase gold-glow-text">
                      ANCIENT SOVEREIGN ARTIFACT FORGE
                    </h3>
                    <p className="text-xs text-amber-200/80 font-mono">
                      Spend <strong>Gold</strong> and <strong>Blue Crystals</strong> to elevate artifact stat tiers.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-amber-400/80 block">YOUR GOLD</span>
                    <span className="font-cyber text-sm font-bold text-[#ffd700]">{fitCoins.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-cyan-400/80 block">YOUR BLUE CRYSTALS</span>
                    <span className="font-cyber text-sm font-bold text-cyan-300">💎 {(blueCrystals || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Blue Crystal Mission Acquisition Hint */}
              <div className="p-2.5 rounded-lg bg-[#07131e] border border-cyan-500/50 text-cyan-200 font-mono text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>💎</span>
                  <span><strong>Tip:</strong> Blue Crystals are harvested by clearing high-intensity Quests (e.g., Kinetic Core Burst protocol).</span>
                </div>
                <button
                  onClick={() => setActiveTab('play')}
                  className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-black font-cyber font-bold text-[10px] uppercase rounded"
                >
                  GO TO QUESTS
                </button>
              </div>

              {upgradeMessage && (
                <div className={`p-3 rounded-lg text-xs font-mono flex items-center space-x-2 ${
                  upgradeMessage.success
                    ? 'bg-[#132b07] border border-[#39ff14] text-[#39ff14]'
                    : 'bg-[#2b0808] border border-rose-500 text-rose-300'
                }`}>
                  <CheckCircle2 size={16} />
                  <span>{upgradeMessage.message}</span>
                </div>
              )}

              {/* Slot Selector Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.entries(artifacts).map(([key, art]) => (
                  <button
                    key={key}
                    onClick={() => { sound.playClick(); setSelectedArtifactSlot(key); }}
                    className={`py-2 px-3 rounded-lg font-cyber text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
                      selectedArtifactSlot === key
                        ? 'bg-[#ffd700] text-black font-bold shadow-neon-gold'
                        : 'bg-[#140e04] text-amber-300/70 hover:text-white border border-[#ffbe3b]/30'
                    }`}
                  >
                    <span>{art.slot}</span>
                    <span className="text-[10px] font-mono">Lv.{art.level}</span>
                  </button>
                ))}
              </div>

              {/* Selected Artifact Upgrade Inspection Card */}
              {artifacts[selectedArtifactSlot] && (() => {
                const cur = artifacts[selectedArtifactSlot];
                const costGold = cur.baseCostGold * cur.level;
                const costCrystals = cur.baseCostCrystals * cur.level;
                const nextStat = Math.round(cur.statValue * 1.35);
                const canAfford = fitCoins >= costGold && blueCrystals >= costCrystals;

                return (
                  <div className="p-5 rounded-xl bg-[#140e04] border-2 border-[#ffd700] shadow-neon-gold system-window">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-xl bg-[#271a06] border-2 border-[#ffd700] flex items-center justify-center text-4xl shadow-inner shrink-0">
                          {selectedArtifactSlot === 'head' ? '👑' :
                           selectedArtifactSlot === 'body' ? '🛡️' :
                           selectedArtifactSlot === 'lowerBody' ? '🥋' :
                           selectedArtifactSlot === 'shoes' ? '👟' : '💍'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono text-[#ffd700] uppercase font-bold px-2 py-0.2 rounded bg-[#201503] border border-[#ffbe3b]/40">
                              {cur.slot} ARTIFACT
                            </span>
                            <span className="text-xs font-cyber text-purple-300 font-bold">
                              {cur.rarity}
                            </span>
                          </div>
                          <h4 className="font-cyber text-lg font-bold text-white mt-1 gold-glow-text">
                            {cur.name}
                          </h4>
                          <p className="text-xs text-amber-100/75 mt-0.5">{cur.lore}</p>
                        </div>
                      </div>

                      {/* Stat Progression comparison */}
                      <div className="flex items-center space-x-4 bg-[#0a0702] p-3 rounded-lg border border-[#ffbe3b]/30">
                        <div className="text-center">
                          <span className="text-[10px] font-mono text-amber-400/60 uppercase block">Current Tier</span>
                          <span className="font-cyber text-base font-bold text-white">LVL {cur.level}</span>
                          <span className="text-xs font-mono text-[#39ff14] block">+{cur.statValue} {cur.statType}</span>
                        </div>
                        <ArrowRight size={18} className="text-[#ffd700]" />
                        <div className="text-center">
                          <span className="text-[10px] font-mono text-[#ffd700] uppercase block">Next Tier</span>
                          <span className="font-cyber text-base font-bold text-[#ffd700]">LVL {cur.level + 1}</span>
                          <span className="text-xs font-mono text-[#39ff14] block">+{nextStat} {cur.statType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cost and Upgrade CTA */}
                    <div className="mt-5 pt-4 border-t border-[#ffbe3b]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1.5 text-xs font-mono">
                          <span className="text-amber-400/80">Required Gold:</span>
                          <span className={`font-bold ${fitCoins >= costGold ? 'text-[#ffd700]' : 'text-rose-400'}`}>
                            🪙 {costGold.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-xs font-mono">
                          <span className="text-cyan-400/80">Required Crystals:</span>
                          <span className={`font-bold ${blueCrystals >= costCrystals ? 'text-cyan-300' : 'text-rose-400'}`}>
                            💎 {costCrystals}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUpgradeArtifact(selectedArtifactSlot)}
                        disabled={!canAfford}
                        className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-cyber font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                          canAfford
                            ? 'bg-gradient-to-r from-[#ffd700] to-[#ffea75] text-black shadow-neon-gold hover:scale-105'
                            : 'bg-[#1e170a] text-amber-500/40 border border-[#ffbe3b]/20 cursor-not-allowed'
                        }`}
                      >
                        <Sparkles size={16} />
                        <span>FORGE ARTIFACT UPGRADE</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ======================================================== */}
          {/* MODULE 4: RANK (Strictly adhering to Sketch 2: Ladder, Preview, Emblem, Score line 3463/3500, GO button) */}
          {/* ======================================================== */}
          {activeBottomTab === 'rank' && (
            <div className="space-y-4">
              {/* Header: Title + Leaderboard & Rank Score Rule buttons */}
              <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-3">
                <div className="flex items-center space-x-2">
                  <Trophy className="text-[#ffd700]" size={20} />
                  <h3 className="font-cyber text-base font-black text-white uppercase gold-glow-text">
                    RANK ARENA LADDER & ASCENSION
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => { sound.playClick(); setActiveModal('leaderboard'); }}
                    className="px-3 py-1.5 rounded-lg bg-[#1a1104] hover:bg-[#281a05] border border-[#ffd700]/50 text-[#ffd700] text-xs font-mono flex items-center space-x-1 transition-colors"
                  >
                    <span>LEADERBOARD</span>
                  </button>

                  <button
                    onClick={() => { sound.playClick(); setActiveModal('rules'); }}
                    className="px-3 py-1.5 rounded-lg bg-[#1a1104] hover:bg-[#281a05] border border-[#ffbe3b]/40 text-amber-200 text-xs font-mono flex items-center space-x-1 transition-colors"
                  >
                    <Info size={13} />
                    <span>RANK SCORE RULE</span>
                  </button>
                </div>
              </div>

              {/* 3-Column Rank Layout (Matching Sketch 2) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* LEFT: Rank Ladder (Monarch, National-Rank, S-Rank, A-Rank, B-Rank, View All >>) */}
                <div className="md:col-span-5 bg-[#100b03] border border-[#ffbe3b]/40 rounded-xl p-3.5 space-y-2">
                  <div className="text-[10px] font-mono text-amber-400/80 uppercase mb-2 flex justify-between">
                    <span>HUNTER TIER LADDER</span>
                    <span>SEASON REWARD</span>
                  </div>

                  {rankLadder
                    .filter(r => !r.hidden || showAllRanks)
                    .map(r => {
                      const isCurrent = currentRankObj.rank === r.rank;
                      return (
                        <div
                          key={r.rank}
                          className={`p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                            isCurrent
                              ? 'bg-[#281a05] border-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.35)]'
                              : 'bg-[#150f04] border-[#ffbe3b]/20 text-amber-200/70'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <span className="text-lg">{r.symbol}</span>
                            <div>
                              <div className="font-cyber text-xs font-bold text-white flex items-center space-x-1.5">
                                <span>{r.rank}</span>
                                {isCurrent && (
                                  <span className="text-[8px] bg-[#ffd700] text-black px-1.5 py-0.2 rounded font-mono font-black">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="text-[9px] font-mono text-amber-400/70">
                                Req: {r.minScore} Pts
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-mono text-[#ffd700] block truncate max-w-[140px]">
                              {r.reward}
                            </span>
                            <span className="text-[9px] font-mono text-emerald-400">
                              {r.bonus}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {/* "View all >>" toggle for C, D, E ranks */}
                  <button
                    onClick={() => { sound.playClick(); setShowAllRanks(!showAllRanks); }}
                    className="w-full py-2 text-center text-xs font-mono text-[#ffd700] hover:underline bg-[#160f04] rounded border border-[#ffbe3b]/20"
                  >
                    {showAllRanks ? '<< Collapsed High Ranks' : 'View all Ranks (C, D, E) >>'}
                  </button>
                </div>

                {/* RIGHT: Big Rank Name Card with Emblem, Score 3463/3500, Checkbox, and GO button */}
                <div className="md:col-span-7 bg-gradient-to-b from-[#1c1305] via-[#100a02] to-[#1c1305] border-2 border-[#ffd700] rounded-xl p-5 shadow-neon-gold system-window flex flex-col justify-between">
                  {/* Top: Next Rank & Bonus row */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#120b02] p-3 rounded-lg border border-[#ffbe3b]/40 text-center">
                      <span className="text-[10px] font-mono text-amber-400/70 uppercase block">NEXT RANK TIER</span>
                      <span className="font-cyber text-xs font-bold text-[#ffd700] mt-0.5 block">
                        {nextRankObj ? `${nextRankObj.rank} (${nextRankObj.minScore} PTS)` : 'MAX ASCENSION'}
                      </span>
                    </div>

                    <div className="bg-[#120b02] p-3 rounded-lg border border-[#ffbe3b]/40 text-center">
                      <span className="text-[10px] font-mono text-amber-400/70 uppercase block">ACTIVE BONUS</span>
                      <span className="font-cyber text-xs font-bold text-[#39ff14] mt-0.5 block">
                        {currentRankObj.bonus}
                      </span>
                    </div>
                  </div>

                  {/* Center: Large Rank Emblem Banner with wings & shield */}
                  <div className="text-center py-3">
                    <div className="text-5xl mb-2 filter drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] animate-pulse">
                      🛡️
                    </div>
                    <h3 className="font-cyber text-2xl font-black text-white uppercase tracking-wider gold-glow-text">
                      {currentRankObj.rank}
                    </h3>
                    <p className="text-xs font-mono text-[#ffd700] font-bold">
                      {hunterRank.title}
                    </p>
                  </div>

                  {/* Score Progress Line: score number like 3463 / 3500 */}
                  <div className="my-4 bg-[#0e0802] p-3.5 rounded-lg border border-[#ffbe3b]/40">
                    <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                      <span className="text-amber-300 uppercase">RANK SCORE TELEMETRY</span>
                      <span className="font-cyber text-sm font-bold text-[#ffd700]">
                        {rankScore} / {nextRankObj ? nextRankObj.minScore : 5000}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#1d1203] rounded-full border border-[#ffbe3b]/50 overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-[#e69500] via-[#ffd700] to-[#fff1a8] rounded-full shadow-[0_0_10px_#ffd700] transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round((rankScore / (nextRankObj ? nextRankObj.minScore : 5000)) * 100))}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Bottom: "Display Rank in lobby" toggle + GO button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <label className="flex items-center space-x-2 text-xs font-mono text-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={displayRankInLobby}
                        onChange={(e) => { sound.playClick(); setDisplayRankInLobby(e.target.checked); }}
                        className="w-4 h-4 rounded accent-[#ffd700] bg-[#120b02] border border-[#ffbe3b]"
                      />
                      <span>Display Rank in lobby</span>
                    </label>

                    <button
                      onClick={() => {
                        sound.playSoloLevelingMessageTone();
                        confetti({ particleCount: 50, spread: 60 });
                        setActiveTab('world');
                      }}
                      className="w-full sm:w-44 py-3 bg-gradient-to-r from-[#ffd700] to-[#ffea75] text-black font-cyber font-black text-sm uppercase tracking-widest rounded-xl shadow-neon-gold hover:scale-105 transition-all flex items-center justify-center space-x-2"
                    >
                      <Play size={16} className="fill-black" />
                      <span>GO (BATTLE)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* INTERACTIVE MODALS FOR LEFT MENU ITEMS & HEADER SHORTCUTS */}
      {/* ============================================================ */}

      {/* STORE MODAL */}
      {activeModal === 'store' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f0a03] border-2 border-[#ffd700] rounded-2xl max-w-lg w-full p-6 shadow-neon-gold system-window space-y-4">
            <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-3">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="text-[#ffd700]" size={20} />
                <h3 className="font-cyber text-base font-bold text-white uppercase">SHADOW SYSTEM STORE</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-amber-400 hover:text-white"><X size={18} /></button>
            </div>
            <p className="text-xs text-amber-200/80 font-mono">Acquire specialized recovery elixirs and dimensional mana scrolls.</p>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-[#170f04] border border-[#ffbe3b]/30 flex items-center justify-between">
                <div>
                  <h4 className="font-cyber text-xs font-bold text-white">Full Recovery Potion</h4>
                  <p className="text-[10px] text-amber-200/70">Instantly restores 100% Player HP and Energy.</p>
                </div>
                <button onClick={() => { sound.playCoin(); setActiveModal(null); }} className="px-3 py-1 bg-[#ffd700] text-black font-cyber font-bold text-xs uppercase rounded shadow-neon-gold">
                  100 Gold
                </button>
              </div>
              <div className="p-3 rounded-lg bg-[#170f04] border border-[#ffbe3b]/30 flex items-center justify-between">
                <div>
                  <h4 className="font-cyber text-xs font-bold text-white">10x Blue Crystal Cache</h4>
                  <p className="text-[10px] text-cyan-300/70">Refined raw blue mana crystal supply.</p>
                </div>
                <button onClick={() => { sound.playCoin(); setActiveModal(null); }} className="px-3 py-1 bg-cyan-500 text-black font-cyber font-bold text-xs uppercase rounded shadow-neon-gold">
                  250 Gold
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LUCK ROYALE MODAL */}
      {activeModal === 'luck' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f0a03] border-2 border-purple-500 rounded-2xl max-w-md w-full p-6 shadow-[0_0_25px_rgba(168,85,247,0.4)] system-window text-center space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-cyber text-purple-400 font-bold uppercase">SOLO LEVELING LUCK ROYALE</span>
              <button onClick={() => setActiveModal(null)} className="text-amber-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-purple-900 to-black border-2 border-purple-400 flex items-center justify-center text-5xl shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-pulse">
              🎰
            </div>
            <h3 className="font-cyber text-lg font-black text-white gold-glow-text">SPIN OF THE SHADOW SOVEREIGN</h3>
            <p className="text-xs text-amber-100/80 font-sans">
              Test your awakening luck to win up to 50 Blue Crystals, Mythic Artifacts, or 1,000 Gold!
            </p>
            <button
              onClick={handleLuckRoyaleSpin}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-[#ffd700] text-black font-cyber font-black text-xs uppercase tracking-widest rounded-xl shadow-neon-gold"
            >
              SPIN FOR 50 GOLD
            </button>
          </div>
        </div>
      )}

      {/* PASS MODAL */}
      {activeModal === 'pass' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f0a03] border-2 border-[#ffd700] rounded-2xl max-w-md w-full p-6 shadow-neon-gold system-window space-y-4">
            <div className="flex justify-between items-center border-b border-[#ffbe3b]/30 pb-2">
              <h3 className="font-cyber text-sm font-bold text-white uppercase">HUNTER SEASON BATTLE PASS</h3>
              <button onClick={() => setActiveModal(null)} className="text-amber-400 hover:text-white"><X size={18} /></button>
            </div>
            <p className="text-xs text-amber-200/80 font-mono">Current Season: <strong>Shadow Awakening Vol. 1</strong></p>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-[#170f03] border border-[#ffd700]/40 rounded flex justify-between items-center">
                <span>Tier 1: 5x Blue Crystals</span>
                <span className="text-[#39ff14] font-bold">CLAIMED</span>
              </div>
              <div className="p-2.5 bg-[#170f03] border border-[#ffbe3b]/30 rounded flex justify-between items-center">
                <span>Tier 5: Shadow Trenchcoat Noir</span>
                <span className="text-amber-400 font-bold">LVL 5 REQ</span>
              </div>
              <div className="p-2.5 bg-[#170f03] border border-purple-500/40 rounded flex justify-between items-center">
                <span>Tier 10: Sovereign Death Ring</span>
                <span className="text-purple-400 font-bold">MONARCH PASS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EVENTS MODAL */}
      {activeModal === 'events' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f0a03] border-2 border-emerald-500 rounded-2xl max-w-md w-full p-6 shadow-[0_0_20px_rgba(16,185,129,0.3)] system-window space-y-4">
            <div className="flex justify-between items-center border-b border-emerald-500/30 pb-2">
              <h3 className="font-cyber text-sm font-bold text-white uppercase">DIMENSIONAL GATE EVENTS</h3>
              <button onClick={() => setActiveModal(null)} className="text-amber-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-3 bg-[#081f14] border border-emerald-500/40 rounded-lg space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 font-bold">ACTIVE FOR 48 HOURS</span>
              <h4 className="font-cyber text-xs font-bold text-white">RED GATE INVASION OVERDRIVE</h4>
              <p className="text-[11px] text-emerald-200/80">Complete any 20-min workout to harvest 2x Blue Crystals.</p>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE TO FRIENDS / CHAT MODAL */}
      {activeModal === 'chat' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f0a03] border-2 border-[#ffd700] rounded-2xl max-w-md w-full p-5 shadow-neon-gold system-window flex flex-col h-[420px]">
            <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-2 mb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="text-[#ffd700]" size={16} />
                <h3 className="font-cyber text-sm font-bold text-white uppercase">PARTY BROADCAST</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-amber-400 hover:text-white"><X size={16} /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 p-1 text-xs font-mono">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`p-2.5 rounded-lg ${msg.sender === profile.name ? 'bg-[#251806] border border-[#ffd700]/50 ml-6 text-white' : 'bg-[#150f04] border border-[#ffbe3b]/20 mr-6 text-amber-200'}`}>
                  <div className="flex justify-between text-[10px] text-amber-400/80 mb-1">
                    <span className="font-bold">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="mt-3 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Broadcast to allies..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-[#150f04] border border-[#ffbe3b]/40 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ffd700]"
              />
              <button type="submit" className="px-3 py-2 bg-[#ffd700] text-black font-cyber font-bold text-xs uppercase rounded-lg shadow-neon-gold">
                SEND
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ALLIES / FRIENDS LIST MODAL */}
      {activeModal === 'friends' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f0a03] border-2 border-[#ffd700] rounded-2xl max-w-md w-full p-5 shadow-neon-gold system-window space-y-4">
            <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-2">
              <h3 className="font-cyber text-sm font-bold text-white uppercase">INVITE ALLIES TO PARTY</h3>
              <button onClick={() => setActiveModal(null)} className="text-amber-400 hover:text-white"><X size={16} /></button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto text-xs font-mono">
              <span className="text-[10px] text-emerald-400 font-bold">ONLINE HUNTERS</span>
              {onlineFriends.map(f => (
                <div key={f.id} className="p-2.5 rounded-lg bg-[#160f04] border border-[#ffbe3b]/30 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">{f.name}</h4>
                    <span className="text-[10px] text-amber-400/80">{f.rank} • {f.role}</span>
                  </div>
                  <button onClick={() => handleInviteFriend(f)} className="px-3 py-1 bg-[#ffd700] text-black font-cyber font-bold text-[10px] uppercase rounded">
                    INVITE
                  </button>
                </div>
              ))}

              <span className="text-[10px] text-stone-400 font-bold block pt-2">OFFLINE ALLIES</span>
              {offlineFriends.map(f => (
                <div key={f.id} className="p-2.5 rounded-lg bg-[#0e0a03] border border-[#ffbe3b]/15 flex items-center justify-between opacity-60">
                  <div>
                    <h4 className="font-bold text-white">{f.name}</h4>
                    <span className="text-[10px] text-amber-400/80">{f.rank} • {f.role}</span>
                  </div>
                  <span className="text-[10px] text-stone-500">OFFLINE</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RANK SCORE RULES MODAL */}
      {activeModal === 'rules' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f0a03] border-2 border-[#ffd700] rounded-2xl max-w-md w-full p-6 shadow-neon-gold system-window space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center border-b border-[#ffbe3b]/30 pb-2">
              <h3 className="font-cyber text-sm font-bold text-white uppercase">RANK SCORE COMPUTATION</h3>
              <button onClick={() => setActiveModal(null)} className="text-amber-400 hover:text-white"><X size={16} /></button>
            </div>
            <p className="text-amber-200/90 font-sans">
              Rank score represents your awakened caliber in the Solo Leveling System. Points are calculated from:
            </p>
            <div className="space-y-1.5 bg-[#140e04] p-3 rounded-lg border border-[#ffbe3b]/30">
              <div>👣 <strong>Gait Cadence:</strong> +1 Point per 100 Real-World Steps.</div>
              <div>⚡ <strong>Workouts:</strong> +25 Points per completed Kinetic Core Burst session.</div>
              <div>⚔️ <strong>Gate Incursions:</strong> +50 Points per cleared Dimensional Gate.</div>
              <div>🛡️ <strong>Guild Standing:</strong> +100 Points for top 3 campus alliance standings.</div>
            </div>
          </div>
        </div>
      )}

      {/* LEADERBOARD MODAL */}
      {activeModal === 'leaderboard' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f0a03] border-2 border-[#ffd700] rounded-2xl max-w-md w-full p-6 shadow-neon-gold system-window space-y-3">
            <div className="flex justify-between items-center border-b border-[#ffbe3b]/30 pb-2">
              <h3 className="font-cyber text-sm font-bold text-white uppercase">CAMPUS & GLOBAL STANDINGS</h3>
              <button onClick={() => setActiveModal(null)} className="text-amber-400 hover:text-white"><X size={16} /></button>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#201504] border border-[#ffd700] flex justify-between items-center">
                <span className="font-bold text-[#ffd700]">#1 Thomas Andre (National)</span>
                <span>8,420 PTS</span>
              </div>
              <div className="p-2.5 rounded bg-[#160f04] border border-[#ffbe3b]/30 flex justify-between items-center">
                <span className="font-bold text-purple-300">#2 Liu Zhigang (National)</span>
                <span>7,890 PTS</span>
              </div>
              <div className="p-2.5 rounded bg-[#2a1d06] border-2 border-[#ffd700] flex justify-between items-center shadow-neon-gold">
                <span className="font-bold text-white">#14 {profile.name} (YOU)</span>
                <span className="text-[#ffd700] font-black">{rankScore} PTS</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
