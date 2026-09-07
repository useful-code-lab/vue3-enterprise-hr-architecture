<script setup lang="ts">
import { reactive } from 'vue'
import { useUserStore } from '@entities/user/model/store'
import { BaseButton } from '@shared/ui'
import ResourceChart from '@widgets/analytics/ui/ResourceChart.vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@shared/lib/theme/use-theme'

const router = useRouter()
const userStore = useUserStore()

// Имитируем комплексные бизнес-данные для дашборда
const stats = reactive([
  { id: 'kpi-1', name: 'Всего сотрудников', value: '142', change: '+12% за месяц', trend: 'up' },
  {
    id: 'kpi-2',
    name: 'Активные проекты',
    value: '18',
    change: '3 на стадии релиза',
    trend: 'neutral',
  },
  {
    id: 'kpi-3',
    name: 'Утилизация ресурсов',
    value: '87.4%',
    change: '+2.1% со сборов',
    trend: 'up',
  },
  { id: 'kpi-4', name: 'Открытые вакансии', value: '9', change: '-2 за неделю', trend: 'down' },
])

const handleLogout = () => {
  userStore.logout()
  window.location.reload() // Мягкий сброс сессии и редирект силами роутера
}

const { theme, toggleTheme, initTheme } = useTheme()
// Инициализируем тему при загрузке компонента дашборда
initTheme()
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- 1. Навигационная панель (Header) -->
    <header
      class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs"
    >
      <div class="flex items-center gap-3">
        <span class="text-xl font-black tracking-tight text-[var(--color-brand-dark)]"
          >Aura<span class="text-[var(--color-brand-primary)]">HQ</span></span
        >
        <span class="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md"
          >Enterprise</span
        >
      </div>

      <!-- Профиль текущего авторизованного пользователя -->
      <div v-if="userStore.isAuthenticated" class="flex items-center gap-4">
        <div class="text-right hidden sm:block">
          <p class="text-sm font-semibold text-slate-900">{{ userStore.profile?.name }}</p>
          <p class="text-xs text-slate-500 capitalize">{{ userStore.profile?.role }}</p>
        </div>
        <img
          :src="userStore.profile?.avatarUrl"
          alt="Avatar"
          class="w-9 h-9 rounded-full bg-slate-100 border border-slate-200"
        />
        <BaseButton variant="secondary" size="sm" @click="toggleTheme">
          {{ theme === 'light' ? '🌙 Темная' : '☀️ Светлая' }}
        </BaseButton>
        <BaseButton variant="secondary" size="sm" @click="handleLogout"> Выйти </BaseButton>
      </div>
    </header>

    <!-- 2. Главная контентная область -->
    <main class="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
      <!-- Приветствие и контекст -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-950 tracking-tight">Рабочее пространство</h2>
          <p class="text-sm text-slate-500 mt-0.5">
            Оперативные метрики эффективности и управление ресурсами организации
          </p>
        </div>
        <div class="flex gap-2">
          <BaseButton variant="secondary" size="md">Экспорт отчета</BaseButton>
          <!-- Кнопка доступна только администраторам и менеджерам (RBAC на практике) -->
          <BaseButton
            v-if="userStore.hasRole(['admin', 'manager'])"
            variant="primary"
            size="md"
            @click="router.push('/employees')"
          >
            Управление персоналом
          </BaseButton>
        </div>
      </div>

      <!-- 3. Модульная Grid-сетка метрик (KPI Dashboard) -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="item in stats"
          :key="item.id"
          class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
        >
          <div>
            <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {{ item.name }}
            </p>
            <p class="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{{ item.value }}</p>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <span class="text-xs text-slate-500 font-medium">{{ item.change }}</span>

            <!-- Индикаторы тренда -->
            <span
              :class="[
                'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase',
                item.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : '',
                item.trend === 'down' ? 'bg-rose-50 text-rose-700' : '',
                item.trend === 'neutral' ? 'bg-slate-100 text-slate-600' : '',
              ]"
            >
              {{ item.trend }}
            </span>
          </div>
        </div>
      </section>

      <!-- Заготовка под графики или тяжелые таблицы -->
      <!-- В самом низу шаблона src/pages/dashboard/index.vue -->
      <section class="w-full">
        <ResourceChart />
      </section>
    </main>
  </div>
</template>
