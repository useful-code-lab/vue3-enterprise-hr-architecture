import { fileURLToPath, URL } from 'node:url'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      // КРИТИЧЕСКИЙ НАСТРОЙКА: Запуск только файлов .spec.ts/.test.ts внутри папки src
      include: ['src/**/*.{spec,test}.ts'],
      exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
