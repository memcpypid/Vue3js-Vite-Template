import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/",
    component: () => import("../layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("../views/auth/Login.vue"),
        meta: { guest: true },
      },
      {
        path: "register",
        name: "Register",
        component: () => import("../views/auth/Register.vue"),
        meta: { guest: true },
      },
    ],
  },
  {
    path: "/admin",
    component: () => import("../layouts/AdminLayout.vue"),
    meta: { requiresAuth: true, role: "admin" },
    children: [
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: () => import("../views/admin/Dashboard.vue"),
      },
      {
        path: "users",
        name: "AdminUsers",
        component: () => import("../views/admin/Users.vue"),
      },
      {
        path: "settings",
        name: "AdminSettings",
        component: () => import("../views/admin/Settings.vue"),
      },
    ],
  },
  {
    path: "/user",
    component: () => import("../layouts/UserLayout.vue"),
    meta: { requiresAuth: true, role: "user" },
    children: [
      {
        path: "dashboard",
        name: "UserDashboard",
        component: () => import("../views/user/Dashboard.vue"),
      },
      {
        path: "profile",
        name: "UserProfile",
        component: () => import("../views/user/Profile.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated();
  const userRole = authStore.user?.role;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login" });
  } else if (to.meta.guest && isAuthenticated) {
    if (userRole === "admin") {
      next({ name: "AdminDashboard" });
    } else {
      next({ name: "UserDashboard" });
    }
  } else if (
    to.meta.requiresAuth &&
    to.meta.role &&
    to.meta.role !== userRole
  ) {
    // If user tries to access a route they don't have permission for
    if (userRole === "admin") {
      next({ name: "AdminDashboard" });
    } else if (userRole === "user") {
      next({ name: "UserDashboard" });
    } else {
      next({ name: "Login" });
    }
  } else {
    next();
  }
});

export default router;
