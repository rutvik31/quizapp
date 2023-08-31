import Vue from "vue";
import VueRouter from "vue-router";
import Register from "@/pages/register.vue";
import Login from "@/pages/login.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import adminRoutes from "@/router/admin";
import userRoutes from "@/router/user";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "login",
        name: "login",
        component: Login,
      },
      {
        path: "register",
        name: "register",
        component: Register,
      },
      ...adminRoutes,
      ...userRoutes,
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// Navigation guard to check if the user has a token
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("userDeatils"));
      const type = user?.role;
      const path = to.fullPath.split("/")[1];
      if (path !== type) next(`${type}`);
      else next();
    }
  } else {
    next();
  }
});

export default router;
