import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Fonts ──────────────────────────────────
      fontFamily: {
        sans   : ['var(--font-be-vietnam)', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
      },

      // ── Brand Colors ───────────────────────────
      colors: {
        primary   : '#A85448',
        secondary : '#F7F1EC',
        accent    : '#A85448',
        surface   : '#FFFDF9',
        border    : 'rgba(195,130,120,0.18)',
        muted     : 'rgba(30,23,20,0.45)',
        danger    : '#EF4444',
        success   : '#22C55E',
        warning   : '#F59E0B',
        background: '#FAF8F5',
      },

      // ── Border Radius ──────────────────────────
      borderRadius: {
        sm  : '2px',
        md  : '4px',
        lg  : '6px',
        xl  : '8px',
        '2xl': '10px',
        full: '9999px',
      },

      // ── Container ──────────────────────────────
      maxWidth: {
        container: '1280px',
        prose    : '768px',
      },

      // ── Box Shadow ─────────────────────────────
      boxShadow: {
        card      : 'none',
        'card-hover': 'none',
        nav       : '0 1px 0 rgba(195,130,120,0.18)',
      },
    },
  },
  plugins: [],
}

export default config
