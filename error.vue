<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-blue-600 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Страница не найдена</h2>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        Извините, запрашиваемая страница не существует или была перемещена.
      </p>
      <div class="flex gap-4 justify-center">
        <button 
          @click="handleError"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Вернуться назад
        </button>
        <NuxtLink 
          to="/"
          class="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          На главную
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const handleError = () => {
  clearError({ redirect: '/' })
}
</script> 