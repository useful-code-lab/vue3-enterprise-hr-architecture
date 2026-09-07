import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from '@app/providers/router'
import '@app/styles/main.css'

async function prepareApp() {
  // Включаем перехватчик сетевых запросов только локально
  if (import.meta.env.DEV) {
    const { worker } = await import('@shared/api/mock/browser')
    await worker.start({
      onUnhandledRequest: 'bypass', // Не ругаться на запросы к ассетам Vite
    })
  }
}

prepareApp().then(() => {
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
})
