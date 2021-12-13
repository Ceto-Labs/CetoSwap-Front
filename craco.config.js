/**
 * date: 2021-09-01
 * author: chuchengxiang
 * description: craco config
 */
const webpack = require('webpack')
const path = require('path')
const CracoLessPlugin = require('craco-less')

module.exports = {
  webpack: {
    alias: {
      canister: path.join(__dirname, '/src/server'),
      '@': path.join(__dirname, '/src'),
      '@assets': path.join(__dirname, '/src/assets')
    }
  },
  devServer: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {},
            javascriptEnabled: true
          }
        }
      }
    }
  ]
}
