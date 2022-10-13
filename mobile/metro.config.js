/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');
const { getMetroTools } = require("react-native-monorepo-tools");
const monorepoMetroTools = getMetroTools();

module.exports = {
  watchFolders: monorepoMetroTools.watchFolders,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
