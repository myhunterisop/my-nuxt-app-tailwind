<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Raidbots DropOptimizer Анализатор</h1>
        <p class="text-lg text-gray-600">
          Автоматизация процесса распределения предметов между игроками
        </p>
      </div>

      <!-- Форма ввода отчетов -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Ввод отчетов</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ID отчетов Raidbots (по одному на строку)
            </label>
            <textarea
              v-model="reportIds"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="82DBFUtwpqLpfh5CC2zJM1&#10;another-report-id&#10;third-report-id"
            ></textarea>
            <p class="text-sm text-gray-500 mt-1">
              Вставьте ID отчетов из URL: https://www.raidbots.com/simbot/report/82DBFUtwpqLpfh5CC2zJM1
            </p>
          </div>

          <div class="flex space-x-4">
            <button
              @click="loadReports"
              :disabled="loading"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Загрузка...' : 'Загрузить отчеты' }}
            </button>
            
            <button
              @click="clearData"
              class="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              Очистить
            </button>
          </div>
        </div>
      </div>

      <!-- Фильтры -->
      <div v-if="priorities.length > 0" class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Фильтры</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Поиск предмета
            </label>
            <input
              v-model="itemFilter"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Название предмета..."
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Минимальный апгрейд (%)
            </label>
            <input
              v-model.number="minUpgradeFilter"
              type="number"
              min="0"
              max="100"
              step="0.1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Класс персонажа
            </label>
            <select
              v-model="classFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Все классы</option>
                             <option v-for="characterClass in availableClasses" :key="characterClass" :value="characterClass">
                 {{ characterClass }}
               </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Таблица приоритетов -->
      <div v-if="filteredPriorities.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-semibold">Таблица приоритетов предметов</h2>
          <button
            @click="exportToCSV"
            class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Экспорт в CSV
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Предмет
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Кандидат
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Класс
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Специализация
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Апгрейд (%)
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Приоритет
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-for="priority in filteredPriorities" :key="priority.itemId">
                <tr v-for="(candidate, index) in priority.candidates" :key="`${priority.itemId}-${index}`">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ priority.itemName }}
                    </div>
                    <div class="text-sm text-gray-500">
                      ID: {{ priority.itemId }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ candidate.characterName }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ candidate.characterClass }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ candidate.characterSpec }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ candidate.upgradePercent.toFixed(1) }}%
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-green-600 h-2 rounded-full"
                        :style="{ width: `${Math.min(candidate.upgradePercent * 2, 100)}%` }"
                      ></div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        index === 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ index + 1 }}
                    </span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Сообщения об ошибках -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
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

      <!-- Информация -->
      <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">Как использовать</h3>
            <div class="mt-2 text-sm text-blue-700">
                             <ul class="list-disc list-inside space-y-1">
                 <li>Создайте отчеты DropOptimizer в Raidbots для каждого игрока</li>
                 <li>Убедитесь, что отчеты имеют статус "complete" (завершены)</li>
                 <li>Скопируйте ID отчетов из URL (например: 82DBFUtwpqLpfh5CC2zJM1)</li>
                 <li>Вставьте ID в текстовое поле, по одному на строку</li>
                 <li>Нажмите "Загрузить отчеты" для получения таблицы приоритетов</li>
                 <li>Используйте фильтры для поиска конкретных предметов или классов</li>
                 <li>Экспортируйте результаты в CSV для дальнейшего использования</li>
               </ul>
               <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                 <p class="text-sm text-yellow-800">
                   <strong>Важно:</strong> Отчеты должны быть типа "DropOptimizer" и содержать данные об апгрейдах предметов. 
                   Если отчет не содержит данных DropOptimizer, система не сможет создать таблицу приоритетов.
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRaidbotsApi } from '~/composables/useRaidbotsApi'
import { useSeoStore } from '~/stores/seo'

const seo = useSeoStore()
seo.setSeo({
  title: 'Raidbots DropOptimizer Анализатор',
  description: 'Автоматизация распределения предметов между игроками на основе отчетов Raidbots'
})

const { getAllItemPriorities, exportToCSV: exportToCSVUtil } = useRaidbotsApi()

// Реактивные данные
const reportIds = ref('')
const priorities = ref([])
const loading = ref(false)
const error = ref('')

// Фильтры
const itemFilter = ref('')
const minUpgradeFilter = ref(0)
const classFilter = ref('')

// Вычисляемые свойства
const availableClasses = computed(() => {
  const classes = new Set()
  priorities.value.forEach(priority => {
    priority.candidates.forEach(candidate => {
      classes.add(candidate.characterClass)
    })
  })
  return Array.from(classes).sort()
})

const filteredPriorities = computed(() => {
  return priorities.value
    .filter(priority => {
      // Фильтр по названию предмета
      if (itemFilter.value && !priority.itemName.toLowerCase().includes(itemFilter.value.toLowerCase())) {
        return false
      }
      
      // Фильтр по минимальному апгрейду
      if (minUpgradeFilter.value > 0) {
        const maxUpgrade = Math.max(...priority.candidates.map(c => c.upgradePercent))
        if (maxUpgrade < minUpgradeFilter.value) {
          return false
        }
      }
      
      // Фильтр по классу
      if (classFilter.value) {
        const hasClass = priority.candidates.some(c => c.characterClass === classFilter.value)
        if (!hasClass) {
          return false
        }
      }
      
      return true
    })
    .map(priority => ({
      ...priority,
      candidates: priority.candidates.filter(candidate => {
        // Фильтр по классу для кандидатов
        if (classFilter.value && candidate.characterClass !== classFilter.value) {
          return false
        }
        
        // Фильтр по минимальному апгрейду для кандидатов
        if (minUpgradeFilter.value > 0 && candidate.upgradePercent < minUpgradeFilter.value) {
          return false
        }
        
        return true
      })
    }))
    .filter(priority => priority.candidates.length > 0)
})

// Методы
const loadReports = async () => {
  if (!reportIds.value.trim()) {
    error.value = 'Пожалуйста, введите ID отчетов'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const ids = reportIds.value
      .split('\n')
      .map(id => id.trim())
      .filter(id => id.length > 0)

    if (ids.length === 0) {
      throw new Error('Не найдено валидных ID отчетов')
    }

    priorities.value = await getAllItemPriorities(ids)
    
         if (priorities.value.length === 0) {
       error.value = 'Не удалось получить данные из отчетов. Проверьте ID отчетов и убедитесь, что отчеты содержат данные DropOptimizer. Также убедитесь, что отчеты имеют статус "complete".'
     }
  } catch (err) {
    error.value = err.message || 'Произошла ошибка при загрузке отчетов'
    console.error('Ошибка загрузки отчетов:', err)
  } finally {
    loading.value = false
  }
}

const clearData = () => {
  reportIds.value = ''
  priorities.value = []
  error.value = ''
  itemFilter.value = ''
  minUpgradeFilter.value = 0
  classFilter.value = ''
}

const exportToCSV = () => {
  const csvContent = exportToCSVUtil(filteredPriorities.value)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `raidbots-priorities-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>
