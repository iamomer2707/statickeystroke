/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Refined Premium Dark — Linear / Vercel inspired.
        // Token names kept under `cyber-*` so existing components don't churn.
        cyber: {
          black: '#0a0a0c',     // root bg
          dark: '#101013',      // body
          darker: '#0c0c0f',    // depressions
          card: '#15151a',      // surfaces
          border: '#23232c',    // hairline borders
          primary: '#a78bfa',   // violet — primary accent
          secondary: '#22d3ee', // cyan — secondary accent
          accent: '#f472b6',    // pink — tertiary accent
          success: '#34d399',   // emerald
          warning: '#fbbf24',   // amber
          danger: '#f87171',    // rose
          text: '#f5f5f7',      // primary text (off-white)
          muted: '#8a8a96',     // secondary text
        },
      },
      fontFamily: {
        cyber: ['Inter', 'system-ui', 'sans-serif'],   // display now uses Inter at heavy weight
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tightest': '-0.04em',
      },
      animation: {
        'aurora': 'aurora 20s ease infinite',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-soft': 'pulse-soft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'caret': 'caret 1.05s steps(2) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'aurora': {
          '0%, 100%': { transform: 'translate3d(-10%, -8%, 0) scale(1.1)' },
          '50%': { transform: 'translate3d(10%, 8%, 0) scale(1.2)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'caret': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #a78bfa 0%, #22d3ee 100%)',
        'cyber-gradient-subtle': 'linear-gradient(135deg, rgba(167,139,250,0.10) 0%, rgba(34,211,238,0.10) 100%)',
        'aurora-violet': 'radial-gradient(circle at 30% 20%, rgba(167,139,250,0.25), transparent 60%)',
        'aurora-cyan': 'radial-gradient(circle at 70% 80%, rgba(34,211,238,0.20), transparent 60%)',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.08)',
        'lift': '0 4px 16px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)',
        'glow-violet': '0 0 0 1px rgba(167,139,250,0.4), 0 8px 24px rgba(167,139,250,0.18)',
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
