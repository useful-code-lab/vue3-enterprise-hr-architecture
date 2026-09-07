import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from '@app/providers/router'
import '@app/styles/main.css'

async function prepareApp() {
  // Активируем Service Worker только во время локальной разработки
  if (import.meta.env.DEV) {
    const { worker } = await import('@shared/api/mock/browser')
    // Метод start() возвращает Promise, дожидаемся его активации
    await worker.start({
      onUnhandledRequest: 'bypass', // Игнорируем запросы к ассетам Vite (.vue, .css)
    })
  }
}

prepareApp().then(() => {
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
})
