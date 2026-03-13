/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"IBM Plex Mono"', '"Courier New"', 'Courier', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#0a0a0a',
          fg: '#e0e0e0',
          dim: '#666666',
          border: '#333333',
          accent: '#ffffff',
        },
      },
      animation: {
        blink: 'blink 1.2s step-end infinite',
        scanline: 'scanline 8s linear infinite',
        fadeIn: 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
