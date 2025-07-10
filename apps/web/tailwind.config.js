const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const sharedConfig = require('../../tailwind-config/src/tailwind.config.js');

module.exports = {
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
    },
  },
  plugins: [],
};
