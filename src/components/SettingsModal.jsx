import React, { useState } from 'react';
import { 
  X, Volume2, VolumeX, Monitor, Sliders, Bell, Eye, Check
} from 'lucide-react';
import { sound } from '../services/soundEngine';

export const SettingsModal = ({ isOpen, onClose }) => {
  const [musicVol, setMusicVol] = useState(70);
  const [sfxVol, setSfxVol] = useState(85);
  const [graphicsQuality, setGraphicsQuality] = useState('HIGH');
  const [targetFps, setTargetFps] = useState('60');
  const [notifications, setNotifications] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="w-full max-w-lg p-6 rounded-3xl bg-[#0b0f1d] border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.3)] relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
              ⚙️
            </div>
            <div>
              <h3 className="font-cyber font-black text-base text-white uppercase tracking-wider gold-glow-text">
                CLIENT SETTINGS
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">Audio, Visual Fidelity, and System Options</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Audio Sliders */}
        <div className="space-y-3">
          <div className="text-xs font-cyber text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Volume2 className="w-3.5 h-3.5" />
            <span>AUDIO CONFIGURATION</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Master SFX Volume</span>
              <span className="text-amber-400 font-bold">{sfxVol}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVol}
              onChange={(e) => setSfxVol(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>Atmospheric Music Volume</span>
              <span className="text-amber-400 font-bold">{musicVol}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVol}
              onChange={(e) => setMusicVol(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
        </div>

        {/* Graphics Options */}
        <div className="space-y-3">
          <div className="text-xs font-cyber text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Monitor className="w-3.5 h-3.5" />
            <span>DISPLAY & GRAPHICS FIDELITY</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {['LOW', 'MEDIUM', 'HIGH', 'ULTRA'].map(q => (
              <button
                key={q}
                onClick={() => {
                  sound.playClick();
                  setGraphicsQuality(q);
                }}
                className={`py-2 rounded-xl text-[10px] font-cyber font-bold tracking-wider uppercase border transition-all ${
                  graphicsQuality === q
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs text-slate-300 font-mono">Fullscreen Game Mode</span>
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-300 text-xs font-cyber font-bold uppercase"
            >
              TOGGLE FULLSCREEN
            </button>
          </div>
        </div>

        {/* Notifications & Toggles */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-xs text-slate-300 font-mono">System Notifications & Alerts</span>
          <button
            onClick={() => {
              sound.playClick();
              setNotifications(!notifications);
            }}
            className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
              notifications ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md" />
          </button>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-cyber text-xs font-black uppercase tracking-wider"
        >
          SAVE & CLOSE
        </button>
      </div>
    </div>
  );
};
