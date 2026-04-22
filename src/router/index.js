import { createRouter as _createRouter, createWebHistory, createMemoryHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useTitle } from "@vueuse/core";
import NProgress from "nprogress";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/auth/Login.vue"),
        meta: { guest: true },
      },
      {
        path: "register",
        name: "Register",
        component: () => import("@/views/auth/Register.vue"),
        meta: { guest: true },
      },
    ],
  },
  {
    path: "/admin",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAuth: true, role: "admin" },
    children: [
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: () => import("@/views/admin/Dashboard.vue"),
      },
      {
        path: "users",
        name: "AdminUsers",
        component: () => import("@/views/admin/Users.vue"),
      },
      {
        path: "settings",
        name: "AdminSettings",
        component: () => import("@/views/admin/Settings.vue"),
      },
    ],
  },
  {
    path: "/user",
    component: () => import("@/layouts/UserLayout.vue"),
    meta: { requiresAuth: true, role: "user" },
    children: [
      {
        path: "dashboard",
        name: "UserDashboard",
        component: () => import("@/views/user/Dashboard.vue"),
      },
      {
        path: "profile",
        name: "UserProfile",
        component: () => import("@/views/user/Profile.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
];

export function createRouter() {
  const router = _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  });

  // Configure NProgress (Client only)
  if (!import.meta.env.SSR) {
    NProgress.configure({ showSpinner: false });
  }

  router.beforeEach((to, from) => {
    if (!import.meta.env.SSR) NProgress.start();
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated();
    const userRole = authStore.user?.role;

    // Authentication check
    if (to.meta.requiresAuth && !isAuthenticated) {
      return { name: "Login" };
    }

    // Guest route check (redirect away from login/register if already authenticated)
    if (to.meta.guest && isAuthenticated) {
      return userRole === "admin" ? { name: "AdminDashboard" } : { name: "UserDashboard" };
    }

    // Role-based authorization check
    if (
      to.meta.requiresAuth &&
      to.meta.role &&
      to.meta.role !== userRole
    ) {
      if (userRole === "admin") return { name: "AdminDashboard" };
      if (userRole === "user") return { name: "UserDashboard" };
      return { name: "Login" };
    }
  });

  router.afterEach((to) => {
    if (!import.meta.env.SSR) {
      // Dynamic Title
      const title = useTitle();
      const baseTitle = "Vue3 Vite Template";
      title.value = to.name ? `${to.name} | ${baseTitle}` : baseTitle;
      
      NProgress.done();
    }
  });

  return router;
}
