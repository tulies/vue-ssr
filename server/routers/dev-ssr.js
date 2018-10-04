const Router = require('koa-router')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const MemoryFs = require('memory-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')
const serverRender = require('./server-render')
const serverConfig = require('../../build/webpack.config.server')

// 1.要再node环境中编译webpack，要让webpack跑起来。
const serverCompiler = webpack(serverConfig)
// 生成服务端渲染时要用到的bundle
const mfs = new MemoryFs() // memory-fs跟node中的fs是一样，只是他是把文件写入内存中，不会写到磁盘中。
serverCompiler.outputFileSystem = mfs // 指定输出目录是在mfs中
let bundle
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.log(warn))

  const bundlePath = path.join(
    serverConfig.output.path, // 指定bundle文件输出的文件路径
    'vue-ssr-server-bundle.json' // VueServerPlugin中指定的filename，默认为vue-ssr-server-bundle.json
  )
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  console.log('new bundle generate')
})

const handleSSR = async (ctx) => {
  if (!bundle) {
    ctx.body = '你等一会，别着急......'
    return
  }

  const clientManifestResp = await axios.get('http://127.0.0.1:8000/public/vue-ssr-client-manifest.json')

  const clientManifest = clientManifestResp.data

  const template = fs.readFileSync(
    path.join(__dirname, '../server.template.ejs'),
    'utf-8'
  )

  const renderer = VueServerRenderer.createBundleRenderer(bundle, {
    inject: false, // 不指定官方的模板，不需要按照官方自动处理，限制太大。我们自己处理就好。
    clientManifest
  })

  await serverRender(ctx, renderer, template)
}

const router = new Router()
router.get('*', handleSSR)

module.exports = router
