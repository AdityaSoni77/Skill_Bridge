/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#081A31', 900: '#0E2A4D', 800: '#143A69', 700: '#17457E',
          600: '#245C9E', 500: '#2E6BC4', 100: '#DCE8F8', 50: '#EAF1FB',
        },
        saffron: { 600: '#B96D0C', 500: '#E08A18', 300: '#F3C179', 50: '#FDF2E1' },
        canvas: '#F6F7F9',
        hairline: '#E4E7EC',
        ink: { 900: '#111927', 700: '#344054', 500: '#667085', 400: '#98A2B3' },
        gap: { high: '#C0392B', mid: '#B45309', ready: '#1F8A5B' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-sm': ['2rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16,24,40,0.04)',
        pop: '0 8px 24px -6px rgba(16,24,40,0.12), 0 2px 6px -2px rgba(16,24,40,0.06)',
      },
      borderRadius: { xl: '12px', '2xl': '16px' },
      keyframes: {
        'draw-in': { from: { strokeDashoffset: 'var(--dash-from)' }, to: { strokeDashoffset: 'var(--dash-to)' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        'draw-in': 'draw-in 1.1s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-up': 'fade-up .28s ease-out both',
      },
    },
  },
  plugins: [],
}
