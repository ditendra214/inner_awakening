// Solo Leveling System Audio Synthesizer using Web Audio API
// Accurately reproduces the iconic crystalline ethereal "Ding!" System Message Tone
// Zero external audio files, works instantly in any browser offline.

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.ambientDrone = null;
    this.ambientGain = null;
    this.isDronePlaying = false;
    this.volume = 0.75;
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

  // 🔔 THE ICONIC SOLO LEVELING SYSTEM MESSAGE TONE ("Ding-g-g...")
  // High-resonance ethereal crystal bell with shimmering overtone & dark mana sub undertone
  playSoloLevelingMessageTone() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Crystal High Harmonic Sine (C7: ~2093Hz + slight detune for shimmering bell ring)
      const primaryFreq = 2093; 
      const overtoneFreq = 3136; // G7 harmonic
      const highShimmerFreq = 4186; // C8 crystal sparkle

      const bellFrequencies = [
        { f: primaryFreq, gain: 0.35, decay: 1.8 },
        { f: primaryFreq * 1.004, gain: 0.25, decay: 1.6 }, // detune shimmer
        { f: overtoneFreq, gain: 0.2, decay: 1.2 },
        { f: highShimmerFreq, gain: 0.12, decay: 0.8 },
      ];

      bellFrequencies.forEach(({ f, gain, decay }) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        g.gain.setValueAtTime(gain * this.volume, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(g);
        g.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + decay);
      });

      // 2. Metallic Impulse ping (triangle wave fast transient)
      const attackOsc = this.ctx.createOscillator();
      const attackGain = this.ctx.createGain();
      attackOsc.type = 'triangle';
      attackOsc.frequency.setValueAtTime(1046.5, now); // C6
      attackOsc.frequency.exponentialRampToValueAtTime(523.25, now + 0.08);

      attackGain.gain.setValueAtTime(0.3 * this.volume, now);
      attackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      attackOsc.connect(attackGain);
      attackGain.connect(this.ctx.destination);

      attackOsc.start(now);
      attackOsc.stop(now + 0.08);

      // 3. Ominous Shadow Monarch Sub-bass undertone (~65Hz)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(65.4, now); // C2 low resonance
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.9);

      subGain.gain.setValueAtTime(0.22 * this.volume, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + 0.9);

    } catch (e) {
      console.warn("Audio context not ready yet", e);
    }
  }

  // System Click / HUD Interaction
  playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.5, now); // E6
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.04);

      gain.gain.setValueAtTime(0.18 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  // System Chirp for Navigation
  playChirp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, now); // A6
      osc.frequency.exponentialRampToValueAtTime(2637, now + 0.07); // E7

      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // FitCoins / Golden Mana Crystal Ping
  playCoin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [1318.51, 1760.00, 2093.00]; // E6, A6, C7
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch (e) {}
  }

  // Solo Leveling Ascension / Level Up Fanfare
  playLevelUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      this.playSoloLevelingMessageTone();

      const now = this.ctx.currentTime + 0.1;
      // Majestic ascending player harmonic arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];

      notes.forEach((freq, i) => {
        const startTime = now + i * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2 * this.volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch (e) {}
  }

  // Quest Completed Chime
  playQuestComplete() {
    this.playSoloLevelingMessageTone();
  }

  // Default notification uses the Solo Leveling tone
  playNotification() {
    this.playSoloLevelingMessageTone();
  }

  // Shadow Monarch Atmosphere (Low Binaural Mist Drone)
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

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, now); // low A

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(55.4, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);

      this.ambientDrone = [osc1, osc2];
      this.isDronePlaying = true;
      return true;
    }
  }
}

export const sound = new SoundEngine();
