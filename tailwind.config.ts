/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dracula'], // or your custom themes
  },
};
