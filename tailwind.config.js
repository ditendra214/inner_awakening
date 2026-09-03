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
          dark: '#060810',
          card: 'rgba(13, 19, 38, 0.85)',
          panel: 'rgba(18, 27, 54, 0.75)',
          border: 'rgba(0, 240, 255, 0.25)',
          cyan: '#00f0ff',
          pink: '#ff007f',
          green: '#39ff14',
          yellow: '#ffe600',
          amber: '#ff9900',
          blue: '#1e51ff',
          purple: '#9d00ff'
        }
      },
      fontFamily: {
        cyber: ['Orbitron', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
        sans: ['Rajdhani', 'sans-serif']
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.5), 0 0 30px rgba(0, 240, 255, 0.2)',
        'neon-pink': '0 0 15px rgba(255, 0, 127, 0.5), 0 0 30px rgba(255, 0, 127, 0.2)',
        'neon-green': '0 0 15px rgba(57, 255, 20, 0.5), 0 0 30px rgba(57, 255, 20, 0.2)',
        'hud-box': 'inset 0 0 15px rgba(0, 240, 255, 0.15), 0 0 20px rgba(0, 0, 0, 0.8)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-cyan': 'glowCyan 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite'
      },
      keyframes: {
        glowCyan: {
          '0%': { boxShadow: '0 0 5px rgba(0, 240, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.7)' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
