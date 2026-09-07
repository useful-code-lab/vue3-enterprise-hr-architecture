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
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const token = localStorage.getItem('accessToken')

  // Если токен есть, а профиль еще не загружен в стейт (например, после рефреша страницы)
  if (token && !userStore.isAuthenticated) {
    try {
      await userStore.fetchProfile()
    } catch {
      // При ошибке запроса профиля (токен невалиден) очищаем стейт и шлем на логин
      userStore.logout()
      return next({ name: 'login' })
    }
  }

  // Проверка авторизации
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  // Проверка ролевой модели (RBAC)
  if (to.meta.allowedRoles && !userStore.hasRole(to.meta.allowedRoles)) {
    // Если роль пользователя не входит в список разрешенных
    return next({ name: 'forbidden' })
  }

  // Если пользователь авторизован и пытается зайти на страницу логина
  if (to.name === 'login' && userStore.isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  next()
})
