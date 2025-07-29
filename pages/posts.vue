<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-white">Поиск и фильтрация постов</h1>
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <input
          v-model="search"
          type="text"
          placeholder="Поиск по заголовку..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="debouncedSearch"
        />
        <select
          v-model="userId"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="resetPaginationAndLoad"
        >
          <option value="">Все авторы</option>
          <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
        </select>
        <button
          @click="resetPaginationAndLoad"
          :disabled="isLoading"
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {{ isLoading ? 'Загрузка...' : 'Поиск' }}
        </button>
        <button
          @click="clearFilters"
          :disabled="isLoading || (!search && !userId)"
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Очистить
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">Загрузка постов...</p>
    </div>
    <div v-else-if="error" class="text-center py-12 text-red-600">
      {{ error }}
    </div>
    <div v-else-if="displayedPosts.length" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="post in displayedPosts"
          :key="post.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{{ post.title }}</h2>
            <p class="text-gray-600 mb-4 line-clamp-3">{{ post.body }}</p>
            <div class="flex justify-between items-center text-sm text-gray-500">
              <span>Автор: {{ getUserName(post.userId) }}</span>
              <span>ID: {{ post.id }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Пагинация -->
      <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Назад
        </button>
        
        <div class="flex space-x-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-2 border rounded-md',
              page === currentPage
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Вперед →
        </button>
      </div>
      
      <div class="text-center text-sm text-gray-500">
        Показано {{ startIndex + 1 }}-{{ endIndex }} из {{ filteredPosts.length }} постов
      </div>
    </div>
    <div v-else class="text-center py-12 text-gray-500">
      Посты не найдены
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { z } from 'zod'
import { $fetch } from 'ofetch'
import mockPosts from '~/mocks/posts.json'

const PostSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
})
type Post = z.infer<typeof PostSchema>

interface User {
  id: number
  name: string
}

// Используем composables
const { setPageSeo } = useSeo()
const { data: posts, isLoading, error } = useApiData(PostSchema)
const { loadWithFallback } = useFallbackData(PostSchema)

// Дополнительные состояния
const users = ref<User[]>([])
const userId = ref<string | number>('')
const isInitialLoad = ref(true)

// Устанавливаем SEO
setPageSeo('Посты | MyApp', 'Поиск и фильтрация постов в MyApp')

// Поиск и фильтрация
const { search, filteredItems: filteredPosts, debouncedSearch } = useSearch(
  posts, 
  ['title'], 
  700
)

// Пагинация
const { 
  currentPage, 
  totalPages, 
  startIndex, 
  endIndex, 
  displayedItems: displayedPosts, 
  visiblePages,
  prevPage, 
  nextPage, 
  goToPage, 
  resetPagination 
} = usePagination(filteredPosts, 15)

// Вспомогательные функции
const getUserName = (id: number) => {
  const user = users.value.find(u => u.id === id)
  return user ? user.name : `User #${id}`
}

const loadUsers = async () => {
  try {
    users.value = await $fetch<User[]>('https://jsonplaceholder.typicode.com/users')
  } catch (e) {
    users.value = []
  }
}

const resetPaginationAndLoad = () => {
  resetPagination()
  loadPosts()
}

const loadPosts = async () => {
  isLoading.value = true
  try {
    const data = await loadWithFallback(
      'https://jsonplaceholder.typicode.com/posts',
      mockPosts,
      'Данные с внешнего API недоступны, показаны локальные данные.'
    )
    posts.value = data
  } catch (e: any) {
    error.value = e.message
    posts.value = []
  } finally {
    isLoading.value = false
    isInitialLoad.value = false
  }
}

const clearFilters = () => {
  search.value = ''
  userId.value = ''
  resetPagination()
  loadPosts()
}

onMounted(() => {
  loadUsers()
  loadPosts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 