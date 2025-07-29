/** @type {import('tailwindcss').Config} */
const sharedConfig = require('../../tailwind-config/src/tailwind.config.js');

module.exports = {
  // Use the shared Tailwind configuration
  ...sharedConfig,
  // Add content paths specific to the mobile app
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
};
