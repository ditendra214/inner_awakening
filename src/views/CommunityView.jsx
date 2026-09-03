import React, { useState } from 'react';
import { 
  Users, Trophy, Flame, Swords, Shield, Sparkles, 
  Send, Award, Clock, ArrowRight, MessageSquare
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const CommunityView = () => {
  const { collegeTeams, profile, addXP } = useGame();
  const [cheerSent, setCheerSent] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Kavya_Synth', text: 'Just completed 4,000 steps! CSE-A leading by 5.6k!', time: '2m ago' },
    { id: 2, user: 'Rohan_Titan', text: 'CSE-B is catching up fast, push today’s missions team!', time: '8m ago' },
    { id: 3, user: 'Vicky_Apex', text: 'Logged 20 min grav-workout. Let’s claim the 500k event reward!', time: '14m ago' }
  ]);
  const [newMsg, setNewMsg] = useState('');

  // Find user's squad
  const userTeam = collegeTeams.find(t => t.id === profile.department.toLowerCase().replace(/[^a-z0-9]/g, '-') || t.name.includes(profile.department)) || collegeTeams[0];

  const handleRallySquad = () => {
    sound.playLevelUp();
    setCheerSent(true);
    addXP(50); // XP bonus for rallying your team!
    setTimeout(() => setCheerSent(false), 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    sound.playClick();
    setChatMessages(prev => [
      { id: Date.now(), user: profile.name, text: newMsg.trim(), time: 'Just now' },
      ...prev
    ]);
    setNewMsg('');
  };

  // Top score calculation
  const topTeam = [...collegeTeams].sort((a, b) => b.xp - a.xp)[0];
  const totalEventXp = collegeTeams.reduce((acc, t) => acc + t.xp, 0);
  const eventTarget = 500000;
  const eventPercent = Math.min(100, Math.round((totalEventXp / eventTarget) * 100));

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* 1. College Battle Arena Header */}
      <div className="bg-[#0b1226] border border-amber-500/40 rounded-2xl p-5 md:p-6 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-amber-950 border border-amber-500 text-[10px] font-mono text-amber-300 rounded uppercase tracking-wider">
                MULTIPLAYER FITNESS ARENA
              </span>
              <span className="text-xs font-mono text-cyan-400">REAL-TIME SYNC</span>
            </div>
            <h2 className="font-cyber text-2xl md:text-3xl font-black text-white uppercase mt-1">
              COLLEGE FITNESS BATTLE
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Every step, workout, and sprint you perform in the physical world directly contributes kinetic points to your squad's rank.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRallySquad}
              disabled={cheerSent}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-cyber font-black text-xs uppercase tracking-widest rounded-xl shadow-lg flex items-center space-x-2 transition-all transform hover:scale-105"
            >
              <Flame size={16} className="fill-black" />
              <span>{cheerSent ? 'RALLY BOOSTED (+50 XP)!' : 'RALLY YOUR SQUAD'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Limited Time Urgency Event: 🔥 7-Day Campus Battle */}
      <div className="relative bg-gradient-to-r from-[#170c1e] via-[#101732] to-[#0c1f24] border-2 border-rose-500/60 rounded-xl p-5 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-rose-500/20 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400">
              <Swords size={20} className="animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-cyber text-sm font-black text-white uppercase tracking-wider">
                  🔥 7-DAY CAMPUS BATTLE: OPERATION NEURAL OVERLOAD
                </span>
                <span className="px-2 py-0.5 bg-rose-950 border border-rose-500 text-[10px] font-mono text-rose-300 rounded uppercase animate-pulse">
                  LIMITED EVENT
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Collective Goal: Campus Reaches 500,000 Kinetic Activity Points
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 font-mono text-xs text-rose-300 bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-500/40">
            <Clock size={14} />
            <span>05d 14h 22m Remaining</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-rose-300">CAMPUS SYNERGY PROGRESS: {eventPercent}%</span>
            <span className="text-white font-bold">{totalEventXp.toLocaleString()} / {eventTarget.toLocaleString()} XP</span>
          </div>
          <div className="w-full h-3.5 bg-slate-950 rounded-full border border-rose-500/40 overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_10px_#f43f5e]"
              style={{ width: `${eventPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Rewards Ribbon */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 uppercase text-[10px]">EVENT VICTORY REWARDS:</span>
          <span className="px-2.5 py-1 bg-[#121c3b] border border-amber-400/40 text-amber-300 rounded flex items-center space-x-1">
            <Trophy size={12} />
            <span>Campus Champion Badge</span>
          </span>
          <span className="px-2.5 py-1 bg-[#121c3b] border border-amber-400/40 text-amber-300 rounded">
            🪙 +2,000 FitCoins
          </span>
          <span className="px-2.5 py-1 bg-[#121c3b] border border-fuchsia-400/40 text-fuchsia-300 rounded">
            ✨ Exclusive Quantum Cyber-Wings
          </span>
        </div>
      </div>

      {/* 3. Live Leaderboard Bars */}
      <div className="bg-[#0b1226] border border-cyan-500/30 rounded-xl p-5 shadow-neon-cyan">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-cyber text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Trophy className="text-amber-400" size={18} />
            <span>LIVE DEPARTMENT STANDINGS</span>
          </h3>
          <span className="text-xs font-mono text-cyan-400 uppercase">
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
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]' 
                    : 'bg-[#0f1730]/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-cyber text-xs font-black ${
                      idx === 0 ? 'bg-amber-400 text-black' :
                      idx === 1 ? 'bg-slate-300 text-black' :
                      idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{idx + 1}
                    </span>
                    <span className="font-cyber text-sm font-bold text-white">{team.name}</span>
                    {isUserGuild && (
                      <span className="px-1.5 py-0.5 bg-cyan-400 text-black font-mono text-[9px] font-bold rounded uppercase">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-black text-cyan-400">{team.xp.toLocaleString()} XP</span>
                    <span className="text-[10px] font-mono text-slate-400 block">{team.members} Operatives</span>
                  </div>
                </div>

                {/* Animated XP Meter */}
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
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

      {/* 4. Live Squad Transmissions (Chat) */}
      <div className="bg-[#0b1226] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
          <MessageSquare className="text-cyan-400" size={18} />
          <h3 className="font-cyber text-sm font-bold text-white uppercase tracking-wider">
            CAMPUS TELEMETRY CHAT
          </h3>
        </div>

        <div className="space-y-2.5 max-h-48 overflow-y-auto mb-4 pr-1">
          {chatMessages.map((msg) => (
            <div key={msg.id} className="bg-[#101936] p-2.5 rounded-lg border border-slate-800 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-cyber font-bold text-cyan-300">{msg.user}</span>
                <span className="text-[10px] font-mono text-slate-500">{msg.time}</span>
              </div>
              <p className="text-slate-300 font-sans">{msg.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Broadcast message to your squad..."
            className="flex-1 bg-[#121c3b] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs uppercase rounded-lg shadow-neon-cyan flex items-center space-x-1"
          >
            <Send size={14} />
            <span>SEND</span>
          </button>
        </form>
      </div>
    </div>
  );
};
