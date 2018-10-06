const Koa = require('koa')
const send = require('koa-send')
const koaBody = require('koa-body')
const app = new Koa()
const path = require('path')
const staticRouter = require('./routers/static')
const apiRouter = require('./routers/api')

const createDb = require('./db/db')
const config = require('../app.config')

const db = createDb(config.db.appId, config.db.appKey)
const isDev = process.env.NODE_ENV === 'development'

// 处理静态资源 public目录
app.use(staticRouter.routes()).use(staticRouter.allowedMethods())

// 处理favicon找不到的问题
app.use(async (ctx, next) => {
  if (ctx.path === '/favicon.ico') {
    await send(ctx, '/favicon.ico', { root: path.join(__dirname, '../') })
  } else {
    await next()
  }
})

app.use(async (ctx, next) => {
  try {
    console.log(`request with path ${ctx.path}`)
    await next()
  } catch (err) {
    console.log(err)
    ctx.status = 500
    if (isDev) {
      ctx.body = err.message
    } else {
      ctx.body = 'please try again laters'
    }
  }
})

/** 把db添加到ctx中 */
app.use(koaBody())
app.use(async (ctx, next) => {
  ctx.db = db
  await next()
})
/** 这个要优先pageRouter进行匹配 */
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())

let pageRouter
if (isDev) {
  pageRouter = require('./routers/dev-ssr')
} else {
  pageRouter = require('./routers/ssr')
}
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333

app.listen(PORT, HOST, () => {
  console.log(`server is listening on ${HOST}:${PORT}`)
})
