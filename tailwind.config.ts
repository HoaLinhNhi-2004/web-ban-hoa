import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Fonts ──────────────────────────────────
      fontFamily: {
        sans    : ['var(--font-inter)', 'sans-serif'],
        display : ['var(--font-playfair)', 'serif'],
      },

      // ── Brand Colors ───────────────────────────
      colors: {
        primary   : '#E8738A',
        secondary : '#F9B9C5',
        accent    : '#FF4D6D',
        surface   : '#FFFFFF',
        border    : '#F0E4E7',
        muted     : '#9CA3AF',
        danger    : '#EF4444',
        success   : '#22C55E',
        warning   : '#F59E0B',
        // Nền trang
        background: '#FFFAF9',
      },

      // ── Background ─────────────────────────────
      backgroundColor: {
        DEFAULT: '#FFFAF9',
      },

      // ── Border Radius ──────────────────────────
      borderRadius: {
        sm  : '4px',
        md  : '8px',
        lg  : '12px',
        xl  : '16px',
        '2xl': '20px',
        full: '9999px',
      },

      // ── Container ──────────────────────────────
      maxWidth: {
        container: '1280px',
        prose    : '768px',
      },

      // ── Box Shadow ─────────────────────────────
      boxShadow: {
        card  : '0 2px 8px rgba(232, 115, 138, 0.08)',
        'card-hover': '0 8px 24px rgba(232, 115, 138, 0.16)',
        nav   : '0 1px 0 rgba(240, 228, 231, 0.8)',
      },
    },
  },
  plugins: [],
}

export default config