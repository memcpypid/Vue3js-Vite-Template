import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export async function render(url, manifest, cookies = {}) {
  const { app, router, pinia } = createApp()

  // Convert cookies object back to string for the utility
  const cookieStr = Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ')
  
  // Initialize stores with cookies
  const { useAuthStore } = await import('./stores/auth')
  const { useThemeStore } = await import('./stores/theme')
  
  const authStore = useAuthStore(pinia)
  const themeStore = useThemeStore(pinia)
  
  authStore.initFromCookies(cookieStr)
  themeStore.initFromCookies(cookieStr)

  // set the router to the desired URL
  await router.push(url)
  await router.isReady()

  // render the app instance to HTML
  const ctx = {}
  const html = await renderToString(app, ctx)

  // serialize the pinia state for hydration on client
  const state = JSON.stringify(pinia.state.value)

  return { html, state }
}
