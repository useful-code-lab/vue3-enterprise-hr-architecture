<script setup lang="ts">
import { BaseButton } from '@shared/ui'
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-950 tracking-tight">Сотрудники</h2>
        <p class="text-sm text-slate-500 mt-0.5">
          Управление учетными записями, ролями и доступами персонала
        </p>
      </div>
      <BaseButton variant="primary" size="md">Добавить сотрудника</BaseButton>
    </div>

    <div
      class="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-sm"
    >
      Таблица сотрудников будет реализована на следующем шаге.
    </div>
  </div>
</template>
