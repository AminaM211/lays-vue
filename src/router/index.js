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
      { path: "/", component: HomeView },
      { path: "/login", component: LoginView },
      {path: "/register",name: "register",component: RegisterView},      
      {
        path: "/admin",
        component: () => import("../views/AdminView.vue"),
        beforeEnter: () => {
          const user = JSON.parse(localStorage.getItem("user"))
          if (!user || user.role !== "admin") {
            return "/login"
          }
        }
      }
      
    ]
  })
  

export default router
