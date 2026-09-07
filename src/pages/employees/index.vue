<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@entities/user/model/store'
import { BaseButton, BaseInput } from '@shared/ui'

const router = useRouter()
const userStore = useUserStore()

// 1. Реактивное состояние полей формы
const form = reactive({
  email: '',
  password: '',
})

// Состояния для UI (лоадер и вывод ошибок бэкенда)
const isLoading = ref(false)
const submitError = ref('')

// Флаг, чтобы не показывать ошибки валидации раньше первой попытки отправки
const isSubmittedOnce = ref(false)

// 2. Валидация данных на клиенте (Senior-подход без тяжелых библиотек)
const errors = computed(() => {
  const currentErrors = { email: '', password: '' }

  if (!isSubmittedOnce.value) return currentErrors

  // Проверка Email
  if (!form.email) {
    currentErrors.email = 'Поле Email обязательно для заполнения'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    currentErrors.email = 'Введите корректный адрес электронной почты'
  }

  // Проверка Пароля
  if (!form.password) {
    currentErrors.password = 'Поле Пароль обязательно для заполнения'
  } else if (form.password.length < 6) {
    currentErrors.password = 'Пароль должен быть не менее 6 символов'
  }

  return currentErrors
})

// Проверка общей валидности формы перед отправкой
const isFormValid = computed(() => !errors.value.email && !errors.value.password)

// 3. Метод обработки отправки формы
const onSubmit = async () => {
  isSubmittedOnce.value = true
  submitError.value = ''

  // Если есть ошибки валидации — прерываем отправку
  if (!isFormValid.value) return

  isLoading.value = true
  try {
    // Имитируем успешное получение токенов (их проверит наш Router Guard)
    localStorage.setItem('accessToken', 'mock-senior-access-token')
    localStorage.setItem('refreshToken', 'mock-senior-refresh-token')

    // Принудительно инициализируем профиль в стейте для прохождения защиты роутера
    userStore.profile = {
      id: 'usr_99210',
      email: form.email,
      name: 'Алексей (Admin)',
      role: 'admin',
      avatarUrl: 'https://dicebear.com',
    }

    // Перенаправляем пользователя на главный дашборд аналитики
    await router.push({ name: 'dashboard' })
  } catch {
    submitError.value = 'Неверный Email или пароль. Попробуйте снова.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
      <!-- Заголовок системы -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">AuraHQ</h1>
        <p class="text-sm text-slate-500 mt-2">Enterprise HR & Resource Management</p>
      </div>

      <!-- Глобальная ошибка отправки формы -->
      <div
        v-if="submitError"
        class="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg"
        role="alert"
      >
        {{ submitError }}
      </div>

      <!-- Семантическая форма -->
      <form @submit.prevent="onSubmit" class="space-y-5" novalidate>
        <BaseInput
          id="login-email"
          v-model="form.email"
          type="email"
          label="Email адрес"
          placeholder="example@aurahq.io"
          :error="errors.email"
          :disabled="isLoading"
          required
        />

        <BaseInput
          id="login-password"
          v-model="form.password"
          type="password"
          label="Пароль"
          placeholder="••••••••"
          :error="errors.password"
          :disabled="isLoading"
          required
        />

        <div class="pt-2">
          <!-- Переиспользуемая кнопка со встроенной логикой лоадера -->
          <BaseButton type="submit" variant="primary" class="w-full" :is-loading="isLoading">
            Войти в систему
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>
