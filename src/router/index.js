import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import AdminView from "../views/AdminView.vue";
import RegisterView from "../views/RegisterView.vue";

const isAdmin = (user) => user && user.role === "admin";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      component: LoginView,
    },
    {
      path: "/register",
      component: RegisterView,
    },
    {
      path: "/admin",
      component: AdminView,
      meta: { requiresAuth: true, adminOnly: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const adminOnly = to.matched.some((record) => record.meta.adminOnly);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (requiresAuth && !user) {
    return next("/login");
  }

  if (adminOnly && !isAdmin(user)) {
    return next("/");
  }

  next();
});

export default router;
