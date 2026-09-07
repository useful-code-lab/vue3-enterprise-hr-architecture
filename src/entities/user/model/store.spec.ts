import { setActivePinia, createPinia } from 'pinia'
import { describe, beforeEach, it, expect } from 'vitest'
import { useUserStore } from './store'

// Изолируем глобальный localStorage для тестов
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    clear: () => {
      store = {}
    },
    removeItem: (key: string) => {
      delete store[key]
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('User Store (Pinia)', () => {
  // Перед каждым тестом инициализируем чистый стейт Pinia
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('должен иметь дефолтное состояние при инициализации', () => {
    const userStore = useUserStore()
    expect(userStore.profile).toBeNull()
    expect(userStore.isAuthenticated).toBe(false)
    expect(userStore.userRole).toBeNull()
  })

  it('должен правильно валидировать роли через геттер hasRole (RBAC)', () => {
    const userStore = useUserStore()

    // Задаем искусственное состояние профиля менеджера
    userStore.profile = {
      id: 'usr_1',
      email: 'manager@aurahq.io',
      name: 'Елена',
      role: 'manager',
    }

    expect(userStore.isAuthenticated).toBe(true)
    expect(userStore.userRole).toBe('manager')

    // Проверяем доступ для разных массивов ролей
    expect(userStore.hasRole(['admin', 'manager'])).toBe(true)
    expect(userStore.hasRole(['employee'])).toBe(false)
  })

  it('должен корректно очищать стейт и localStorage при вызове logout', () => {
    const userStore = useUserStore()

    localStorage.setItem('accessToken', 'test-token')
    userStore.profile = { id: 'usr_1', email: 'a@a.io', name: 'A', role: 'employee' }

    // Вызываем метод логаута
    userStore.logout()

    expect(userStore.profile).toBeNull()
    expect(userStore.isAuthenticated).toBe(false)
    expect(localStorage.getItem('accessToken')).toBeNull()
  })
})
