<script setup lang="ts">
import { useToast } from '../lib/toast/use-toast'

const { toasts } = useToast()
</script>

<template>
  <!-- Рендерим тосты поверх всех слоев в корне DOM (body) -->
  <Teleport to="body">
    <div
      class="fixed top-5 right-5 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    >
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-[-20px] opacity-0 scale-95"
        enter-to-class="transform translate-y-0 opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in absolute w-full"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="transform translate-x-[50px] opacity-0 scale-95"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'p-4 rounded-xl shadow-xl border flex items-center gap-3 pointer-events-auto transition-all',
            toast.type === 'success'
              ? 'bg-white border-emerald-100 text-emerald-900 shadow-emerald-500/5'
              : '',
            toast.type === 'error' ? 'bg-white border-red-100 text-red-900 shadow-red-500/5' : '',
            toast.type === 'info' ? 'bg-white border-blue-100 text-blue-900 shadow-blue-500/5' : '',
          ]"
          role="alert"
        >
          <!-- Иконки состояний -->
          <span v-if="toast.type === 'success'" class="text-emerald-500 text-lg">✓</span>
          <span v-else-if="toast.type === 'error'" class="text-red-500 text-lg">✕</span>
          <span v-else class="text-blue-500 text-lg">ℹ</span>

          <p class="text-xs font-semibold tracking-tight leading-relaxed">{{ toast.message }}</p>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
