import { ref } from 'vue'

type Theme = 'light' | 'dark'

const currentTheme = ref<Theme>('light')

export function useTheme() {
  const initTheme = () => {
    // Проверяем сохраненную тему или системные настройки пользователя
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const theme: Theme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(theme)
  }

  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    localStorage.setItem('theme', theme)

    // Мутируем дата-атрибут тега html
    document.documentElement.setAttribute('data-theme', theme)
  }

  const toggleTheme = () => {
    setTheme(currentTheme.value === 'light' ? 'dark' : 'light')
  }

  return {
    theme: currentTheme,
    initTheme,
    toggleTheme,
  }
}
