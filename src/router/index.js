import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '@/pages/register.vue'
import Login from '@/pages/login.vue'
import Quizlist from '@/pages/quizList.vue'
import Tag from '@/pages/tag/tagList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/quizlist',
    name: 'quizlist',
    component: Quizlist,
    meta: { requiresAuth: true }
  },
  {
    path: '/tags',
    name: 'tags',
    component: Tag,
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Navigation guard to check if the user has a token
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
