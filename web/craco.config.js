const CracoLessPlugin = require('craco-less')
const updateVersion = require('./update-version')
const Dotenv = require('dotenv-webpack')

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
    plugins: {
      add: [
        new Dotenv({
          path: '.env.local',
          safe: true,
          systemvars: true,
          silent: true,
          expand: true,
          defaults: false,
        }),
      ],
    },
    configure: webpackConfig => {
      // if (!isProduction) {
      //   webpackConfig.devtool = 'eval-cheap-module-source-map'
      // }
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
  devServer: (devServerConfig, { proxy }) => ({
    ...devServerConfig,
    proxy: (proxy || []).map(item => ({
      ...item,
      target: process.env.REACT_APP_PROXY || item.target,
    })),
  }),
}
