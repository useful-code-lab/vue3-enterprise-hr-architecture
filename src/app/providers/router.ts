import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@entities/user/model/store'

// Описываем расширенные типы для meta-полей, чтобы избежать any
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    allowedRoles?: ('admin' | 'manager' | 'employee')[]
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    // Lazy Loading: чанк загрузится только при переходе на страницу
    component: () => import('@pages/dashboard/index.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin', 'manager', 'employee'] },
  },
  {
    path: '/employees',
    name: 'employees',
    component: () => import('@pages/employees/index.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin', 'manager'] }, // Обычный сотрудник сюда не зайдет
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@pages/login/index.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@pages/error/403.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@pages/error/404.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 2. Глобальный навигационный гард (Security Guard)
// Обновленный глобальный навигационный гард без устаревшего next()
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const token = localStorage.getItem('accessToken')

  // 1. Инициализация профиля при обновлении страницы (F5)
  if (token && !userStore.isAuthenticated) {
    try {
      await userStore.fetchProfile()
    } catch {
      userStore.logout()
      return { name: 'login' } // Декларативный редирект вместо next({ name: 'login' })
    }
  }

  // 2. Проверка требований авторизации
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'login' }
  }

  // 3. Проверка ролевой модели (RBAC)
  if (to.meta.allowedRoles && !userStore.hasRole(to.meta.allowedRoles)) {
    return { name: 'forbidden' }
  }

  // 4. Если авторизованный пользователь пытается зайти на логин — шлем на дашборд
  if (to.name === 'login' && userStore.isAuthenticated) {
    return { name: 'dashboard' }
  }

  // Если ни одно условие не сработало — навигация разрешена автоматически (аналог next())
})
