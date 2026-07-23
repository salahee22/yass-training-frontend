/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C8A84B',
          light: '#E8C86A',
          dark: '#A8883B',
        },
        bg: {
          DEFAULT: '#0A0A0A',
          surface: '#141414',
          surface2: '#1E1E1E',
        },
      },
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
