<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiClient } from '@shared/api/api-client'
import { BaseButton, BaseInput } from '@shared/ui'
import { AddEmployeeModal } from '@features/add-employee'

interface Employee {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'employee'
  department: string
  status: 'active' | 'on_vacation' | 'fired'
}

// 1. Сетевые состояния
const employees = ref<Employee[]>([])
const isLoading = ref(true)
const networkError = ref('')

const searchQuery = ref('')
const activeFilterRole = ref<string>('all')

// 2. Запрос данных при загрузке страницы
onMounted(async () => {
  try {
    isLoading.value = true
    const response = await apiClient.get<Employee[]>('/employees')
    employees.value = response.data
  } catch {
    networkError.value = 'Не удалось загрузить список сотрудников. Попробуйте позже.'
  } finally {
    isLoading.value = false
  }
})

// 3. Вычисляемый отфильтрованный список
const filteredEmployees = computed(() => {
  return employees.value.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesRole = activeFilterRole.value === 'all' || employee.role === activeFilterRole.value

    return matchesSearch && matchesRole
  })
})

const getStatusLabel = (status: Employee['status']) => {
  const labels = { active: 'Активен', on_vacation: 'В отпуске', fired: 'Уволен' }
  return labels[status]
}

const refreshEmployees = async () => {
  try {
    isLoading.value = true
    const response = await apiClient.get<Employee[]>('/employees')
    employees.value = response.data
  } catch {
    networkError.value = 'Не удалось обновить список.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Заголовок страницы -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-950 tracking-tight">Управление персоналом</h2>
        <p class="text-sm text-slate-500 mt-0.5">
          Поиск, фильтрация и администрирование прав доступа сотрудников AuraHQ
        </p>
      </div>
      <!-- Теперь при успешном сохранении таблица сама пошлет запрос и обновит строки -->
      <AddEmployeeModal @success="refreshEmployees" />
    </div>

    <!-- Панель инструментов (Поиск и фильтры) -->
    <div
      class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-end"
    >
      <div class="flex-1 w-full">
        <BaseInput
          id="search-employee"
          v-model="searchQuery"
          type="text"
          label="Поиск сотрудника"
          placeholder="Введите имя, email или отдел..."
        />
      </div>

      <div class="w-full sm:w-48 flex flex-col gap-1.5">
        <label for="filter-role" class="text-xs font-semibold text-slate-700">Фильтр по роли</label>
        <select
          id="filter-role"
          v-model="activeFilterRole"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-blue-100 transition-colors"
        >
          <option value="all">Все роли</option>
          <option value="admin">Администратор</option>
          <option value="manager">Менеджер</option>
          <option value="employee">Сотрудник</option>
        </select>
      </div>
    </div>

    <!-- Табличная часть (Data Table) -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              <th class="px-6 py-3">Сотрудник</th>
              <th class="px-6 py-3">Отдел</th>
              <th class="px-6 py-3">Роль</th>
              <th class="px-6 py-3">Статус</th>
              <th class="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
            <!-- Состояние загрузки (Лоадер) -->
            <tr v-if="isLoading">
              <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                <div class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Получение данных с сервера AuraHQ...</span>
                </div>
              </td>
            </tr>

            <!-- Ошибка сети -->
            <tr v-else-if="networkError">
              <td colspan="5" class="px-6 py-8 text-center text-red-600 font-medium bg-red-50">
                {{ networkError }}
              </td>
            </tr>

            <!-- Основной контент таблицы (когда загрузка завершена) -->
            <template v-else>
              <tr
                v-for="employee in filteredEmployees"
                :key="employee.id"
                class="hover:bg-slate-50/50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="font-semibold text-slate-900">{{ employee.name }}</div>
                  <div class="text-xs text-slate-400 mt-0.5">{{ employee.email }}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-slate-600 font-medium">{{ employee.department }}</span>
                </td>
                <td class="px-6 py-4 capitalize text-xs font-mono text-slate-500">
                  {{ employee.role }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      employee.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : '',
                      employee.status === 'on_vacation'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : '',
                      employee.status === 'fired'
                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                        : '',
                    ]"
                  >
                    {{ getStatusLabel(employee.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <BaseButton variant="secondary" size="sm">Изменить</BaseButton>
                </td>
              </tr>

              <!-- Состояние, когда ничего не найдено -->
              <tr v-if="filteredEmployees.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-slate-400 text-sm">
                  Сотрудники с такими критериями поиска не найдены.
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
