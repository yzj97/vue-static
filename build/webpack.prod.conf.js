'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const poolName = process.env.POOL_NAME

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

let assetsRoot = config.build.assetsRoot
let assetsPublicPath = config.build.assetsPublicPath
let modulePath = `modules/${poolName}/`
let filename = utils.assetsPath(`${modulePath}js/[name].[chunkhash:8].js`)

const env = require('../config/prod.env')

// For NamedChunksPlugin
const seen = new Set()
const nameLength = 4

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    publicPath: assetsPublicPath,
    path: assetsRoot,
    library: poolName,
    filename,
    chunkFilename: utils.assetsPath(`${modulePath}js/[name].[chunkhash:8].js`)
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath(`${modulePath}css/[name].[chunkhash:8].css`),
      chunkFilename: utils.assetsPath(`${modulePath}css/[name].[chunkhash:8].css`)
    }),
    // keep chunk.id stable when chunk has no name
    new webpack.NamedChunksPlugin(chunk => {
      if (chunk.name) {
        return chunk.name
      }
      const modules = Array.from(chunk.modulesIterable)
      if (modules.length > 1) {
        const hash = require('hash-sum')
        const joinedHash = hash(modules.map(m => m.id).join('_'))
        let len = nameLength
        while (seen.has(joinedHash.substr(0, len))) len++
        seen.add(joinedHash.substr(0, len))
        return `chunk-${joinedHash.substr(0, len)}`
      } else {
        return modules[0].id
      }
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin()
  ],
  optimization: {
    splitChunks: {
      // chunks: 'all',
      cacheGroups: {
        // libs: {
        //   name: 'chunk-libs',
        //   test: /[\\/]node_modules[\\/]/,
        //   priority: 10,
        //   chunks: 'initial' // 只打包初始时依赖的第三方
        // },
        // elementUI: {
        //   name: 'chunk-elementUI', // 单独将 elementUI 拆包
        //   priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
        //   test: /[\\/]node_modules[\\/]element-ui[\\/]/
        // },
        // commons: {
        //   name: 'chunk-commons',
        //   test: resolve('src/components'), // 可自定义拓展你的规则
        //   minChunks: 3, // 最小公用次数
        //   priority: 5,
        //   reuseExistingChunk: true
        // }/* ,
        // components: {
        //   name: 'chunk-packages-components',
        //   test: resolve('packages/components'), // 可自定义拓展你的规则
        // } */,
        lang: {
          name: 'chunk-packages-lang',
          test: resolve('packages/lang'), // 可自定义拓展你的规则
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: {
            safari10: true
          }
        },
        sourceMap: config.build.productionSourceMap,
        cache: true,
        parallel: true
      }),
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSAssetsPlugin()
    ]
  }
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' + config.build.productionGzipExtensions.join('|') + ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

webpackConfig.externals = {
  vue: 'Vue'
}

if (config.build.generateAnalyzerReport || config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin

  if (config.build.bundleAnalyzerReport) {
    webpackConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerPort: 8080,
        generateStatsFile: false
      })
    )
  }

  if (config.build.generateAnalyzerReport) {
    webpackConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: false
      })
    )
  }
}

module.exports = webpackConfig
