<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { apiClient } from '@shared/api/api-client'
import { useToast } from '@shared/lib/toast/use-toast'
import { BaseButton, BaseInput, BaseModal } from '@shared/ui'

interface Employee {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'employee'
  department: string
  status: 'active' | 'on_vacation' | 'fired'
}

// Принимаем текущие данные сотрудника для предзаполнения формы
interface EditEmployeeProps {
  employee: Employee
}

const props = defineProps<EditEmployeeProps>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const isOpen = ref(false)
const isLoading = ref(false)
const submitError = ref('')
const isSubmittedOnce = ref(false)
const { show } = useToast()

// Реактивное состояние формы редактирования
const form = reactive({
  name: '',
  email: '',
  department: '',
  role: 'employee' as 'admin' | 'manager' | 'employee',
})

// Наполняем форму актуальными данными при открытии модального окна
const openModal = () => {
  isOpen.value = true
  isSubmittedOnce.value = false
  submitError.value = ''
  form.name = props.employee.name
  form.email = props.employee.email
  form.department = props.employee.department
  form.role = props.employee.role
}

// Валидация полей
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

const onSubmit = async () => {
  isSubmittedOnce.value = true
  if (!isFormValid.value) return

  isLoading.value = true
  try {
    // Отправляем PUT запрос на обновление конкретного сотрудника
    await apiClient.put(`/employees/${props.employee.id}`, form)

    show(`Данные сотрудника ${form.name} успешно обновлены`, 'success')
    isOpen.value = false
    emit('success') // Обновляем родительскую таблицу
  } catch {
    submitError.value = 'Не удалось сохранить изменения. Ошибка сервера.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- Кнопка вызова фичи в строке таблицы -->
  <BaseButton variant="secondary" size="sm" @click="openModal"> Изменить </BaseButton>

  <BaseModal :is-open="isOpen" title="Редактирование сотрудника" @close="isOpen = false">
    <div
      v-if="submitError"
      class="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg"
    >
      {{ submitError }}
    </div>

    <form @submit.prevent="onSubmit" class="space-y-4" novalidate>
      <BaseInput
        id="edit-emp-name"
        v-model="form.name"
        label="ФИО сотрудника"
        :error="errors.name"
        :disabled="isLoading"
        required
      />

      <BaseInput
        id="edit-emp-email"
        v-model="form.email"
        type="email"
        label="Рабочий Email"
        :error="errors.email"
        :disabled="isLoading"
        required
      />

      <div class="flex flex-col gap-1.5">
        <label for="edit-emp-dept" class="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >Отдел</label
        >
        <select
          id="edit-emp-dept"
          v-model="form.department"
          :disabled="isLoading"
          class="w-full px-3 py-2 border border-[var(--color-ui-border)] rounded-lg text-sm bg-[var(--color-ui-card)] text-[var(--color-ui-text)]"
        >
          <option value="Management">Management</option>
          <option value="HR Dept">HR Dept</option>
          <option value="Engineering">Engineering</option>
          <option value="Design Team">Design Team</option>
        </select>
      </div>

      <div class="flex justify-end gap-2 pt-4 border-t border-[var(--color-ui-border)]">
        <BaseButton variant="secondary" size="sm" :disabled="isLoading" @click="isOpen = false">
          Отмена
        </BaseButton>
        <BaseButton type="submit" variant="primary" size="sm" :is-loading="isLoading">
          Сохранить
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
