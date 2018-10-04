import Vue from 'vue'
// import VueRouter from 'vue-router'
// import Vuex from 'vuex'
import App from './app.vue'
import './assets/styles/global.styl'
import createRouter from './config/router'
// import creatStore from './store/store'

// Vue.use(Vuex)
// Vue.use(VueRouter)

// const root = document.createElement('div')
// document.body.appendChild(root)

const router = createRouter()
// const store = creatStore()

router.beforeEach((to, from, next) => {
  console.log('before each invoked')
  // 可以在这里面做权限验证啥的
  // next('/login')
  next()
})
router.beforeResolve((to, from, next) => {
  console.log('before resolve invoked')
  next()
})
router.afterEach((to, from) => {
  console.log('after each invoked')
})

new Vue({
  router,
  // store,
  render: (h) => h(App)
}).$mount('#root')
