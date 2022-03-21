'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const axios = require('axios')
const poolName = process.env.POOL_NAME
const readEnv = require('./read-env')
const envLocal = readEnv('../.env.local')

let userConfig

try {
  userConfig = require(`../src/${poolName}/config/index.json`)
} catch (ex) {
  userConfig = require(`../src/config.js`)
}

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true
    } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        ...require('../config/dev.env'),
        ...envLocal
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
})

const webUrl = userConfig.WEB_URL || userConfig.BASE_API

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      axios.get(webUrl)
        .then((cdnHtml) => {
          // console.log('cdnHtml', cdnHtml)

          // publish the new Port, necessary for e2e tests
          process.env.PORT = port
          // add port to devServer config
          devWebpackConfig.devServer.port = port

          // Add HtmlWebpackPlugin
          devWebpackConfig.plugins.push(
            // https://github.com/ampedandwired/html-webpack-plugin
            new HtmlWebpackPlugin({
              filename: 'index.html',
              templateContent: cdnHtml.data
                // css调整
                .replace(/(\<link href=)([^\s\>]+)/g, ($0, $1, $2) => {
                  return $1 + (/(^http|^\/\/)/.test($2) ? $2 : webUrl + '/' + $2)
                })
                // 内部js调整
                .replace(/(function\(\w,\w\)\{return Object\.prototype\.hasOwnProperty\.call\(\w,\w\)\},\w\.\w=)"([^"])*?"/g, ($0, $1, $2) => {
                  return $1 + '"' + (/(^http|^\/\/)/.test($2) ? $2 : webUrl) + '"'
                })
                // js调整
                .replace(/(\<script src=)([^\s\>]+)/g, ($0, $1, $2) => {
                  return $1 + (/(^http|^\/\/)/.test($2) ? $2 : webUrl + '/' + $2)
                })
                .replace(/\<title\>([\s\S]*?)\<\/title\>([\s\S]*?)\<link rel="shortcut icon"/, ($0, $1, $2) => {
                  const allPreloadJs = $2.split('/static/tinymce4.7.5/tinymce.min.js></script>')
                  const preloadJsStr = allPreloadJs[0] + '/static/tinymce4.7.5/tinymce.min.js></script>'

                  return `<title>开发环境[${poolName}]-配置Config[${userConfig.env}]-${$1}</title>${preloadJsStr}<script>window.isStatic = true;</script><link rel="shortcut icon"`
                }),
              inject: 'head'
            })
          )

          // Add FriendlyErrorsPlugin
          devWebpackConfig.plugins.push(
            new FriendlyErrorsPlugin({
              compilationSuccessInfo: {
                messages: [
                  `Your application is running here: http://${
                  devWebpackConfig.devServer.host
                }:${port}`
                ]
              },
              onErrors: config.dev.notifyOnErrors ?
                utils.createNotifierCallback() : undefined
            })
          )

          resolve(devWebpackConfig)
        })
        .catch(reject)
    }
  })
})
