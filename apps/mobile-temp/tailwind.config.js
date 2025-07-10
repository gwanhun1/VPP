const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const sharedConfig = require('../../tailwind-config/src/tailwind.config.js');

module.exports = {
  content: [
    join(__dirname, 'src/**/*!(*.stories|*.spec).{ts,tsx,js,jsx}'),
    join(
      __dirname,
      '../../packages/shared-ui/src/**/*!(*.stories|*.spec).{ts,tsx,js,jsx}'
    ), // 공용 UI도 스캔 대상
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      ...sharedConfig.theme.extend, // 중앙 설정 상속
    },
  },
  plugins: [],
};
