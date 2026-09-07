<script setup lang="ts">
import { ref, computed } from 'vue'

interface ChartDataPoint {
  label: string
  value: number // Процент загрузки (0 - 100)
}

// Сырые бизнес-данные по загрузке департаментов
const data = ref<ChartDataPoint[]>([
  { label: 'Management', value: 45 },
  { label: 'HR Dept', value: 60 },
  { label: 'Engineering', value: 88 },
  { label: 'Design Team', value: 72 },
  { label: 'QA Team', value: 55 },
  { label: 'Support', value: 40 },
])

// Параметры SVG сетки
const width = 500
const height = 200
const padding = 40

// Индекс колонки, на которую навели курсор (для Tooltip)
const hoveredIndex = ref<number | null>(null)

// Автоматический расчет координат для столбцов
const bars = computed(() => {
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  const barWidth = chartWidth / data.value.length

  return data.value.map((item, index) => {
    // Вычисляем высоту столбца относительно максимального значения (100%)
    const barHeight = (item.value / 100) * chartHeight
    const x = padding + index * barWidth + barWidth * 0.15 // Сдвиг + зазор
    const y = height - padding - barHeight
    const currentBarWidth = barWidth * 0.7 // Чистая ширина столбца

    return {
      x,
      y,
      width: currentBarWidth,
      height: barHeight,
      label: item.label,
      value: item.value,
    }
  })
})
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
    <div>
      <h3 class="text-sm font-semibold text-slate-900">Загрузка ресурсов по отделам</h3>
      <p class="text-xs text-slate-400 mt-0.5">Оптимальный уровень утилизации: 70-85%</p>
    </div>

    <!-- Реактивный адаптивный контейнер для SVG -->
    <div class="relative w-full aspect-[5/2]">
      <svg :viewBox="`0 0 ${width} ${height}`" class="w-full h-full overflow-visible">
        <!-- 1. Горизонтальные линии сетки (Y-Axis Grid) -->
        <g class="stroke-slate-100 stroke-1" stroke-dasharray="4">
          <line :x1="padding" :y1="height - padding" :x2="width - padding" :y2="height - padding" />
          <line
            :x1="padding"
            :y1="height - padding - 60"
            :x2="width - padding"
            :y2="height - padding - 60"
          />
          <line
            :x1="padding"
            :y1="height - padding - 120"
            :x2="width - padding"
            :y2="height - padding - 120"
          />
        </g>

        <!-- 2. Подписи по оси Y -->
        <g class="fill-slate-400 text-[10px] font-medium" text-anchor="end">
          <text :x="padding - 10" :y="height - padding + 4">0%</text>
          <text :x="padding - 10" :y="height - padding - 60 + 4">50%</text>
          <text :x="padding - 10" :y="height - padding - 120 + 4">100%</text>
        </g>

        <!-- 3. Отрендеренные столбцы данных (Bars) -->
        <g v-for="(bar, index) in bars" :key="index">
          <!-- Задняя невидимая широкая зона для легкого наведения мыши (UX) -->
          <rect
            :x="bar.x - 5"
            :y="0"
            :width="bar.width + 10"
            :height="height - padding"
            fill="transparent"
            class="cursor-pointer"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
          />

          <!-- Реальный цветной столбец -->
          <rect
            :x="bar.x"
            :y="bar.y"
            :width="bar.width"
            :height="bar.height"
            rx="4"
            :class="[
              'transition-all duration-300 pointer-events-none',
              bar.value > 85
                ? 'fill-rose-500'
                : bar.value >= 70
                  ? 'fill-emerald-500'
                  : 'fill-blue-500',
              hoveredIndex === index ? 'opacity-100 filter drop-shadow-md' : 'opacity-85',
            ]"
          />

          <!-- Подписи по оси X -->
          <text
            :x="bar.x + bar.width / 2"
            :y="height - padding + 16"
            text-anchor="middle"
            class="fill-slate-500 text-[9px] font-semibold tracking-tight pointer-events-none"
          >
            {{ bar.label }}
          </text>
        </g>
      </svg>

      <!-- 4. HTML-инструмент подсказки (Floating Custom Tooltip) -->
      <div
        v-if="hoveredIndex !== null"
        class="absolute z-10 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-xl font-medium -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-150"
        :style="{
          left: `${((bars[hoveredIndex].x + bars[hoveredIndex].width / 2) / width) * 100}%`,
          top: `${(bars[hoveredIndex].y / height) * 100 - 4}%`,
        }"
      >
        <div class="font-bold">{{ bars[hoveredIndex].value }}%</div>
        <div class="text-[10px] text-slate-400 font-normal">Загрузка отдела</div>
      </div>
    </div>
  </div>
</template>
