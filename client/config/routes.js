import Todo from '../views/todo/todo.vue'
import Login from '../views/login/login.vue'

export default [
  {
    path: '/',
    redirect: '/app'
  },
  {
    // path: '/app/:id',
    // props: (route) => ({ id: route.query.p }),
    path: '/app',
    component: Todo,
    // component: () => import('../views/todo/todo.vue'), // 异步载入组件，需要安装插件支持，npm i babel-plugin-syntax-dynamic-import； 另外在.sbabelrc中要把插件加进去
    // component: () => import(/* webpackChunkName: "todo-view" */ '../views/todo/todo.vue'),
    // components: {
    //   default: xxxx,
    //   a: Todo,
    // },
    name: 'app',
    meta: { // 通过.meta拿到
      title: 'this is app',
      description: 'asass'
    },
    beforeEnter (to, from, next) {
      console.log('app route before enter')
      next()
    }
    // children:[] // 配置子路由用
  },
  {
    path: '/login',
    component: Login
  }
]
