import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Mapping from '../components/Mapping.vue'
import Maps from '../components/Maps.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/mapping',
    name: 'Mapping',
    component: Mapping
  },
  {
    path: '/map',
    name: 'Map',
    component: Maps,
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
