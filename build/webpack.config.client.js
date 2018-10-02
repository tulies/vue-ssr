const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'
let config
const devServer = {
  port: 8000,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  hot: true
  // historyFallback: {
  // },
  // open: true,
}
const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODEE_ENV: isDev ? 'development' : 'production'
    }
  }),
  new HTMLPlugin(),
  new VueLoaderPlugin() //  Vue-loader在15.*之后的版本都是 vue-loader的使用都是需要伴生 VueLoaderPlugin的.参考官方文档 https://vue-loader.vuejs.org/migrating.html#a-plugin-is-now-required
]

if (isDev) {
  config = merge(baseConfig, {
    module: {
      rules: [{
        test: /\.styl(us)?$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[path][name]-[hash:base64:5]',
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
          {
            use: [
              'vue-style-loader',
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

      }]
    },
    // devTool: '#cheap-modsule-eval-source-map',  // webpack4中貌似不需要
    devServer,
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin()
      // new webpack.NoEmitOnErrorsPlugin()  // 4.x中取消了
    ])
  })
} else {
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../client/index.js')
    },
    output: {
      filename: '[name].[chunkhash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.styl(us)?$/,
          oneOf: [
            {
              resourceQuery: /module/,
              use: ExtractPlugin.extract({
                fallback: 'vue-style-loader',
                use: [
                  {
                    loader: 'css-loader',
                    options: {
                      modules: true,
                      localIdentName: '[hash:base64:5]',
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
              })
            },
            {
              use: ExtractPlugin.extract({
                fallback: 'vue-style-loader',
                use: [
                  'css-loader',
                  {
                    loader: 'postcss-loader',
                    options: {
                      sourceMap: true
                    }
                  },
                  'stylus-loader'
                ]
              })
            }
          ]

        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: true
    },
    plugins: defaultPlugins.concat([
      new ExtractPlugin('styles.[hash:8].css') // 4.x 对应的 "extract-text-webpack-plugin": "^4.0.0-beta.0",好像没有contentHash
    ])
  })
}

module.exports = config
