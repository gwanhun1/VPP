/** @type {import('tailwindcss').Config} */
const sharedConfig = require('../../tailwind-config/src/tailwind.config.js');

module.exports = {
  ...sharedConfig,
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
};
