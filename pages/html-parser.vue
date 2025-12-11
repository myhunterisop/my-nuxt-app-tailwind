<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">HTML Parser для Raidbots</h1>
        <p class="text-lg text-gray-600">
          Анализ HTML структуры отчета для извлечения данных DropOptimizer
        </p>
      </div>

      <!-- Форма ввода отчета -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Анализ отчета</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ID отчета Raidbots
            </label>
            <input
              v-model="reportId"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="uYXUNdDPZrz8LJcVaLGubn"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              CSS селекторы для поиска (по одному на строку)
            </label>
            <textarea
              v-model="selectors"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=".drop-optimizer-table&#10;.upgrade-item&#10;[data-item-id]"
            ></textarea>
          </div>

          <div class="flex space-x-4">
            <button
              @click="analyzeReport"
              :disabled="loading"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Анализ...' : 'Анализировать' }}
            </button>
            
            <button
              @click="clearResults"
              class="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              Очистить
            </button>
          </div>
        </div>
      </div>

      <!-- Результаты анализа -->
      <div v-if="analysisResults" class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Результаты анализа</h2>
        
        <div class="space-y-4">
          <div v-for="(result, selector) in analysisResults" :key="selector" class="border rounded-lg p-4">
            <h3 class="font-semibold text-lg mb-2">Селектор: <code class="bg-gray-100 px-2 py-1 rounded">{{ selector }}</code></h3>
            <p class="text-sm text-gray-600 mb-2">Найдено элементов: {{ result.length }}</p>
            
            <div v-if="result.length > 0" class="space-y-2">
              <div v-for="(element, index) in result.slice(0, 5)" :key="index" class="border-l-4 border-blue-500 pl-4">
                <div class="text-sm">
                  <strong>Текст:</strong> {{ element.text?.substring(0, 100) }}{{ element.text?.length > 100 ? '...' : '' }}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  <strong>Атрибуты:</strong> {{ JSON.stringify(element.attributes) }}
                </div>
              </div>
              
              <div v-if="result.length > 5" class="text-sm text-gray-500">
                ... и еще {{ result.length - 5 }} элементов
              </div>
            </div>
            
            <div v-else class="text-gray-500">
              Элементы не найдены
            </div>
          </div>
        </div>
      </div>

      <!-- Предустановленные селекторы -->
      <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 class="text-sm font-medium text-blue-800 mb-2">Полезные селекторы для тестирования:</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <strong>Таблицы:</strong>
            <ul class="list-disc list-inside ml-4">
              <li><code>table</code></li>
              <li><code>.table</code></li>
              <li><code>[class*="table"]</code></li>
            </ul>
          </div>
          <div>
            <strong>Предметы:</strong>
            <ul class="list-disc list-inside ml-4">
              <li><code>[data-item-id]</code></li>
              <li><code>.item</code></li>
              <li><code>[class*="item"]</code></li>
            </ul>
          </div>
          <div>
            <strong>Апгрейды:</strong>
            <ul class="list-disc list-inside ml-4">
              <li><code>[class*="upgrade"]</code></li>
              <li><code>[class*="drop"]</code></li>
              <li><code>.upgrade-item</code></li>
            </ul>
          </div>
          <div>
            <strong>Проценты:</strong>
            <ul class="list-disc list-inside ml-4">
              <li><code>[class*="percent"]</code></li>
              <li><code>[class*="upgrade"]</code></li>
              <li><code>.upgrade-percent</code></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Сообщения об ошибках -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mt-8">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Ошибка</h3>
            <div class="mt-2 text-sm text-red-700">{{ error }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRaidbotsHtmlParser } from '~/composables/useRaidbotsHtmlParser'
import { useSeoStore } from '~/stores/seo'

const seo = useSeoStore()
seo.setSeo({
  title: 'HTML Parser для Raidbots',
  description: 'Анализ HTML структуры отчета Raidbots для извлечения данных DropOptimizer'
})

const { getReportHtml, extractDataFromBlocks } = useRaidbotsHtmlParser()

// Реактивные данные
const reportId = ref('uYXUNdDPZrz8LJcVaLGubn')
const selectors = ref('table\n.boss-summary\n[class*="boss"]\n[class*="summary"]\n[class*="drop"]\n[class*="loot"]\n[class*="item"]\n[class*="upgrade"]\n[class*="percent"]')
const loading = ref(false)
const error = ref('')
const analysisResults = ref(null)

// Методы
const analyzeReport = async () => {
  if (!reportId.value.trim()) {
    error.value = 'Пожалуйста, введите ID отчета'
    return
  }

  if (!selectors.value.trim()) {
    error.value = 'Пожалуйста, введите CSS селекторы'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const html = await getReportHtml(reportId.value)
    const selectorList = selectors.value
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    analysisResults.value = extractDataFromBlocks(html, selectorList)
    
    console.log('Результаты анализа:', analysisResults.value)
  } catch (err) {
    error.value = err.message || 'Произошла ошибка при анализе отчета'
    console.error('Ошибка анализа отчета:', err)
  } finally {
    loading.value = false
  }
}

const clearResults = () => {
  analysisResults.value = null
  error.value = ''
}
</script>
