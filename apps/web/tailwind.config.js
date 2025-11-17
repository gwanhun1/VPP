const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const sharedConfig = require('../../tailwind-config/src/tailwind.config.js');

module.exports = {
  darkMode: 'class',
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
    join(__dirname, '../../shared-ui/src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      ...sharedConfig.theme.extend, // 중앙 설정 상속
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        skeleton: 'skeleton-loading 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
