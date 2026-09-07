<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
    <h1 class="text-6xl font-black text-slate-900">404</h1>
    <p class="text-xl font-bold text-slate-800 mt-4">Страница не найдена</p>
    <p class="text-sm text-slate-500 mt-2 max-w-xs">
      Извините, запрашиваемая вами страница не существует или была перемещена.
    </p>
    <router-link
      to="/"
      class="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-500 underline"
    >
      Вернуться на главную
    </router-link>
  </div>
</template>
