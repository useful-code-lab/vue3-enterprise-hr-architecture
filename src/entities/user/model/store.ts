import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@shared/api/api-client'

// 1. Описываем строгие интерфейсы данных
export interface UserProfile {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'employee'
  avatarUrl?: string
}

export const useUserStore = defineStore('user', () => {
  // State (Реактивные переменные)
  const profile = ref<UserProfile | null>(null)
  const isLoading = ref<boolean>(false)

  // Getters (Вычисляемые свойства)
  const isAuthenticated = computed(() => profile.value !== null)
  const userRole = computed(() => profile.value?.role || null)

  // Проверка прав (RBAC — Role-Based Access Control)
  const hasRole = computed(() => (roles: ('admin' | 'manager' | 'employee')[]) => {
    return profile.value ? roles.includes(profile.value.role) : false
  })

  // Actions (Методы для изменения состояния и запросов)
  async function fetchProfile() {
    if (profile.value) return // Кэширование в пределах сессии

    isLoading.value = true
    try {
      // Делаем запрос через наш Senior API-клиент
      const response = await apiClient.get<UserProfile>('/auth/me')
      profile.value = response.data
    } catch (error) {
      logout()
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    profile.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  return {
    profile,
    isLoading,
    isAuthenticated,
    userRole,
    hasRole,
    fetchProfile,
    logout,
  }
})
