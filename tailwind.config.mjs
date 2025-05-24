/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#121212',
          secondary: '#1e1e1e',
          accent: '#2d2d2d',
          text: '#e0e0e0',
          muted: '#a0a0a0',
          highlight: '#3a3a3a'
        },
        gradient: {
          start: '#1a1a2e',
          mid: '#16213e',
          end: '#0f3460'
        },
        accent: {
          primary: '#121212',
          secondary: '#1e1e1e'
        }
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        glow: 'glow 0.5s ease-in-out'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        glow: {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(255, 255, 255, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)' }
        }
      }
    },
  },
  plugins: [],
}
