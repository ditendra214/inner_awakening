/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#05070e',
          card: 'rgba(18, 14, 6, 0.85)',
          panel: 'rgba(25, 19, 8, 0.75)',
          border: 'rgba(255, 191, 0, 0.35)',
          cyan: '#ffbe3b', // solo leveling gold
          pink: '#f59e0b',
          green: '#ffd700',
          yellow: '#fff275',
          amber: '#e69500',
          blue: '#1e3a8a',
          purple: '#d97706',
          gold: '#ffd700',
          systemGold: '#ffbe3b',
          shadowNavy: '#070b16'
        }
      },
      fontFamily: {
        cyber: ['Orbitron', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
        sans: ['Rajdhani', 'sans-serif']
      },
      boxShadow: {
        'neon-gold': '0 0 15px rgba(255, 191, 0, 0.45), 0 0 35px rgba(255, 191, 0, 0.15)',
        'neon-cyan': '0 0 15px rgba(255, 191, 0, 0.45), 0 0 35px rgba(255, 191, 0, 0.15)',
        'neon-pink': '0 0 15px rgba(245, 158, 11, 0.45), 0 0 35px rgba(245, 158, 11, 0.15)',
        'neon-green': '0 0 15px rgba(255, 215, 0, 0.45), 0 0 35px rgba(255, 215, 0, 0.15)',
        'system-window': '0 0 25px rgba(255, 191, 0, 0.25), inset 0 0 15px rgba(255, 191, 0, 0.08)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-gold': 'glowGold 2s ease-in-out infinite alternate',
        'system-flicker': 'systemFlicker 4s infinite'
      },
      keyframes: {
        glowGold: {
          '0%': { boxShadow: '0 0 8px rgba(255, 191, 0, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(255, 191, 0, 0.7)' }
        },
        systemFlicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.92 }
        }
      }
    },
  },
  plugins: [],
}
