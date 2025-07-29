<template>
    <div class="min-h-screen flex flex-col bg-white text-gray-900">
      <header class="w-full border-b border-gray-200 py-4 px-6 flex items-center justify-between bg-white shadow-sm">
        <!-- Логотип и навигация -->
        <div class="flex items-center gap-3">
          <span class="font-bold text-xl tracking-widest">LOGO</span>
        </div>
        <nav class="hidden md:flex gap-8 text-sm uppercase tracking-widest">
          <a href="/" class="hover:text-blue-600 transition">Главная</a>
          <a href="/users" class="hover:text-blue-600 transition">Пользователи</a>
          <a href="/posts" class="hover:text-blue-600 transition">Посты</a>
        </nav>
        <div class="flex items-center gap-3">
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Войти</button>
        </div>
      </header>
  
      <main class="flex-1 w-full max-w-5xl mx-auto py-8 px-4">
        <slot />
      </main>
  
      <footer class="w-full border-t border-gray-200 py-6 px-6 text-center text-gray-500 text-sm bg-white mt-8">
        &copy; 2025 MySite. Все права защищены.
      </footer>
    </div>
</template> 