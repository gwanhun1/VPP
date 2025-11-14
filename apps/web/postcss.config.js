const path = require('path');

module.exports = {
  plugins: {
    tailwindcss: {
      // 웹 앱 전용 Tailwind 설정을 명시적으로 사용
      config: path.join(__dirname, 'tailwind.config.js'),
    },
    autoprefixer: {},
  },
};
