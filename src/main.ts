import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from '@app/providers/router'
import '@app/styles/main.css'

async function prepareApp() {
  if (import.meta.env.DEV) {
    const { worker } = await import('@shared/api/mock/browser')

    await worker.start({
      // Современный синтаксис MSW v2 для фильтрации запросов
      onUnhandledRequest(request) {
        const url = new URL(request.url)

        // Если запрос идет к нашим эндпоинтам API — отдаем его на обработку MSW
        if (url.pathname.startsWith('/api')) {
          return
        }

        // Все внутренние запросы Vite (HMR, ассеты, скрипты) полностью игнорируем
        return 'bypass'
      },
    })
  }
}

prepareApp().then(() => {
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
})
