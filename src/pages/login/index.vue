<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@entities/user/model/store'
import { BaseButton, BaseInput } from '@shared/ui'
import { apiClient } from '@shared/api/api-client'

const router = useRouter()
const userStore = useUserStore()

// 1. Реактивное состояние формы
const form = reactive({
  email: '',
  password: '',
})

// Состояние отправки и ошибок бэкенда
const isLoading = ref(false)
const submitError = ref('')

// Стейт для отслеживания того, пытался ли пользователь уже отправить форму
const isSubmittedOnce = ref(false)

// 2. Инлинейная Senior-валидация без лишних библиотек
// 2. Валидация данных на клиенте (Исправленная Senior-версия)
const errors = computed(() => {
  const currentErrors = { email: '', password: '' }

  // КРИТИЧЕСКИЙ МОМЕНТ: Если пользователь ЕЩЕ НЕ НАЖИМАЛ кнопку отправки,
  // мы принудительно возвращаем пустые ошибки, чтобы форма была валидна изначально!
  if (!isSubmittedOnce.value) {
    return currentErrors
  }

  // Проверка Email (запускается только ПОСЛЕ первого клика по кнопке)
  if (!form.email) {
    currentErrors.email = 'Поле Email обязательно для заполнения'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    currentErrors.email = 'Введите корректный адрес электронной почты'
  }

  // Проверка Пароля (запускается только ПОСЛЕ первого клика по кнопке)
  if (!form.password) {
    currentErrors.password = 'Поле Пароль обязательно для заполнения'
  } else if (form.password.length < 6) {
    currentErrors.password = 'Пароль должен быть не менее 6 символов'
  }

  return currentErrors
})

// Проверка валидности всей формы перед отправкой
const isFormValid = computed(() => !errors.value.email && !errors.value.password)

// 3. Обработка отправки формы
const onSubmit = async () => {
  isSubmittedOnce.value = true
  submitError.value = ''

  if (!isFormValid.value) return

  isLoading.value = true
  try {
    // 1. Делаем настоящий POST-запрос через Axios в MSW
    const response = await apiClient.post('/auth/login', {
      email: form.email,
      password: form.password,
    })

    const { accessToken, refreshToken } = response.data

    // 2. Сохраняем токены
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    // 3. Вызываем метод Pinia, который сделает GET-запрос на /auth/me с токеном в заголовке
    await userStore.fetchProfile()

    // 4. Редирект
    await router.push({ name: 'dashboard' })
  } catch (error) {
    // Обрабатываем ошибку ответа от MSW
    submitError.value = error.response?.data?.message || 'Ошибка соединения с сервером.'
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
          <!-- Наш переиспользуемый компонент со встроенным лоадером -->
          <BaseButton type="submit" variant="primary" class="w-full" :is-loading="isLoading">
            Войти в систему
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>
