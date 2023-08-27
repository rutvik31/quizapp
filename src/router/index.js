import Vue from "vue";
import VueRouter from "vue-router";
import Register from "@/pages/register.vue";
import Login from "@/pages/login.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import adminRoutes from "@/router/admin";

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
      ...adminRoutes
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
      next();
    }
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  const breadcrumbs = [];
  breadcrumbs.push({ label: "Home", route: "/" });

  const matchedRoutes = to.matched;
  matchedRoutes.forEach((route) => {
    if (route.name) {
      breadcrumbs.push({ label: route.name, route: route.path });
    }
  });
  to.meta.breadcrumbs = breadcrumbs;
  next();
});

export default router;
