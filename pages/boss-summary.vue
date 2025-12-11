<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Boss Summary</h1>
        <p class="text-lg text-gray-600">
          Таблица приоритетов предметов по боссам в стиле Raidbots
        </p>
      </div>

      <!-- Управление данными -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Управление данными</h2>
        
        <div class="space-y-4">
          <div class="flex space-x-4">
            <button
              @click="loadSampleData"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Загрузить пример данных
            </button>
            
            <button
              @click="loadRealIcons"
              class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Загрузить реальные иконки
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

      <!-- Таблица Boss Summary в стиле Raidbots -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">BOSS SUMMARY</h2>
          <div class="flex space-x-2">
            <button class="px-3 py-1 text-sm border border-yellow-400 bg-yellow-50 text-yellow-700 rounded">
              Boss Order
            </button>
            <button class="px-3 py-1 text-sm border border-gray-300 bg-gray-50 text-gray-700 rounded">
              Sort
            </button>
            <button class="px-3 py-1 text-sm border border-gray-300 bg-gray-50 text-gray-700 rounded">
              Priority
            </button>
            <button class="px-3 py-1 text-sm border border-gray-300 bg-gray-50 text-gray-700 rounded">
              Expected Value
            </button>
            <button class="px-3 py-1 text-sm border border-gray-300 bg-gray-50 text-gray-700 rounded">
              Best
            </button>
            <div class="flex items-center space-x-2">
              <input type="checkbox" id="relative-dps" class="rounded">
              <label for="relative-dps" class="text-sm text-gray-600">Relative DPS</label>
            </div>
          </div>
        </div>

        <!-- Таблица -->
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Boss
                </th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Expected Value
                </th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Best
                </th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="boss in bossSummary" :key="boss.bossName" class="hover:bg-gray-50">
                <td class="py-4 px-4">
                  <div class="flex items-center space-x-3">
                    <!-- Иконка босса -->
                    <div class="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                      <span class="text-purple-600 text-sm">👹</span>
                    </div>
                    <span class="text-sm font-medium text-gray-900">{{ boss.bossName }}</span>
                  </div>
                </td>
                                 <td class="py-4 px-4">
                   <div class="flex flex-wrap gap-2">
                     <div v-for="(item, index) in boss.items" :key="index" 
                          class="flex flex-col items-center group relative">
                       <!-- Иконка предмета -->
                       <div class="w-8 h-8 rounded border border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100">
                         <img 
                           :src="getItemIconUrl(item.itemId)" 
                           :alt="item.itemName"
                           class="w-full h-full object-cover"
                           @error="$event.target.style.display='none'; $event.target.nextElementSibling.style.display='flex'"
                         />
                         <div class="w-full h-full bg-gray-200 flex items-center justify-center text-xs" style="display: none;">
                           📦
                         </div>
                       </div>
                       <!-- Процент апгрейда -->
                       <span class="text-xs mt-1 font-medium"
                             :class="getUpgradeColorClass(item.upgradePercent)">
                         {{ item.upgradePercent > 0 ? '+' : '' }}{{ item.upgradePercent.toFixed(1) }}%
                       </span>
                       <!-- Tooltip с названием предмета -->
                       <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                         {{ item.itemName }}
                       </div>
                     </div>
                   </div>
                 </td>
                <td class="py-4 px-4">
                  <span class="text-sm font-medium text-green-600">{{ boss.expectedValue }}</span>
                </td>
                <td class="py-4 px-4">
                  <span class="text-sm font-medium text-green-600">{{ boss.bestValue }}</span>
                </td>
                <td class="py-4 px-4">
                  <span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                        :class="getPriorityColorClass(parseInt(boss.priority) - 1)">
                    {{ boss.priority }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Информационный текст -->
        <div class="mt-4 text-xs text-gray-500">
          DPS compared to your current gear. Highlighted icons indicate 0.05% or better DPS increase. 
          <a href="#" class="text-blue-600 hover:underline">More Info</a>
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
import { useSeoStore } from '~/stores/seo'
import { useWowIcons } from '~/composables/useWowIcons'

const seo = useSeoStore()
seo.setSeo({
  title: 'Boss Summary - Raidbots Style',
  description: 'Таблица приоритетов предметов по боссам в стиле Raidbots'
})

// Используем composable для иконок
const { getItemIconUrl, preloadItemIcons } = useWowIcons()

// Реактивные данные
const error = ref('')
const bossSummary = ref([])

// Пример данных из скриншота Raidbots с ID предметов
const sampleData = [
  {
    bossName: 'Plexus Sentinel',
    items: [
      { upgradePercent: 0.0, itemId: 207162, itemName: 'Band of the Shattered Soul' },
      { upgradePercent: -1.0, itemId: 207163, itemName: 'Ring of the Void' },
      { upgradePercent: -1.6, itemId: 207164, itemName: 'Amulet of Power' },
      { upgradePercent: -11.0, itemId: 207165, itemName: 'Cloak of Shadows' }
    ],
    expectedValue: '+34 DPS',
    bestValue: '+135 DPS',
    priority: '5'
  },
  {
    bossName: 'Loom\'ithar',
    items: [
      { upgradePercent: 0.8, itemId: 207166, itemName: 'Staff of the Void' },
      { upgradePercent: -2.2, itemId: 207167, itemName: 'Dagger of Shadows' },
      { upgradePercent: 0.0, itemId: 207168, itemName: 'Wand of Power' }
    ],
    expectedValue: '+9 523 DPS',
    bestValue: '+28 568 DPS',
    priority: '3'
  },
  {
    bossName: 'Soulbinder Naazindhri',
    items: [
      { upgradePercent: 1.1, itemId: 207169, itemName: 'Helm of the Void' },
      { upgradePercent: 0.4, itemId: 207170, itemName: 'Shoulders of Power' },
      { upgradePercent: -0.3, itemId: 207171, itemName: 'Chest of Shadows' },
      { upgradePercent: -0.7, itemId: 207172, itemName: 'Gloves of the Void' },
      { upgradePercent: -1.0, itemId: 207173, itemName: 'Belt of Power' }
    ],
    expectedValue: '+10 749 DPS',
    bestValue: '+38 482 DPS',
    priority: '3'
  },
  {
    bossName: 'Forgeweaver Araz',
    items: [
      { upgradePercent: -0.1, itemId: 207174, itemName: 'Boots of Shadows' },
      { upgradePercent: -0.8, itemId: 207175, itemName: 'Bracers of the Void' },
      { upgradePercent: -1.1, itemId: 207176, itemName: 'Necklace of Power' },
      { upgradePercent: -3.1, itemId: 207177, itemName: 'Trinket of Shadows' }
    ],
    expectedValue: '0 DPS',
    bestValue: '0 DPS',
    priority: '-'
  },
  {
    bossName: 'The Soul Hunters',
    items: [
      { upgradePercent: 2.4, itemId: 207178, itemName: 'Sword of the Void' },
      { upgradePercent: 0.1, itemId: 207179, itemName: 'Shield of Power' },
      { upgradePercent: -1.9, itemId: 207180, itemName: 'Axe of Shadows' },
      { upgradePercent: -2.7, itemId: 207181, itemName: 'Mace of the Void' }
    ],
    expectedValue: '+21 283 DPS',
    bestValue: '+83 043 DPS',
    priority: '1'
  },
  {
    bossName: 'Fractillus',
    items: [
      { upgradePercent: 1.6, itemId: 207182, itemName: 'Bow of Power' },
      { upgradePercent: -0.1, itemId: 207183, itemName: 'Crossbow of Shadows' },
      { upgradePercent: -0.6, itemId: 207184, itemName: 'Gun of the Void' },
      { upgradePercent: -2.5, itemId: 207185, itemName: 'Throwing Knife of Power' },
      { upgradePercent: -10.0, itemId: 207186, itemName: 'Spear of Shadows' }
    ],
    expectedValue: '+11 372 DPS',
    bestValue: '+56 860 DPS',
    priority: '3'
  },
  {
    bossName: 'Nexus-King Salhadaar',
    items: [
      { upgradePercent: 2.1, itemId: 207187, itemName: 'Staff of Power' },
      { upgradePercent: 0.1, itemId: 207188, itemName: 'Wand of the Void' },
      { upgradePercent: -1.4, itemId: 207189, itemName: 'Dagger of Shadows' },
      { upgradePercent: -1.8, itemId: 207190, itemName: 'Sword of Power' },
      { upgradePercent: -2.0, itemId: 207191, itemName: 'Axe of the Void' }
    ],
    expectedValue: '+15 576 DPS',
    bestValue: '+73 006 DPS',
    priority: '2'
  },
  {
    bossName: 'Dimensius, the All-Devouring',
    items: [
      { upgradePercent: 1.4, itemId: 207192, itemName: 'Helm of Power' },
      { upgradePercent: 0.3, itemId: 207193, itemName: 'Shoulders of Shadows' },
      { upgradePercent: -0.1, itemId: 207194, itemName: 'Chest of the Void' },
      { upgradePercent: -0.3, itemId: 207195, itemName: 'Gloves of Power' },
      { upgradePercent: -2.0, itemId: 207196, itemName: 'Belt of Shadows' },
      { upgradePercent: -2.5, itemId: 207197, itemName: 'Boots of the Void' },
      { upgradePercent: -2.7, itemId: 207198, itemName: 'Bracers of Power' }
    ],
    expectedValue: '+6 577 DPS',
    bestValue: '+48 944 DPS',
    priority: '4'
  },
  {
    bossName: 'Trash Drop',
    items: [
      { upgradePercent: 0.9, itemId: 207199, itemName: 'Necklace of Shadows' },
      { upgradePercent: -10.0, itemId: 207200, itemName: 'Ring of Power' },
      { upgradePercent: -12.0, itemId: 207201, itemName: 'Trinket of the Void' }
    ],
    expectedValue: '+10 866 DPS',
    bestValue: '+32 599 DPS',
    priority: '3'
  }
]



// Методы
const loadSampleData = async () => {
  bossSummary.value = sampleData
  error.value = ''
  
  // Предзагружаем иконки всех предметов
  try {
    const allItems = sampleData.flatMap(boss => boss.items)
    await preloadItemIcons(allItems)
    console.log('Иконки предметов предзагружены')
  } catch (error) {
    console.error('Ошибка предзагрузки иконок:', error)
  }
}

const loadRealIcons = async () => {
  if (bossSummary.value.length === 0) {
    error.value = 'Сначала загрузите данные'
    return
  }
  
  try {
    const allItems = bossSummary.value.flatMap(boss => boss.items)
    await preloadItemIcons(allItems)
    console.log('Реальные иконки предметов загружены')
    error.value = ''
  } catch (error) {
    console.error('Ошибка загрузки иконок:', error)
    error.value = 'Ошибка загрузки иконок: ' + error.message
  }
}

const clearData = () => {
  bossSummary.value = []
  error.value = ''
}

// Вспомогательные методы для стилизации
const getUpgradeColorClass = (percent) => {
  if (percent >= 0.05) return 'text-green-600' // Зеленый для положительных
  if (percent >= 0) return 'text-gray-600' // Серый для нулевых
  return 'text-red-600' // Красный для отрицательных
}

const getPriorityColorClass = (index) => {
  if (index === 0) return 'bg-green-100 text-green-800'
  if (index === 1) return 'bg-yellow-100 text-yellow-800'
  if (index === 2) return 'bg-orange-100 text-orange-800'
  if (index === 3) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}
</script>
