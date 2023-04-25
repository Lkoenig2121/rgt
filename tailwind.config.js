/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fira Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  darkMode: 'class', // or 'media' or 'class'
  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar-hide')],
};
