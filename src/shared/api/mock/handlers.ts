import { http, HttpResponse } from 'msw'

export const handlers = [
  // Имитируем ручку получения профиля /auth/me
  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 })
    }

    // Возвращаем фейковый профиль сотрудника уровня Senior
    return HttpResponse.json({
      id: 'usr_99210',
      email: 'alex@aurahq.io',
      name: 'Алексей',
      role: 'admin',
      avatarUrl: 'https://dicebear.com',
    })
  }),

  // Имитируем ручку обновления токенов
  http.post('/api/auth/refresh', () => {
    return HttpResponse.json({
      accessToken: 'new-secure-access-token',
      newRefreshToken: 'new-secure-refresh-token',
    })
  }),
]
