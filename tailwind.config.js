/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(500%)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(34, 197, 94, 0.2)' },
          '50%': { boxShadow: '0 0 28px rgba(34, 197, 94, 0.45)' },
        },
      },
    },
  },
  plugins: [],
};
