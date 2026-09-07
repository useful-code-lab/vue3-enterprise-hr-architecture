<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { apiClient } from '@shared/api/api-client'
import { BaseButton, BaseInput, BaseModal } from '@shared/ui'

// Описываем типы для события успешного создания
const emit = defineEmits<{
  (e: 'success'): void
}>()

const isOpen = ref(false)
const isLoading = ref(false)
const submitError = ref('')
const isSubmittedOnce = ref(false)

const form = reactive({
  name: '',
  email: '',
  department: 'Engineering',
  role: 'employee' as 'admin' | 'manager' | 'employee',
})

// Валидация полей формы
const errors = computed(() => {
  const currentErrors = { name: '', email: '' }
  if (!isSubmittedOnce.value) return currentErrors

  if (!form.name.trim()) currentErrors.name = 'Имя сотрудника обязательно'
  if (!form.email) {
    currentErrors.email = 'Email обязателен'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    currentErrors.email = 'Введите корректный Email'
  }

  return currentErrors
})

const isFormValid = computed(() => !errors.value.name && !errors.value.email)

const openModal = () => {
  isOpen.value = true
  isSubmittedOnce.value = false
  submitError.value = ''
  form.name = ''
  form.email = ''
}

const onSubmit = async () => {
  isSubmittedOnce.value = true
  if (!isFormValid.value) return

  isLoading.value = true
  try {
    // Отправляем данные на наш Mock-бэкенд
    await apiClient.post('/employees', {
      ...form,
      status: 'active',
    })

    isOpen.value = false // Закрываем модалку при успехе
    emit('success') // Оповещаем родительскую страницу о необходимости обновить таблицу
  } catch {
    submitError.value = 'Не удалось сохранить сотрудника. Ошибка сервера.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- Кнопка-триггер вызова фичи -->
  <BaseButton variant="primary" size="md" @click="openModal"> + Добавить сотрудника </BaseButton>

  <!-- Наше переиспользуемое доступное модальное окно -->
  <BaseModal :is-open="isOpen" title="Новый сотрудник" @close="isOpen = false">
    <div
      v-if="submitError"
      class="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg"
    >
      {{ submitError }}
    </div>

    <form @submit.prevent="onSubmit" class="space-y-4" novalidate>
      <BaseInput
        id="emp-name"
        v-model="form.name"
        label="ФИО сотрудника"
        placeholder="Иван Иванов"
        :error="errors.name"
        :disabled="isLoading"
        required
      />

      <BaseInput
        id="emp-email"
        v-model="form.email"
        type="email"
        label="Рабочий Email"
        placeholder="i.ivanov@aurahq.io"
        :error="errors.email"
        :disabled="isLoading"
        required
      />

      <div class="flex flex-col gap-1.5">
        <label for="emp-dept" class="text-xs font-semibold text-slate-700">Отдел</label>
        <select
          id="emp-dept"
          v-model="form.department"
          :disabled="isLoading"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
        >
          <option value="Management">Management</option>
          <option value="HR Dept">HR Dept</option>
          <option value="Engineering">Engineering</option>
          <option value="Design Team">Design Team</option>
        </select>
      </div>

      <div class="flex justify-end gap-2 pt-4 border-t border-slate-100">
        <BaseButton variant="secondary" size="sm" :disabled="isLoading" @click="isOpen = false">
          Отмена
        </BaseButton>
        <BaseButton type="submit" variant="primary" size="sm" :is-loading="isLoading">
          Создать
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
