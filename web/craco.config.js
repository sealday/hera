const CracoLessPlugin = require('craco-less');
const updateVersion = require('./update-version')

const isProduction = process.env.NODE_ENV === 'production'
// 构建时期,额外操作,生产环境会自动更新版本时间
if (isProduction) {
  updateVersion.updateVersionTime()
}

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
  webpack: {
    configure: webpackConfig => {
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        fallback: {
          fs: false,
          crypto: false,
        },
      }
      return webpackConfig
    },
  },
}


