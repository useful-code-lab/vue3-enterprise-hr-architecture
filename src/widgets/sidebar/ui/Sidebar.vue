<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

// Модульная конфигурация ссылок для удобного добавления новых разделов
const navigation = [
  { name: 'Дашборд', to: '/', icon: '📊' },
  { name: 'Сотрудники', to: '/employees', icon: '👥' },
]
</script>

<template>
  <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
    <!-- Логотип платформы -->
    <div class="p-6 border-b border-slate-800 flex items-center gap-2">
      <span class="text-xl font-black tracking-tight text-white">
        Aura<span class="text-blue-500">HQ</span>
      </span>
    </div>

    <!-- Список навигационных ссылок -->
    <nav class="flex-1 p-4 space-y-1">
      <RouterLink
        v-for="item in navigation"
        :key="item.to"
        :to="item.to"
        :class="[
          'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
          route.path === item.to
            ? 'bg-blue-600 text-white font-semibold'
            : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200',
        ]"
      >
        <span class="text-base" aria-hidden="true">{{ item.icon }}</span>
        <span>{{ item.name }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
