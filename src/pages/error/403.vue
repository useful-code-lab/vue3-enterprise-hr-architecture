<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
    <h1 class="text-6xl font-black text-slate-900">403</h1>
    <p class="text-xl font-bold text-slate-800 mt-4">Доступ ограничен</p>
    <p class="text-sm text-slate-500 mt-2 max-w-xs">
      У вашей учетной записи недостаточно прав для просмотра этой страницы.
    </p>
    <router-link
      to="/"
      class="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-500 underline"
    >
      Вернуться на главную
    </router-link>
  </div>
</template>
