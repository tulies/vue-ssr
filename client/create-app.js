import Vue from 'vue'
// import Vuex from 'vuex'
import Meta from 'vue-meta'
import App from './app.vue'
import createRouter from './config/router'

import './assets/styles/global.styl'

Vue.use(Meta)

export default () => {
  const router = createRouter()
  const app = new Vue({
    router,
    render: h => h(App)
  })
  return { app, router }
}
