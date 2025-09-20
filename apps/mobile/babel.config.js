module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated 4 requires Worklets Babel plugin to run before reanimated plugin
      'react-native-worklets/plugin',
    ],
  };
};
