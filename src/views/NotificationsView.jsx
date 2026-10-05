import React from 'react';
import { 
  Bell, AlertTriangle, Sparkles, CheckCircle2, Trash2, 
  ArrowLeft, Inbox, Radio, Shield, Zap, Music
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEngine';

export const NotificationsView = ({ setActiveTab }) => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    deleteNotification, 
    clearAllNotifications, 
    sendTestNotification,
    hunterRank
  } = useGame();

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleTestBroadcast = () => {
    sendTestNotification();
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative z-10">
      {/* Top Navigation / Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-[#ffbe3b]/30 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => { sound.playClick(); setActiveTab('home'); }}
            className="p-2 rounded-lg bg-[#181105] border border-[#ffbe3b]/40 text-[#ffd700] hover:bg-[#ffbe3b]/20 transition-all flex items-center space-x-1"
            title="Return to Status Window"
          >
            <ArrowLeft size={16} />
            <span className="text-xs font-mono hidden sm:inline uppercase">RETURN</span>
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-[#ffd700] uppercase tracking-widest px-2 py-0.5 bg-[#261a05] border border-[#ffbe3b]/60 rounded">
                [ SYSTEM LOG ]
              </span>
              <span className="text-xs font-mono text-amber-300">
                {unreadCount > 0 ? `${unreadCount} UNREAD ALERTS` : 'ALL ALERTS READ'}
              </span>
            </div>
            <h2 className="font-cyber text-xl md:text-2xl font-black text-white uppercase gold-glow-text">
              SYSTEM ALERT NOTIFICATIONS
            </h2>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleTestBroadcast}
            className="px-3 py-1.5 rounded bg-[#201504] border border-[#ffd700] text-[#ffd700] hover:bg-[#ffbe3b]/20 text-xs font-mono uppercase tracking-wider transition-all shadow-neon-gold flex items-center space-x-1.5"
            title="Simulate a system alert transmission"
          >
            <Radio size={14} className="text-[#ffd700] animate-pulse" />
            <span className="hidden sm:inline">TEST ALERT</span>
          </button>

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2 sm:px-3 sm:py-1.5 rounded bg-rose-950/40 border border-rose-600/50 text-rose-300 hover:bg-rose-900/60 text-xs font-mono uppercase tracking-wider transition-all flex items-center space-x-1"
              title="Clear all messages to view empty box"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">CLEAR ALL</span>
            </button>
          )}
        </div>
      </div>

      {/* Conditional Rendering: Empty Box vs Notification List */}
      {notifications.length === 0 ? (
        /* 📦 The Empty Box State Requested by User ("if there is no messages exist means it should show empty box there") */
        <div className="relative border-2 border-dashed border-[#ffbe3b]/50 rounded-2xl p-8 md:p-14 text-center bg-[#090602]/90 system-window shadow-neon-gold overflow-hidden animate-fade-in">
          {/* Subtle glowing corner brackets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#ffd700]"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#ffd700]"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#ffd700]"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#ffd700]"></div>

          {/* Central 3D Glowing Empty Box Icon */}
          <div className="relative mx-auto w-24 h-24 rounded-2xl bg-gradient-to-b from-[#221603] to-[#0a0701] border-2 border-[#ffd700] flex items-center justify-center mb-5 shadow-[0_0_25px_rgba(255,215,0,0.3)]">
            <Inbox size={46} className="text-[#ffd700]/70" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ffd700]/40 rounded-full"></div>
          </div>

          <div className="inline-block px-3 py-1 bg-[#1a1104] border border-[#ffbe3b]/60 rounded text-[11px] font-mono text-[#ffd700] uppercase font-bold tracking-widest mb-3">
            [ EMPTY BOX DETECTED ]
          </div>

          <h3 className="font-cyber text-2xl font-black text-white uppercase tracking-wider mb-2 gold-glow-text">
            NO SYSTEM MESSAGES EXIST
          </h3>

          <p className="font-mono text-xs text-amber-200/75 max-w-md mx-auto leading-relaxed mb-6">
            Your dimensional inbox is completely empty. There are currently no unread system alert transmissions, gate warnings, or quest completions in queue.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleTestBroadcast}
              className="px-5 py-2.5 bg-gradient-to-r from-[#e69500] to-[#ffd700] hover:from-[#ffd700] hover:to-[#ffea75] text-black font-cyber font-bold text-xs uppercase tracking-widest rounded-lg shadow-neon-gold transition-all"
            >
              SEND TEST BROADCAST
            </button>

            <button
              onClick={() => { sound.playClick(); setActiveTab('play'); }}
              className="px-5 py-2.5 bg-[#1a1205] hover:bg-[#2c1e08] text-[#ffd700] border border-[#ffbe3b]/50 font-mono text-xs uppercase tracking-wider rounded-lg transition-all"
            >
              BROWSE QUESTS
            </button>
          </div>
        </div>
      ) : (
        /* Populated Notification Cards List */
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs font-mono text-amber-300/80 px-1">
            <span>SHOWING {notifications.length} TRANSMISSIONS</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-[#ffd700] hover:underline uppercase"
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`relative rounded-xl p-4 sm:p-5 border transition-all system-window ${
                notif.unread
                  ? 'bg-[#150f04] border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                  : 'bg-[#0a0702]/80 border-[#ffbe3b]/30 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  {/* Type Icon */}
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    notif.type === 'reward'
                      ? 'bg-[#291e05] border border-[#ffd700] text-[#ffd700]'
                      : notif.type === 'level_up'
                        ? 'bg-purple-950/60 border border-purple-400 text-purple-300'
                        : 'bg-[#1a1204] border border-[#ffbe3b]/50 text-amber-300'
                  }`}>
                    {notif.type === 'reward' ? <Sparkles size={18} /> : 
                     notif.type === 'level_up' ? <Zap size={18} /> : 
                     <Bell size={18} />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-cyber text-sm font-bold text-white uppercase tracking-wider">
                        {notif.title}
                      </h4>
                      {notif.unread && (
                        <span className="px-1.5 py-0.2 bg-[#ffd700] text-black text-[9px] font-mono font-bold rounded">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="font-sans text-xs text-amber-100/90 mt-1.5 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center space-x-3 mt-2 text-[10px] font-mono text-amber-400/60">
                      <span>TIMESTAMP: {notif.timestamp}</span>
                      <span>•</span>
                      <span>CHANNEL: SYSTEM HUD</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1.5 shrink-0">
                  {notif.unread && (
                    <button
                      onClick={() => { sound.playClick(); markNotificationRead(notif.id); }}
                      title="Mark as read"
                      className="p-1.5 rounded hover:bg-[#281b05] text-[#ffd700] transition-colors"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => { sound.playClick(); deleteNotification(notif.id); }}
                    title="Dismiss notification"
                    className="p-1.5 rounded hover:bg-rose-950/40 text-amber-500/60 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
