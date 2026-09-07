<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUserStore } from '@entities/user/model/store'
import { Sidebar } from '@widgets/sidebar'

const route = useRoute()
const userStore = useUserStore()
</script>

<template>
  <!-- Вариант А: Если страница требует авторизации и пользователь вошел в систему -->
  <div
    v-if="route.meta.requiresAuth && userStore.isAuthenticated"
    class="flex h-screen bg-slate-50 overflow-hidden"
  >
    <!-- Сквозное боковое меню -->
    <Sidebar />

    <!-- Правая область: Шапка (если нужна) + динамический контент страниц -->
    <div class="flex-1 flex flex-col overflow-y-auto">
      <main class="flex-1">
        <RouterView />
      </main>
    </div>
  </div>

  <!-- Вариант Б: Публичные страницы (экран Логина, ошибки 404/403) рендерим в чистом виде -->
  <div v-else class="min-h-screen bg-slate-50">
    <RouterView />
  </div>
</template>

<style>
/* Сброс базовых стилей для бесшовного full-height интерфейса */
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
}
</style>
