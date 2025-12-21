import { createRouter, createWebHistory } from "vue-router"

import HomeView from "../views/HomeView.vue"
import LoginView from "../views/LoginView.vue"
import AdminView from "../views/AdminView.vue"
import RegisterView from "../views/RegisterView.vue"

const API_URL = import.meta.env.VITE_API_BASE_URL

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
 
  router.beforeEach(async (to, from, next) => {
    if (to.path === "/login") return next()
  
    const res = await fetch(`${API_URL}/bag/mine`, {
      credentials: "include"
    })
  
    if (res.ok) next()
    else next("/login")
  })
  
  

export default router
