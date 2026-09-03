import React, { useState } from 'react';
import { 
  Users, Trophy, Flame, Swords, Shield, Sparkles, 
  Send, Award, Clock, ArrowRight, MessageSquare, Crown
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const CommunityView = () => {
  const { collegeTeams, profile, addXP } = useGame();
  const [cheerSent, setCheerSent] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Kavya_Hunter', text: 'Just completed 4,000 steps! CSE-A leading by 5.6k!', time: '2m ago' },
    { id: 2, user: 'Rohan_Shadow', text: 'CSE-B is catching up fast, push today’s daily quests team!', time: '8m ago' },
    { id: 3, user: 'Vicky_Monarch', text: 'Logged 20 min training. Let’s claim the 500k event reward!', time: '14m ago' }
  ]);
  const [newMsg, setNewMsg] = useState('');

  const userTeam = collegeTeams.find(t => t.id === profile.department.toLowerCase().replace(/[^a-z0-9]/g, '-') || t.name.includes(profile.department)) || collegeTeams[0];

  const handleRallySquad = () => {
    sound.playLevelUp();
    setCheerSent(true);
    addXP(50);
    setTimeout(() => setCheerSent(false), 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    sound.playSoloLevelingMessageTone();
    setChatMessages(prev => [
      { id: Date.now(), user: profile.name, text: newMsg.trim(), time: 'Just now' },
      ...prev
    ]);
    setNewMsg('');
  };

  const topTeam = [...collegeTeams].sort((a, b) => b.xp - a.xp)[0];
  const totalEventXp = collegeTeams.reduce((acc, t) => acc + t.xp, 0);
  const eventTarget = 500000;
  const eventPercent = Math.min(100, Math.round((totalEventXp / eventTarget) * 100));

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative z-10">
      {/* 1. Hunter Guilds Arena Header */}
      <div className="bg-[#0e0903] border border-[#ffbe3b]/50 rounded-2xl p-5 md:p-6 shadow-neon-gold system-window">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-[#2a1a05] border border-[#ffd700] text-[10px] font-mono text-[#ffd700] rounded uppercase tracking-wider font-bold">
                [ SYSTEM: MULTIPLAYER GUILD WARS ]
              </span>
              <span className="text-xs font-mono text-amber-300">CAMPUS RAID LEAGUE</span>
            </div>
            <h2 className="font-cyber text-2xl md:text-3xl font-black text-white uppercase mt-1 gold-glow-text">
              HUNTER GUILD BATTLE
            </h2>
            <p className="text-xs text-amber-100/80 mt-1 max-w-xl">
              Every step, workout, and sprint completed in the physical realm fuels kinetic mana into your Hunter Guild's rank on the national leaderboard.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRallySquad}
              disabled={cheerSent}
              className="px-5 py-3 bg-gradient-to-r from-[#e69500] to-[#ffd700] hover:from-[#ffd700] hover:to-[#ffea75] text-black font-cyber font-black text-xs uppercase tracking-widest rounded-xl shadow-neon-gold flex items-center space-x-2 transition-all transform hover:scale-105"
            >
              <Flame size={16} className="fill-black" />
              <span>{cheerSent ? 'SHADOW AURA ACTIVATED (+50 XP)!' : 'RALLY YOUR GUILD'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Limited Time Urgency Event: 🔥 7-Day Red Gate Raid */}
      <div className="relative bg-gradient-to-r from-[#1f1003] via-[#140d04] to-[#0c0802] border-2 border-[#ffbe3b] rounded-xl p-5 shadow-neon-gold system-window">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#ffbe3b]/30 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#2d1b05] rounded-lg text-[#ffd700] border border-[#ffd700]">
              <Swords size={20} className="animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-cyber text-sm font-black text-white uppercase tracking-wider gold-glow-text">
                  🔥 7-DAY RAID: OPERATION RED GATE EXTINCTION
                </span>
                <span className="px-2 py-0.5 bg-[#3a2003] border border-[#ffd700] text-[10px] font-mono text-[#ffd700] rounded uppercase animate-pulse font-bold">
                  LIMITED RAID
                </span>
              </div>
              <span className="text-[11px] font-mono text-amber-300/80">
                Collective Goal: Campus Reaches 500,000 Kinetic Activity Points
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 font-mono text-xs text-[#ffd700] bg-[#231503] px-3 py-1.5 rounded-lg border border-[#ffbe3b]/50">
            <Clock size={14} />
            <span>05d 14h 22m Remaining</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-[#ffd700]">COLLECTIVE RAID MANA: {eventPercent}%</span>
            <span className="text-white font-bold">{totalEventXp.toLocaleString()} / {eventTarget.toLocaleString()} XP</span>
          </div>
          <div className="w-full h-3.5 bg-[#100b03] rounded-full border border-[#ffbe3b]/50 overflow-hidden p-0.5 shadow-[inset_0_0_8px_rgba(0,0,0,0.9)]">
            <div 
              className="h-full bg-gradient-to-r from-[#e69500] via-[#ffd700] to-[#fff1a8] rounded-full transition-all duration-500 shadow-[0_0_12px_#ffd700]"
              style={{ width: `${eventPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Rewards Ribbon */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-amber-400/80 uppercase text-[10px]">RAID VICTORY REWARDS:</span>
          <span className="px-2.5 py-1 bg-[#1c1203] border border-[#ffd700]/50 text-[#ffd700] rounded flex items-center space-x-1">
            <Crown size={12} />
            <span>Monarch Champion Badge</span>
          </span>
          <span className="px-2.5 py-1 bg-[#1c1203] border border-[#ffd700]/50 text-[#ffd700] rounded">
            🪙 +2,000 FitCoins
          </span>
          <span className="px-2.5 py-1 bg-[#1c1203] border border-[#ffd700]/50 text-[#ffd700] rounded">
            ✨ Exclusive Shadow Monarch Cloak
          </span>
        </div>
      </div>

      {/* 3. Live Guild Leaderboard */}
      <div className="bg-[#0e0903] border border-[#ffbe3b]/50 rounded-xl p-5 shadow-neon-gold system-window">
        <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-3 mb-4">
          <h3 className="font-cyber text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Trophy className="text-[#ffd700]" size={18} />
            <span>LIVE HUNTER GUILD STANDINGS</span>
          </h3>
          <span className="text-xs font-mono text-[#ffd700] uppercase">
            YOUR GUILD: {userTeam.name.split(' ')[0]}
          </span>
        </div>

        <div className="space-y-4">
          {collegeTeams.map((team, idx) => {
            const isUserGuild = team.id === userTeam.id;
            const barWidth = Math.round((team.xp / topTeam.xp) * 100);

            return (
              <div 
                key={team.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isUserGuild 
                    ? 'bg-[#221603] border-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.25)]' 
                    : 'bg-[#120c04] border-amber-950/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-cyber text-xs font-black ${
                      idx === 0 ? 'bg-[#ffd700] text-black' :
                      idx === 1 ? 'bg-slate-300 text-black' :
                      idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{idx + 1}
                    </span>
                    <span className="font-cyber text-sm font-bold text-white">{team.name}</span>
                    {isUserGuild && (
                      <span className="px-1.5 py-0.5 bg-[#ffd700] text-black font-mono text-[9px] font-bold rounded uppercase">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-black text-[#ffd700]">{team.xp.toLocaleString()} XP</span>
                    <span className="text-[10px] font-mono text-amber-400/70 block">{team.members} Hunters</span>
                  </div>
                </div>

                {/* Animated XP Meter */}
                <div className="w-full h-3 bg-[#0a0702] rounded-full overflow-hidden p-0.5 border border-[#ffbe3b]/30">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ 
                      width: `${barWidth}%`,
                      backgroundColor: team.color,
                      boxShadow: `0 0 10px ${team.color}`
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Live Guild Telemetry Chat */}
      <div className="bg-[#0e0903] border border-[#ffbe3b]/40 rounded-xl p-5 system-window">
        <div className="flex items-center space-x-2 border-b border-[#ffbe3b]/30 pb-3 mb-4">
          <MessageSquare className="text-[#ffd700]" size={18} />
          <h3 className="font-cyber text-sm font-bold text-white uppercase tracking-wider">
            GUILD TELEMETRY CHAT
          </h3>
        </div>

        <div className="space-y-2.5 max-h-48 overflow-y-auto mb-4 pr-1">
          {chatMessages.map((msg) => (
            <div key={msg.id} className="bg-[#191104] p-2.5 rounded-lg border border-[#ffbe3b]/30 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-cyber font-bold text-[#ffd700]">{msg.user}</span>
                <span className="text-[10px] font-mono text-amber-500/70">{msg.time}</span>
              </div>
              <p className="text-amber-100/90 font-sans">{msg.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Broadcast telepathic message to your guild..."
            className="flex-1 bg-[#191104] border border-[#ffbe3b]/40 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ffd700]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#ffd700] hover:bg-[#ffea75] text-black font-cyber font-bold text-xs uppercase rounded-lg shadow-neon-gold flex items-center space-x-1"
          >
            <Send size={14} />
            <span>SEND</span>
          </button>
        </form>
      </div>
    </div>
  );
};
