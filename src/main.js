import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter } from './router'
import './style.css'
import 'nprogress/nprogress.css'
import App from './App.vue'

// SSR requires a fresh app instance per request, so we export a function
export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  const router = createRouter()

  app.use(pinia)
  app.use(router)

  return { app, router, pinia }
}
