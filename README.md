# AuraHQ — Enterprise HR & Resource Management Platform

AuraHQ — это высокомасштабируемое клиентское приложение для управления персоналом и операционными метриками компании. Проект спроектирован по методологии **Feature-Driven Design (FSD)** на стеке Vue 3 актуального сезона 2026 года.

## 🛠 Технологический стек

- **Core:** Vue 3 (Composition API, `<script setup>`)
- **Language:** TypeScript (Strict Mode)
- **State Management:** Pinia (Setup-Stores)
- **Routing:** Vue Router 4 (Dynamic Lazy Loading, RBAC Guards)
- **Styles:** Tailwind CSS v4 (LightningCSS, Native CSS Theme Variables)
- **Network Layer:** Axios + Custom Token Refresh Interceptors Queue
- **API Mocking:** Mock Service Worker v2 (In-Browser InMemory DB)
- **Quality Control:** ESLint (Flat Config) + Prettier + Husky + lint-staged
- **Testing:** Vitest (Happy-DOM environment)

## 📂 Архитектурная структура (FSD)

```text
src/
├── app/                  # Инициализация (роутер, pinia, глобальные стили)
├── pages/                # Контейнеры экранов (Dashboard, Employees, Login, Error)
├── widgets/              # Крупные блоки интерфейса (Sidebar, Header, Analytics)
├── features/             # Пользовательские сценарии/фичи (AddEmployee, EditEmployee, DeleteEmployee)
├── entities/             # Бизнес-сущности приложения (User, Employee)
└── shared/               # Переиспользуемый базис (UI-кит, API-клиент, хелперы, темы)
    ├── api/              # Настройки Axios-клиента и эндпоинты
    ├── lib/              # Системные composables (toast, theme)
    └── ui/               # Глупые UI-компоненты (BaseButton, BaseInput, BaseModal, BaseToaster)
```

## 🚀 Инженерные решения (Senior-уровень)

1. **Role-Based Access Control (RBAC):** Маршруты защищены декларативно. Переходы на страницы администрирования автоматически блокируются для рядовых сотрудников на уровне навигационных гвардов.
2. **Failed Requests Queue:** При истечении `accessToken` сетевой слой приостанавливает все параллельные запросы, выполняет ровно один запрос на `/refresh`, обновляет сессию и прозрачно перезапускает зависшую очередь.
3. **Semantic CSS Themes:** Поддержка `Dark Mode` реализована без дублирования утилитарных классов. Палитра завязана на CSS-переменные внутри контекста `html[data-theme="dark"]`.
4. **Accessible UI (A11y):** Базовые компоненты ввода и модальных окон поддерживают спецификации `WAI-ARIA` (`aria-invalid`, `role="dialog"`, управление фокусом клавиатуры по кнопке `Escape`).

## 🖼️ Визуальный интерфейс системы (Production Preview)

### 1. Аналитический Дашборд & Дизайн-система (Tailwind v4)
Главный экран включает в себя адаптивную сетку финансовых и операционных KPI, а также интерактивный SVG-график утилизации ресурсов команд с поддержкой бесшовного переключения `Light / Dark Mode` на базе CSS-переменных.
![alt text](doc/image.png)
### 2. Слой Управления персоналом (Data Table & CRUD)
Страница `/employees` представляет собой полноценный рабочий интерфейс со встроенной постраничной пагинацией, предотвращающей баги Race Conditions, динамической фильтрацией и изолированными контекстными фичами изменения и удаления записей.
![alt text](doc/image-2.png)
![alt text](doc/image-3.png)

## ⚙️ Установка и запуск

### 1. Клонирование репозитория и установка зависимостей
```bash
git clone https://github.com
cd aura-hq
npm install
```

### 2. Запуск сервера для локальной разработки
```bash
npm run dev
```
*Локальный сервер разработки Vite запустится по адресу `http://localhost:5173/`. Сетевое мокание через MSW активируется автоматически в консоли браузера.*

### 3. Запуск изолированных Unit-тестов
```bash
npm run test:unit
```

### 4. Линтинг и проверка качества кода
```bash
npm run lint
```

## 🔒 Тестовые данные для входа
Для авторизации в системе и тестирования ролевой модели (Admin) используйте следующие учетные данные на странице `/login`:
- **Логин:** `admin@aurahq.io`
- **Пароль:** `123456`
