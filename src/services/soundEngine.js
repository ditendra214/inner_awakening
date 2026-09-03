// 2050 Cybernetic Procedural Sound Engine using Web Audio API
// High-performance, zero external assets, instant responsive sci-fi audio design

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.ambientDrone = null;
    this.ambientGain = null;
    this.isDronePlaying = false;
    this.volume = 0.7;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    } else if (!muted && this.ambientGain && this.isDronePlaying) {
      this.ambientGain.gain.setValueAtTime(0.08 * this.volume, this.ctx.currentTime);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.isDronePlaying && !this.isMuted) {
      this.ambientGain.gain.setValueAtTime(0.08 * this.volume, this.ctx.currentTime);
    }
  }

  // Quick tactile cyber click for buttons
  playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      // Audio context might need user interaction first
    }
  }

  // Futuristic high-tech chirp for HUD navigation
  playChirp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc2.type = 'sine';

      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(2200, now + 0.08);

      osc2.frequency.setValueAtTime(700, now);
      osc2.frequency.exponentialRampToValueAtTime(1100, now + 0.08);

      gain.gain.setValueAtTime(0.12 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.09);
      osc2.stop(now + 0.09);
    } catch (e) {}
  }

  // Crystal FitCoin collection ping
  playCoin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [987.77, 1318.51]; // B5 -> E6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.25);
      });
    } catch (e) {}
  }

  // 2050 Cyber Level Up Fanfare
  playLevelUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Ascending major pentatonic cyber chord: C5, E5, G5, B5, C6
      const arpeggio = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];

      arpeggio.forEach((freq, i) => {
        const startTime = now + i * 0.08;
        const osc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        subOsc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        subOsc.frequency.setValueAtTime(freq / 2, startTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, startTime);
        filter.frequency.exponentialRampToValueAtTime(800, startTime + 0.5);

        gain.gain.setValueAtTime(0.22 * this.volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(filter);
        subOsc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        subOsc.start(startTime);
        osc.stop(startTime + 0.6);
        subOsc.stop(startTime + 0.6);
      });
    } catch (e) {}
  }

  // Quest Completed celebratory harmonic sweep
  playQuestComplete() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chords = [
        [587.33, 739.99, 880.00], // D major
        [783.99, 987.77, 1174.66]  // G major
      ];

      chords.forEach((chord, step) => {
        const stepTime = now + step * 0.18;
        chord.forEach((freq) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, stepTime);

          gain.gain.setValueAtTime(0.18 * this.volume, stepTime);
          gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.4);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(stepTime);
          osc.stop(stepTime + 0.4);
        });
      });
    } catch (e) {}
  }

  // Holographic Notification warning/alert (matches wireframe modal alert)
  playNotification() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Dual high-tech alert pulse: 880Hz -> 1760Hz
      const tones = [880, 1760, 880, 1760];
      tones.forEach((tone, i) => {
        const t = now + i * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(tone, t);

        gain.gain.setValueAtTime(0.16 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.08);
      });
    } catch (e) {}
  }

  // Ambient 2050 Cyber Pulse / Reactor Drone
  toggleAmbientDrone() {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isDronePlaying) {
      if (this.ambientGain) {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      }
      setTimeout(() => {
        if (this.ambientDrone) {
          this.ambientDrone.forEach(node => {
            try { node.stop(); } catch (e) {}
          });
          this.ambientDrone = null;
        }
      }, 900);
      this.isDronePlaying = false;
      return false;
    } else {
      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(
        this.isMuted ? 0 : 0.06 * this.volume,
        now + 1.5
      );

      // Low sub bass + binaural detune
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, now); // A1 sub

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(55.6, now); // slight detune for space beat

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.2, now); // 0.2Hz breathing pulse
      lfoGain.gain.setValueAtTime(15, now);

      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      lfo.start(now);

      this.ambientDrone = [osc1, osc2, lfo];
      this.isDronePlaying = true;
      return true;
    }
  }
}

export const sound = new SoundEngine();
