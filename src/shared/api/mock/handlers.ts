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

  // Добавьте эту ручку внутрь массива handlers (например, сразу после /api/auth/me)
  http.get('/api/employees', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    // Защита эндпоинта: если токен невалидный — возвращаем 401
    if (!authHeader || authHeader !== 'Bearer valid-senior-access-token') {
      return new HttpResponse(null, { status: 401 })
    }

    // Возвращаем базу данных сотрудников
    return HttpResponse.json([
      {
        id: 'emp_1',
        name: 'Александр Вершинин',
        email: 'a.vershinin@aurahq.io',
        role: 'admin',
        department: 'Management',
        status: 'active',
      },
      {
        id: 'emp_2',
        name: 'Елена Ковалева',
        email: 'e.kovaleva@aurahq.io',
        role: 'manager',
        department: 'HR Dept',
        status: 'active',
      },
      {
        id: 'emp_3',
        name: 'Дмитрий Петров',
        email: 'd.petrov@aurahq.io',
        role: 'employee',
        department: 'Engineering',
        status: 'on_vacation',
      },
      {
        id: 'emp_4',
        name: 'Анна Сидорова',
        email: 'a.sidorova@aurahq.io',
        role: 'employee',
        department: 'Design Team',
        status: 'active',
      },
      {
        id: 'emp_5',
        name: 'Игорь Николаев',
        email: 'i.nikolaev@aurahq.io',
        role: 'employee',
        department: 'Engineering',
        status: 'fired',
      },
    ])
  }),
]
