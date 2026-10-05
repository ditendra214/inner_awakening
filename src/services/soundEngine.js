// Solo Leveling System Audio Synthesizer using Web Audio API
// Synthesizes multiple unique system tones (Monarch Crystal Bell, Gate Chime, Shadow Pulse, etc.)
// Zero external audio files, works instantly in any browser offline.

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.ambientDrone = null;
    this.ambientGain = null;
    this.isDronePlaying = false;
    this.volume = 0.75;
    this.currentTone = 'monarch_crystal';
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

  setCurrentTone(toneId) {
    if (toneId) {
      this.currentTone = toneId;
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

  // 🔔 1. MONARCH CRYSTAL BELL (Default Iconic Solo Leveling "Ding-g-g...")
  // High-resonance ethereal crystal bell with shimmering overtone & dark mana sub undertone
  playMonarchCrystal() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const primaryFreq = 2093; // C7
      const overtoneFreq = 3136; // G7
      const highShimmerFreq = 4186; // C8

      const bellFrequencies = [
        { f: primaryFreq, gain: 0.35, decay: 1.8 },
        { f: primaryFreq * 1.004, gain: 0.25, decay: 1.6 },
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

      // Metallic Impulse ping
      const attackOsc = this.ctx.createOscillator();
      const attackGain = this.ctx.createGain();
      attackOsc.type = 'triangle';
      attackOsc.frequency.setValueAtTime(1046.5, now);
      attackOsc.frequency.exponentialRampToValueAtTime(523.25, now + 0.08);
      attackGain.gain.setValueAtTime(0.3 * this.volume, now);
      attackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      attackOsc.connect(attackGain);
      attackGain.connect(this.ctx.destination);
      attackOsc.start(now);
      attackOsc.stop(now + 0.08);

      // Sub-bass undertone
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(65.4, now);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.9);
      subGain.gain.setValueAtTime(0.22 * this.volume, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.9);
    } catch (e) {
      console.warn("Audio context error", e);
    }
  }

  // 🔔 2. DIMENSIONAL GATE CHIME (Explorer Mission Reward)
  // Two-tone ascending crystal chime (A6 -> E7) with cosmic reverb tail
  playGateChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 1760.00, start: 0, decay: 1.4, gain: 0.28 }, // A6
        { f: 2637.02, start: 0.12, decay: 1.9, gain: 0.35 }, // E7
        { f: 3520.00, start: 0.14, decay: 1.5, gain: 0.20 } // A7 shimmer
      ];

      notes.forEach(({ f, start, decay, gain }) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + start);
        g.gain.setValueAtTime(gain * this.volume, now + start);
        g.gain.exponentialRampToValueAtTime(0.0001, now + start + decay);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + decay);
      });

      // Spatial sweep
      const sweepOsc = this.ctx.createOscillator();
      const sweepGain = this.ctx.createGain();
      sweepOsc.type = 'triangle';
      sweepOsc.frequency.setValueAtTime(440, now);
      sweepOsc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      sweepGain.gain.setValueAtTime(0.18 * this.volume, now);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      sweepOsc.connect(sweepGain);
      sweepGain.connect(this.ctx.destination);
      sweepOsc.start(now);
      sweepOsc.stop(now + 0.25);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  // 🔔 3. SHADOW SOVEREIGN PULSE (Kinetic Core Workout Reward)
  // Deep dark mana resonance pulse with rich harmonic sweep & ominous snap
  playShadowPulse() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Deep Shadow Sweep
      const darkOsc = this.ctx.createOscillator();
      const darkGain = this.ctx.createGain();
      darkOsc.type = 'sawtooth';
      darkOsc.frequency.setValueAtTime(140, now);
      darkOsc.frequency.exponentialRampToValueAtTime(55, now + 0.6);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.7);

      darkGain.gain.setValueAtTime(0.35 * this.volume, now);
      darkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      darkOsc.connect(filter);
      filter.connect(darkGain);
      darkGain.connect(this.ctx.destination);
      darkOsc.start(now);
      darkOsc.stop(now + 0.7);

      // Ethereal Mana Ping
      const manaOsc = this.ctx.createOscillator();
      const manaGain = this.ctx.createGain();
      manaOsc.type = 'sine';
      manaOsc.frequency.setValueAtTime(1864.66, now); // A#6
      manaGain.gain.setValueAtTime(0.3 * this.volume, now);
      manaGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      manaOsc.connect(manaGain);
      manaGain.connect(this.ctx.destination);
      manaOsc.start(now);
      manaOsc.stop(now + 1.2);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  // 🔔 4. DRAGON MONARCH'S THUNDER (Cardio Mission Reward)
  // Massive dimensional shockwave with sub-bass impact and sizzling metallic crack
  playMonarchThunder() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Heavy sub drop
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(120, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.8);
      subGain.gain.setValueAtTime(0.45 * this.volume, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.85);

      // High metallic chime crack
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(2489.02, now); // D#7
      chimeGain.gain.setValueAtTime(0.25 * this.volume, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);
      chimeOsc.start(now);
      chimeOsc.stop(now + 0.9);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  // 🔔 5. RULER'S AUTHORITY HARMONY (Zen Recovery Mission Reward)
  // Serene shimmering celestial chord emitted by ancient rulers
  playCelestialHarmonic() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Shimmering major 7th chord: C6, E6, G6, B6
      const chord = [1046.50, 1318.51, 1567.98, 1975.53];

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.18 * this.volume, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 1.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 1.8);
      });
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  // Route tone play based on toneId or current active tone
  playSystemTone(toneId = this.currentTone) {
    switch (toneId) {
      case 'gate_resonance':
        this.playGateChime();
        break;
      case 'shadow_pulse':
        this.playShadowPulse();
        break;
      case 'monarch_thunder':
        this.playMonarchThunder();
        break;
      case 'celestial_harmonic':
        this.playCelestialHarmonic();
        break;
      case 'monarch_crystal':
      default:
        this.playMonarchCrystal();
        break;
    }
  }

  // Universal system message alert plays current selected system tone
  playSoloLevelingMessageTone() {
    this.playSystemTone(this.currentTone);
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

  // Default notification uses the active system tone
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

  // Futuristic Equipment Lock-in Sound
  playEquip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Dual-tone harmonic snap
      [880, 1318.5, 1760].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + i * 0.04;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, start + 0.08);

        gain.gain.setValueAtTime(0.22 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.18);
      });
    } catch (e) {}
  }

  // Equipment Unequip / Detach Sound
  playUnequip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.12);

      gain.gain.setValueAtTime(0.18 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }
}

export const sound = new SoundEngine();
