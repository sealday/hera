const CracoLessPlugin = require('craco-less');
const updateVersion = require("./update-version")
// 构建时期,额外操作, 自动更新版本时间
updateVersion.updateVersionTime()

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};


