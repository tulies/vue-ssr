import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

export default () => {
  return new VueRouter({
    routes,
    mode: 'history',
    // base: '/base/',
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'exact-active-link'
    // scrollBehavior (to, from, savedPosition) {
    //   console.log(to, from, savedPosition)
    //   if (savedPosition) {
    //     return savedPosition
    //   } else {
    //     return { x: 0, y: 0 }
    //   }
    // },
    // fallback: true // 为了适配history路由模式。默认为true
    // parseQuery (query) {

    // },
    // stringifyQuery (queryobj) {

    // }
  })
}
