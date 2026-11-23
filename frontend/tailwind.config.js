/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // Primary Brand
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        ai: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          500: '#8B5CF6',
          600: '#7C3AED', // AI Accent
          700: '#6D28D9',
        },
        dark: {
          bg: '#0B0F19',
          surface: '#151C2C',
          elevated: '#1E293B',
          border: '#2D3748',
        },
        light: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          elevated: '#F1F5F9',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-brand': '0 0 20px -5px rgba(79, 70, 229, 0.35)',
        'glow-ai': '0 0 20px -5px rgba(124, 58, 237, 0.35)',
      }
    },
  },
  plugins: [],
};
