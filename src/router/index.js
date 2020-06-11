import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/users/Users'
import Rights from '../components/porwer/Rights'
import Roles from '../components/porwer/Roles'
import Cate from '../components/goods/Cate'
import CateParams from '../components/goods/CateParams'
import Goods from '../components/goods/Goods'
import AddGood from '../components/goods/AddGood'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path:'/login',
      component:Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children:[
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Cate
        },
        {
          path: '/params',
          component: CateParams
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods/addgood',
          component: AddGood
        }

      ]
    }
  ]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem("token")
  if (!token) return next('/login')
  next()
})

export default router
