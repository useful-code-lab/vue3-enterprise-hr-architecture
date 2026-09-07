<script setup lang="ts">
import { ref } from 'vue'
import { apiClient } from '@shared/api/api-client'
import { useToast } from '@shared/lib/toast/use-toast'
import { BaseButton, BaseModal } from '@shared/ui'

// Пропсы принимают ID и имя сотрудника для вывода в тексте подтверждения
interface DeleteEmployeeProps {
  employeeId: string
  employeeName: string
}

const props = defineProps<DeleteEmployeeProps>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const isOpen = ref(false)
const isLoading = ref(false)
const { show } = useToast()

const handleDelete = async () => {
  isLoading.value = true
  try {
    // Отправляем DELETE запрос на бэкенд (MSW)
    await apiClient.delete(`/employees/${props.employeeId}`)

    show(`Сотрудник ${props.employeeName} успешно удален из системы`, 'success')
    isOpen.value = false
    emit('success') // Триггерим обновление таблицы у родителя
  } catch {
    show('Не удалось удалить сотрудника. Ошибка сервера.', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- Маленькая кнопка удаления для встраивания в строку таблицы -->
  <BaseButton variant="danger" size="sm" @click="isOpen = true"> Удалить </BaseButton>

  <!-- Модальное окно подтверждения (Confirmation Dialog) -->
  <BaseModal :is-open="isOpen" title="Подтверждение удаления" @close="isOpen = false">
    <div class="space-y-4">
      <p class="text-sm text-slate-600 leading-relaxed">
        Вы уверены, что хотите удалить сотрудника
        <strong class="text-slate-900">{{ employeeName }}</strong
        >? Это действие необратимо и полностью сотрет учетную запись из инфраструктуры AuraHQ.
      </p>

      <div class="flex justify-end gap-2 pt-3 border-t border-slate-100">
        <BaseButton variant="secondary" size="sm" :disabled="isLoading" @click="isOpen = false">
          Отмена
        </BaseButton>
        <BaseButton variant="danger" size="sm" :is-loading="isLoading" @click="handleDelete">
          Подтвердить удаление
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
