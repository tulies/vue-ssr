module.exports = (isDev) => {
  return {
    preserveWhitepace: true,
    // extractCSS: !isDev, // 只在生产环境才这么做，v15.x中好像已经没有这个配置了。。。https://vue-loader.vuejs.org/zh/migrating.html#css-%E6%8F%90%E5%8F%96
    // v15.x已经不在这配置了，要再css-loader中配置，比较不太好用 https://vue-loader.vuejs.org/zh/migrating.html#css-modules
    // cssModules:{
    //   modules: true,
    //   localIdentName: '[path]-[name]-[hash:base64:5]',
    //   camelCase: true
    // },
  }
}