<script setup lang="ts">
import { computed } from 'vue'

// 1. Описываем типы входных параметров
interface BaseInputProps {
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  id: string // Обязательный ID для связки label и input (требование семантики/ARIA)
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  type: 'text',
  placeholder: '',
  error: '',
  disabled: false,
  required: false,
})

// 2. Современное двустороннее связывание v-model в Vue 3 (нативный макрос)
const modelValue = defineModel<string | number>({ default: '' })

// 3. Динамические классы в зависимости от состояния (ошибка, заблокирован)
const inputClasses = computed(() => {
  const base =
    'w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-900 bg-white'

  if (props.error) {
    return `${base} border-red-500 focus:border-red-500 focus:ring-red-200`
  }

  return `${base} border-slate-300 focus:border-[var(--color-brand-primary)] focus:ring-blue-100`
})
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <!-- Семантический лейбл -->
    <label v-if="label" :for="id" class="text-xs font-semibold text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500" aria-hidden="true">*</span>
    </label>

    <div class="relative">
      <input
        :id="id"
        v-model="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
      />
    </div>

    <!-- Анимация и вывод ошибки валидации -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform -translate-y-1 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-1 opacity-0"
    >
      <p v-if="error" :id="`${id}-error`" class="text-xs text-red-600 font-medium" role="alert">
        {{ error }}
      </p>
    </Transition>
  </div>
</template>
