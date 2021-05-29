import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '../App.vue'
import Mapping from '../views/Mapping.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'App',
    component: App
  },
  {
    path: '/mapping',
    name: 'Mapping',
    component: Mapping
  }
]

const router = new VueRouter({
  routes
})

export default router
