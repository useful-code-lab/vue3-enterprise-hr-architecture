import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

// Глобальный синглтон-стейт вне хука, чтобы уведомления можно было вызывать из любого места приложения
const toasts = ref<Toast[]>([])

export function useToast() {
  /**
   * Показать всплывающее уведомление
   * @param message Текст сообщения
   * @param type Тип уведомления (success, error, info)
   * @param duration Время показа в миллисекундах (дефолт: 4000мс)
   */
  const show = (message: string, type: ToastType = 'success', duration = 4000) => {
    const id = `toast_${Math.floor(Math.random() * 100000)}`

    toasts.value.push({ id, message, type })

    // Автоматическое удаление тоста по истечении таймера
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, duration)
  }

  return {
    toasts,
    show,
  }
}
