const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// 모노레포 설정
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

// 모노레포의 다른 패키지들을 watchFolders에 추가
config.watchFolders = [
  monorepoRoot,
  path.resolve(monorepoRoot, 'shared-ui'),
  path.resolve(monorepoRoot, 'core-logic'),
  path.resolve(monorepoRoot, 'tailwind-config'),
];

// 모노레포 패키지들의 node_modules도 resolver에 추가
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 패키지 exports 사용 및 조건 우선순위 설정
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
  'react-native',
  'development',
  'require',
  'import',
  'default',
];

module.exports = config;
