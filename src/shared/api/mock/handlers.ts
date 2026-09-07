import { http, HttpResponse } from 'msw'

interface LoginRequestBody {
  email?: string
  password?: string
}

interface Employee {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'employee'
  department: string
  status: 'active' | 'on_vacation' | 'fired'
}

// Senior-практика: Живая InMemory База Данных в рамках сессии браузера
const employeesDb: Employee[] = [
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
]

export const handlers = [
  // 1. Ручка авторизации (Login)
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

  // 2. Ручка получения профиля /auth/me
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

  // 3. Ручка обновления токенов
  http.post('/api/auth/refresh', () => {
    return HttpResponse.json({
      accessToken: 'valid-senior-access-token',
      newRefreshToken: 'valid-senior-refresh-token',
    })
  }),

  // 4. Получение списка сотрудников (Отдает актуальное состояние базы)
  http.get('/api/employees', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || authHeader !== 'Bearer valid-senior-access-token') {
      return new HttpResponse(null, { status: 401 })
    }

    return HttpResponse.json(employeesDb)
  }),

  // 5. Добавление сотрудника (Мутирует живой массив в памяти)
  http.post('/api/employees', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || authHeader !== 'Bearer valid-senior-access-token') {
      return new HttpResponse(null, { status: 401 })
    }

    const newEmployeeData = (await request.json()) as Omit<Employee, 'id'>

    const createdEmployee: Employee = {
      id: `emp_${Math.floor(Math.random() * 1000)}`,
      ...newEmployeeData,
    }

    // Добавляем новый элемент в нашу InMemory БД
    employeesDb.push(createdEmployee)

    return HttpResponse.json(createdEmployee, { status: 201 })
  }),
]
