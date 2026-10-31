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
        primary: {
          DEFAULT: '#111A14',
          foreground: '#FFFFFF',
        },
        brand: {
          DEFAULT: '#1B7A3F',
          mid: '#6DB36F',
          leaf: '#B5CF8A',
          soft: '#E4F1DF',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#F0873A',
          strong: '#B34A0B',
          soft: '#FFEBD9',
          foreground: '#111A14',
        },
        page: {
          light: '#F3F6F2',
          dark: '#0E1612',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#16221B',
          mutedLight: '#E9F1E6',
          mutedDark: '#1E2D24',
        },
        statusReceived: {
          fill: '#B87800',
          soft: '#FFF1D1',
          text: '#8A5A00',
        },
        statusAssigned: {
          fill: '#2F6FDE',
          soft: '#E3EDFF',
          text: '#1D4FB8',
        },
        statusResolved: {
          fill: '#1E8E5A',
          soft: '#DDF3E4',
          text: '#146B3A',
        },
        statusEscalated: {
          fill: '#D93025',
          soft: '#FDE3E0',
          text: '#B3261E',
        },
      },
      borderRadius: {
        'card': '28px',
        'sheet': '32px',
        'control': '20px',
        'md': '12px',
        'pill': '999px',
      },
      fontFamily: {
        sans: ['"Noto Sans"', '"Noto Sans Gujarati"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'elev0': 'none',
        'elev1': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'elev2': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'elev3': '0 12px 32px rgba(0, 0, 0, 0.16)',
        'elev1-dark': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'elev2-dark': '0 8px 24px rgba(0, 0, 0, 0.55)',
        'elev3-dark': '0 12px 32px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
