<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

interface BaseModalProps {
  isOpen: boolean
  title?: string
}

const props = withDefaults(defineProps<BaseModalProps>(), {
  title: '',
})

// Декларация события закрытия модалки
const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleClose = () => {
  emit('close')
}

// Закрытие окна по кнопке Escape
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

// Senior-практика: Блокировка прокрутки страницы (Scroll Lock), когда модалка открыта
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
  { immediate: true },
)

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  // На всякий случай очищаем стиль при размонтировании
  document.body.style.overflow = ''
})
</script>

<template>
  <!-- Рендерим модалку на уровне body приложения, избегая каскадных багов верстки -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'Модальное окно'"
      >
        <!-- Задний затемняющий фон (Overlay) -->
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" @click="handleClose" />

        <!-- Контентное окно модалки -->
        <div
          class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 flex flex-col gap-4 transform transition-all"
        >
          <!-- Шапка модального окна -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold text-slate-900 tracking-tight">
              {{ title }}
            </h3>
            <button
              type="button"
              class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors"
              aria-label="Закрыть окно"
              @click="handleClose"
            >
              ✕
            </button>
          </div>

          <!-- Тело модального окна (Слот для кастомной разметки) -->
          <div class="text-sm text-slate-600">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
