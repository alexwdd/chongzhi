import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Success from './views/Success.vue'
import Fail from './views/Fail.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/success/:order_no',
      name: 'success',
      component: Success
    },
    {
      path: '/fail',
      name: 'fail',
      component: Fail
    }
  ]
})
