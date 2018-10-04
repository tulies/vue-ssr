import createApp from './create-app'

export default context => {
  return new Promise((resolve, reject) => {
    const { router, app } = createApp()
    router.push(context.url)
    router.onReady(() => { // 路由所有异步操作都做完之后才会执行这个操作
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject(new Error('no component matched'))
      }
      context.meta = app.$meta()
      resolve(app)
    })
  })
}
