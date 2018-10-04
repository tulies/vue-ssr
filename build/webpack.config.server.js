const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const VueServerPlugin = require('vue-server-renderer/server-plugin')

const isDev = process.env.NODE_ENV === 'development'

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VUE_ENV': '"server"' // 官方建议我们加的，可能在server render中会用到
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[chunkhash:8].css',
    chunkFilename: '[id].[chunkhash:8].css'
  }),
  new VueLoaderPlugin() //  Vue-loader在15.*之后的版本需要这个插件 vue-loader的使用都是需要伴生 VueLoaderPlugin的.参考官方文档 https://vue-loader.vuejs.org/migrating.html#a-plugin-is-now-required
]

if (!isDev) {
  plugins.push(new VueServerPlugin()) // vue服务端渲染最重要的插件， 能帮我们生成一个单独的json文件
}

const config = merge(baseConfig, {
  target: 'node',
  entry: path.join(__dirname, '../client/serve-entry.js'),
  devtool: 'source-map', // webpack4中貌似不需要
  output: {
    libraryTarget: 'commonjs2', //  用来指定模块引用方式
    filename: 'server-entry.js',
    path: path.join(__dirname, '../server-build'),
    publicPath: '/public/'
  },
  externals: Object.keys(require('../package.json').dependencies), // 不要去打包这部分文件，node端直接引用不需要打包，浏览器端才会去打包
  module: {
    rules: [
      {
        test: /\.styl/,
        oneOf: [
          // 这里匹配 `<style module>`
          {
            resourceQuery: /module/,
            use: [
              // 'vue-style-loader',
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[local]_[hash:base64:5]',
                  camelCase: true
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true
                }
              },
              'stylus-loader'
            ]
          },
          // 这里匹配普通的 `<style>` 或 `<style scoped>`
          {
            use: [
              // 'vue-style-loader',
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true
                }
              },
              'stylus-loader'
            ]
          }
        ]
      }
    ]
  },
  // 服务端渲染 不给这样。。。。必须要单一文件
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all'
  //     // minChunks: 2 // 最小 chunk ，默认1
  //   },
  //   runtimeChunk: true
  // },
  plugins
})

module.exports = config
