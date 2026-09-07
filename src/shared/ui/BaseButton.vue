<script setup lang="ts">
import { computed } from 'vue'

// 1. Строгая типизация пропсов (Входные контракты)
interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

// Задаем дефолтные значения через скомпилированный макрос compiler-macro с поддержкой TS
const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'md',
  isLoading: false,
  disabled: false,
  type: 'button',
})

// 2. Декларация генерируемых событий (Выходные контракты)
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>() // Вот здесь должна быть обычная закрывающая скобка вызова функции

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.isLoading) return
  emit('click', event)
}

// 3. Вычисление динамических классов (Tailwind Дизайн-система)
const buttonClasses = computed(() => {
  const base =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-[var(--color-brand-primary)] hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }

  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || isLoading"
    @click="handleClick"
  >
    <!-- Иконка лоадера при загрузке данных -->
    <svg
      v-if="isLoading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- Слот для передачи текстового или HTML содержимого кнопки -->
    <slot />
  </button>
</template>
