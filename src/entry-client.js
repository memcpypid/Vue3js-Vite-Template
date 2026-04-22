import { createApp } from './main'

const { app, router, pinia } = createApp()

// Hydrate store state immediately if it exists (sent by server)
// This ensures that router guards have access to the correct state during the initial navigation
if (window.__INITIAL_STATE__) {
  pinia.state.value = window.__INITIAL_STATE__
}

// Wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
  app.mount('#app')
})
