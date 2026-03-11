import { createRouter, createWebHistory } from 'vue-router'
//history模式（无#）后端要配置Nginx
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: {name:'Login'} //重定向到路由页
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue') //路由懒加载
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue')
    },
    {
      path:'/home',
      name:'Home',
      component:() => import('../views/Home.vue')
    }
  ]
})

export default router