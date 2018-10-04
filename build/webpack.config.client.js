const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const VueClientPlugin = require('vue-server-renderer/client-plugin')

const isDev = process.env.NODE_ENV === 'development'
let config

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODEE_ENV: isDev ? 'development' : 'production'
    }
  }),
  new HTMLPlugin({
    template: path.join(__dirname, 'template.html'),
    inject: true
  }),
  new VueClientPlugin(), // 生成manifest文件用
  new VueLoaderPlugin() //  Vue-loader在15.*之后的版本都是 vue-loader的使用都是需要伴生 VueLoaderPlugin的.参考官方文档 https://vue-loader.vuejs.org/migrating.html#a-plugin-is-now-required
]
const devServer = {
  port: 8000,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  hot: true,
  historyApiFallback: {
    index: '/public/index.html' // 如果output中配置了publicPath,那么这边前面也要加上publicPath
  }
  // open: true,
}

if (isDev) {
  config = merge(baseConfig, {
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
    // devTool: '#cheap-modsule-eval-source-map',  // webpack4中貌似不需要
    devServer,
    plugins: defaultPlugins.concat([
      // new MiniCssExtractPlugin('styles.[hash:8].css'),
      new MiniCssExtractPlugin({
        filename: '[name].[chunkhash:8].css',
        chunkFilename: '[id].[chunkhash:8].css'
      }),
      new webpack.HotModuleReplacementPlugin()
      // new webpack.NoEmitOnErrorsPlugin()  // 4.x中取消了
    ])
  })
} else {
  config = merge(baseConfig, {
    output: {
      filename: '[name].[chunkhash:8].js',
      publicPath: '/public/'
    },
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
    optimization: {
      splitChunks: {
        chunks: 'all'
        // minChunks: 1 // 最小 chunk ，默认1
      },
      runtimeChunk: true
    },
    plugins: defaultPlugins.concat([
      new MiniCssExtractPlugin({
        filename: '[name].[chunkhash:8].css',
        chunkFilename: '[id].[chunkhash:8].css'
      })
      // new ExtractPlugin('styles.[hash:8].css') // 4.x 对应的 "extract-text-webpack-plugin": "^4.0.0-beta.0",好像没有contentHash
    ])
  })
}

module.exports = config
