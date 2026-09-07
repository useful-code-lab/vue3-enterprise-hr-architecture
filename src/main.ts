import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from '@app/providers/router'
//import '@app/styles/main.css' // Ваша точка сборки глобальных стилей

const app = createApp(App)

// Важен порядок: сначала Pinia, затем Router, так как роутер использует хранилище внутри гардов
app.use(createPinia())
app.use(router)

app.mount('#app')
