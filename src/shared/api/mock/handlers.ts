import { http, HttpResponse } from 'msw'

interface LoginRequestBody {
  email?: string
  password?: string
}

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequestBody

    if (body.email === 'admin@aurahq.io' && body.password === '123456') {
      return HttpResponse.json({
        accessToken: 'valid-senior-access-token',
        refreshToken: 'valid-senior-refresh-token',
      })
    }

    return new HttpResponse(JSON.stringify({ message: 'Неверный Email или пароль' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || authHeader !== 'Bearer valid-senior-access-token') {
      return new HttpResponse(null, { status: 401 })
    }

    return HttpResponse.json({
      id: 'usr_99210',
      email: 'admin@aurahq.io',
      name: 'Алексей (Admin)',
      role: 'admin',
      avatarUrl: 'https://dicebear.com',
    })
  }),

  http.post('/api/auth/refresh', () => {
    return HttpResponse.json({
      accessToken: 'valid-senior-access-token',
      newRefreshToken: 'valid-senior-refresh-token',
    })
  }),
]
