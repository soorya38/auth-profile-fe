/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './constants/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        midnight: '#0F172A',
        lagoon: '#34D399',
        mint: '#5EEAD4',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '68rem',
        card: '36rem',
      },
    },
  },
  plugins: [],
};
