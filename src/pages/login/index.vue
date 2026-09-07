<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@entities/user/model/store'
import { BaseButton, BaseInput } from '@shared/ui'

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
const isSubmitedOnce = ref(false)

// 2. Инлинейная Senior-валидация без лишних библиотек
const errors = computed(() => {
  const currentErrors = { email: '', password: '' }

  if (!isSubmitedOnce.value) return currentErrors

  // Валидация Email
  if (!form.email) {
    currentErrors.email = 'Поле Email обязательно для заполнения'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    currentErrors.email = 'Введите корректный адрес электронной почты'
  }

  // Валидация Пароля
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
  isSubmitedOnce.value = true
  submitError.value = ''

  if (!isFormValid.value) return

  isLoading.value = true
  try {
    // В реальном приложении здесь будет вызов фичи AuthByEmail или прямой запрос к API.
    // Имитируем запись токенов (которые затем подхватит наш MSW / API Client)
    localStorage.setItem('accessToken', 'mock-initial-access-token')
    localStorage.setItem('refreshToken', 'mock-initial-refresh-token')

    // Получаем профиль пользователя через Pinia-хранилище
    await userStore.fetchProfile()

    // Перенаправляем на главный дашборд
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
          <!-- Наш переиспользуемый компонент со встроенным лоадером -->
          <BaseButton type="submit" variant="primary" class="w-full" :is-loading="isLoading">
            Войти в систему
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>
