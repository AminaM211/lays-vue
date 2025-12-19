import { createRouter, createWebHistory } from "vue-router"

import HomeView from "../views/HomeView.vue"
import LoginView from "../views/LoginView.vue"
import AdminView from "../views/AdminView.vue"
import RegisterView from "../views/RegisterView.vue"

const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    return user && user.role === "admin"
  }
  
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: "/",
        name: "home",
        component: HomeView,
        meta: { requiresAuth: true }
      },
      {
        path: "/login",
        component: LoginView
      },
      {
        path: "/register",
        component: RegisterView
      },
      {
        path: "/admin",
        component: AdminView,
        meta: { requiresAuth: true, adminOnly: true }
      }
    ]
  })
 
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"))
  
    // 🔒 moet ingelogd zijn
    if (to.meta.requiresAuth && !token) {
      return next("/login")
    }
  
    // 🔒 admin-only
    if (to.meta.adminOnly && user?.role !== "admin") {
      return next("/")
    }
  
    next()
  })
  

export default router
