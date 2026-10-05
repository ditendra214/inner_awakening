// Solo Leveling Hunter Rank System
// Level-based rank progression defined according to hunter awakening thresholds:
// < 10: E Rank (Initial rank)
// 10+: D Rank
// 20+: C Rank
// 30+: B Rank
// 50+: A Rank
// 80+: S Rank
// 100+: National Rank
// 200+: Monarch

export const getHunterRank = (level) => {
  const lvl = Number(level) || 1;

  if (lvl >= 200) {
    return {
      rank: 'Monarch',
      label: 'Monarch',
      badge: 'MONARCH',
      title: 'Shadow Monarch (Supreme Sovereign)',
      color: '#c084fc',
      textColor: 'text-purple-300',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-950/40',
      glow: 'shadow-[0_0_15px_rgba(192,132,252,0.6)]',
      aura: 'Sovereign of Death & Shadows'
    };
  }

  if (lvl >= 100) {
    return {
      rank: 'National Rank',
      label: 'National Rank',
      badge: 'NATIONAL RANK',
      title: 'National Level Hunter',
      color: '#ffd700',
      textColor: 'text-[#ffd700]',
      borderColor: 'border-[#ffd700]',
      bgColor: 'bg-[#ffd700]/20',
      glow: 'shadow-[0_0_15px_rgba(255,215,0,0.6)]',
      aura: 'Pillar of Humanity / National Caliber'
    };
  }

  if (lvl >= 80) {
    return {
      rank: 'S Rank',
      label: 'S Rank',
      badge: 'S-RANK',
      title: 'S-Rank Awakened Hunter',
      color: '#f43f5e',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500',
      bgColor: 'bg-rose-950/40',
      glow: 'shadow-[0_0_12px_rgba(244,63,94,0.5)]',
      aura: 'Apex Dungeon Calamity'
    };
  }

  if (lvl >= 50) {
    return {
      rank: 'A Rank',
      label: 'A Rank',
      badge: 'A-RANK',
      title: 'A-Rank Elite Hunter',
      color: '#38bdf8',
      textColor: 'text-sky-300',
      borderColor: 'border-sky-500',
      bgColor: 'bg-sky-950/40',
      glow: 'shadow-[0_0_10px_rgba(56,189,248,0.4)]',
      aura: 'High Dungeon Vanguard'
    };
  }

  if (lvl >= 30) {
    return {
      rank: 'B Rank',
      label: 'B Rank',
      badge: 'B-RANK',
      title: 'B-Rank Veteran Hunter',
      color: '#34d399',
      textColor: 'text-emerald-300',
      borderColor: 'border-emerald-500',
      bgColor: 'bg-emerald-950/40',
      glow: 'shadow-[0_0_8px_rgba(52,211,153,0.3)]',
      aura: 'Gate Raid Commander'
    };
  }

  if (lvl >= 20) {
    return {
      rank: 'C Rank',
      label: 'C Rank',
      badge: 'C-RANK',
      title: 'C-Rank Hunter',
      color: '#fbbf24',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-950/40',
      glow: 'shadow-[0_0_8px_rgba(251,191,36,0.3)]',
      aura: 'Dungeon Raid Specialist'
    };
  }

  if (lvl >= 10) {
    return {
      rank: 'D Rank',
      label: 'D Rank',
      badge: 'D-RANK',
      title: 'D-Rank Hunter',
      color: '#94a3b8',
      textColor: 'text-slate-300',
      borderColor: 'border-slate-500',
      bgColor: 'bg-slate-900/40',
      glow: 'shadow-[0_0_6px_rgba(148,163,184,0.3)]',
      aura: 'Awakened Dungeon Raider'
    };
  }

  return {
    rank: 'E Rank',
    label: 'E Rank',
    badge: 'E-RANK',
    title: 'E-Rank Hunter (Initial Rank)',
    color: '#a8a29e',
    textColor: 'text-amber-200/90',
    borderColor: 'border-stone-500',
    bgColor: 'bg-stone-900/40',
    glow: 'shadow-[0_0_6px_rgba(168,162,158,0.2)]',
    aura: 'Weakest Awakened Hunter'
  };
};
