/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css}',
    './src/components/**/*.{js,ts,jsx,tsx,css}',
    './src/pages/**/*.{js,ts,jsx,tsx,css}'
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
          primary: '#4361ee',
          secondary: '#3f37c9',
          success: '#4cc9f0',
          warning: '#f72585',
          info: '#480ca8'
        },
        'gradient-start': 'rgba(117, 101, 239, 1)',
        'gradient-end': 'rgba(117, 101, 239, 0.8)',
        'dark-primary': '#1a1a1a',
        'dark-secondary': '#242424',
        'dark-accent': '#333333',
        'dark-highlight': '#444444',
        'dark-text': '#e0e0e0',
        'dark-muted': '#a0a0a0',
        'accent-primary': '#7565ef',
        'accent-secondary': '#8b77ff',
        'accent-info': '#6655e0',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-custom': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(to right, #1a1a2e, #16213e, #0f3460)',
        'gradient-dark-alt': 'linear-gradient(135deg, rgba(117, 101, 239, 0.1) 0%, rgba(117, 101, 239, 0) 100%)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(67, 97, 238, 0.5)',
        'inner-glow': 'inset 0 0 8px rgba(67, 97, 238, 0.3)'
      },
      scrollbar: {
        thin: '2px',
        normal: '6px',
        thick: '8px',
      },
      scrollbarColor: {
        dark: '#333333',
        light: '#666666',
      }
    },
  },
  plugins: [],
};