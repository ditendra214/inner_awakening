/**
 * 8-Tier Fitness Rank Progression Architecture
 * Hierarchy: MONARCH -> NATIONAL -> S -> A -> B -> C -> D -> E
 * Strictly adheres to fitness gaming specifications.
 */

export const FITNESS_RANKS = [
  {
    id: 'MONARCH',
    name: 'MONARCH',
    title: 'Sovereign Fitness Monarch',
    minRp: 3000,
    maxRp: 4000,
    color: '#FFA000',
    glowColor: 'rgba(255, 160, 0, 0.7)',
    bgGradient: 'from-[#2e1d03] via-[#1a1103] to-black',
    borderClass: 'border-amber-400',
    badge: '/assets/ranks/badge_monarch.png',
    icon: '👑',
    identity: 'Gold sovereign crown with powerful athletic silhouette and radiant aura',
    bonusText: '+30% Fitness XP & Mana Output',
    statMultiplier: 1.30,
    tierOrder: 8
  },
  {
    id: 'NATIONAL',
    name: 'NATIONAL',
    title: 'National Champion Athlete',
    minRp: 2500,
    maxRp: 2999,
    color: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.7)',
    bgGradient: 'from-[#032329] via-[#021417] to-black',
    borderClass: 'border-cyan-400',
    badge: '/assets/ranks/badge_national.png',
    icon: '🦅',
    identity: 'Silver-blue eagle wings emblem, national champion caliber',
    bonusText: '+25% Conditioning Surge',
    statMultiplier: 1.25,
    tierOrder: 7
  },
  {
    id: 'S',
    name: 'S-RANK',
    title: 'S-Tier Apex Olympian',
    minRp: 2000,
    maxRp: 2499,
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    bgGradient: 'from-[#2b2502] via-[#171402] to-black',
    borderClass: 'border-yellow-400',
    badge: '/assets/ranks/badge_s.png',
    icon: '⚡',
    identity: 'Gold geometric high-energy emblem of explosive power',
    bonusText: '+20% Strength & Stamina',
    statMultiplier: 1.20,
    tierOrder: 6
  },
  {
    id: 'A',
    name: 'A-RANK',
    title: 'A-Tier Elite Competitor',
    minRp: 1500,
    maxRp: 1999,
    color: '#B388FF',
    glowColor: 'rgba(179, 136, 255, 0.6)',
    bgGradient: 'from-[#200e33] via-[#12071f] to-black',
    borderClass: 'border-purple-400',
    badge: '/assets/ranks/badge_a.png',
    icon: '🛡️',
    identity: 'Purple angular shield insignia representing elite fortitude',
    bonusText: '+15% Aerobic Velocity',
    statMultiplier: 1.15,
    tierOrder: 5
  },
  {
    id: 'B',
    name: 'B-RANK',
    title: 'B-Tier Veteran Raider',
    minRp: 1000,
    maxRp: 1499,
    color: '#00B0FF',
    glowColor: 'rgba(0, 176, 255, 0.5)',
    bgGradient: 'from-[#031d30] via-[#02101c] to-black',
    borderClass: 'border-sky-400',
    badge: '/assets/ranks/badge_b.png',
    icon: '⚔️',
    identity: 'Cobalt blue crossed blade emblem of disciplined endurance',
    bonusText: '+10% Hypertrophy Burst',
    statMultiplier: 1.10,
    tierOrder: 4
  },
  {
    id: 'C',
    name: 'C-RANK',
    title: 'C-Tier Conditioning Striker',
    minRp: 600,
    maxRp: 999,
    color: '#00E676',
    glowColor: 'rgba(0, 230, 118, 0.5)',
    bgGradient: 'from-[#042614] via-[#02170c] to-black',
    borderClass: 'border-emerald-400',
    badge: '/assets/ranks/badge_c.png',
    icon: '💎',
    identity: 'Emerald crystal core symbolizing steady cardio expansion',
    bonusText: '+7% Core Stability',
    statMultiplier: 1.07,
    tierOrder: 3
  },
  {
    id: 'D',
    name: 'D-RANK',
    title: 'D-Tier Iron Vanguard',
    minRp: 300,
    maxRp: 599,
    color: '#8A9EA7',
    glowColor: 'rgba(138, 158, 167, 0.4)',
    bgGradient: 'from-[#141b20] via-[#0c1014] to-black',
    borderClass: 'border-slate-400',
    badge: '/assets/ranks/badge_d.png',
    icon: '🗡️',
    identity: 'Silver-gray tempered plate emblem of foundational strength',
    bonusText: '+5% Resistance Threshold',
    statMultiplier: 1.05,
    tierOrder: 2
  },
  {
    id: 'E',
    name: 'E-RANK',
    title: 'E-Tier Novice Awakener',
    minRp: 0,
    maxRp: 299,
    color: '#CD7F32',
    glowColor: 'rgba(205, 127, 50, 0.4)',
    bgGradient: 'from-[#241508] via-[#140b04] to-black',
    borderClass: 'border-amber-700',
    badge: '/assets/ranks/badge_e.png',
    icon: '🌱',
    identity: 'Bronze-orange awakened catalyst of new beginnings',
    bonusText: '+2% Foundation Stamina',
    statMultiplier: 1.02,
    tierOrder: 1
  }
];

export const getRankById = (rankId) => {
  return FITNESS_RANKS.find(r => r.id === rankId) || FITNESS_RANKS[0];
};

export const getRankByPoints = (points) => {
  const pts = Number(points) || 0;
  for (const rank of FITNESS_RANKS) {
    if (pts >= rank.minRp) {
      return rank;
    }
  }
  return FITNESS_RANKS[FITNESS_RANKS.length - 1];
};

export const getNextRank = (currentRankId) => {
  const currentIndex = FITNESS_RANKS.findIndex(r => r.id === currentRankId);
  if (currentIndex > 0) {
    return FITNESS_RANKS[currentIndex - 1];
  }
  return null; // Already Monarch (Apex)
};

export const calculateRankProgress = (points, currentRank) => {
  const pts = Number(points) || 0;
  if (!currentRank) return 100;
  
  const span = (currentRank.maxRp - currentRank.minRp) || 1000;
  const currentInTier = pts - currentRank.minRp;
  const pct = (currentInTier / span) * 100;
  return Math.min(100, Math.max(0, parseFloat(pct.toFixed(1))));
};
