/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50:  '#FFF8F0',
          100: '#FEF0DC',
          200: '#FCDDB8',
          300: '#F8C48A',
          400: '#F2A55A',
          500: '#E8883A',
          600: '#C96C28',
          700: '#8B5E3C',
          800: '#6B4229',
          900: '#4A2D18',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
