import { createRouter, createWebHistory } from 'vue-router'
//history模式（无#）后端要配置Nginx
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: { name: 'Login' }, //重定向到路由页
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'), //路由懒加载
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/personal',
      name: 'Personal',
      component: () => import('../views/Personal.vue'),
    },
    {
      path:'/diet-logs',
      name:'DietLog',
      component: () => import('../views/DietLog.vue')
    }
  ],
})

//路由守卫
router.beforeEach((to, from, next) => {
  // 不需要登录的页面
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('token')

  // 如果需要登录且未登录，则重定向到登录页面
  if (authRequired && !loggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
