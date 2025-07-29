<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Пользователи (jsonplaceholder)</h1>
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Список пользователей</h2>
        <button 
          @click="loadUsers" 
          :disabled="isLoading"
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          {{ isLoading ? 'Загрузка...' : 'Обновить' }}
        </button>
      </div>
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-2 text-gray-600">Загрузка пользователей...</p>
      </div>
      <div v-else-if="error && isLoaded" class="text-center py-8">
        <div class="text-red-500 mb-2">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <p class="text-red-600">{{ error }}</p>
        <button 
          @click="loadUsers" 
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Попробовать снова
        </button>
      </div>
      <div v-else-if="users.length && isLoaded" class="space-y-4">
        <div 
          v-for="user in users" 
          :key="user.id"
          class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold text-lg">{{ user.name }}</h3>
              <p class="text-gray-600">{{ user.email }}</p>
              <p class="text-sm text-gray-500">
                Город: {{ user.address?.city }}<br>
                Телефон: {{ user.phone }}
              </p>
            </div>
            <div class="flex space-x-2">
              <a :href="'mailto:' + user.email" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Написать</a>
              <a :href="user.website.startsWith('http') ? user.website : 'http://' + user.website" target="_blank" class="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">Сайт</a>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="isLoaded" class="text-center py-8 text-gray-500">
        Пользователи не найдены
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  address: z.object({ city: z.string() }),
  phone: z.string(),
  website: z.string(),
})
type User = z.infer<typeof UserSchema>

// Используем composables
const { setPageSeo } = useSeo()
const { data: users, isLoading, error, isLoaded, fetchData } = useApiData(UserSchema)

// Устанавливаем SEO
setPageSeo('Пользователи | MyApp', 'Список пользователей приложения MyApp')

// Функция загрузки пользователей
const loadUsers = () => {
  fetchData('https://jsonplaceholder.typicode.com/users')
}
</script> 