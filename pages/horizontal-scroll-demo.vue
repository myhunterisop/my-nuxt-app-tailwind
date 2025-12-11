<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-white">Демо горизонтального скролла с RecycleScroller</h1>
    
    <div class="bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Горизонтальный скролл с виртуализацией</h2>
      
      <HorizontalScroller
        ref="scrollerRef"
        :items="items"
        :item-size="250"
        key-field="id"
        :scroll-step="300"
      >
        <template #default="{ item, index }">
          <div class="item-content">
            <div class="item-header">
              <h3 class="item-title">{{ item.title }}</h3>
              <span class="item-index">#{{ index + 1 }}</span>
            </div>
            <div class="item-body">
              <p>{{ item.description }}</p>
            </div>
            <div class="item-footer">
              <span class="item-category">{{ item.category }}</span>
              <span class="item-date">{{ item.date }}</span>
            </div>
          </div>
        </template>
      </HorizontalScroller>
      
      <div class="mt-4 flex gap-2 flex-wrap">
        <button 
          @click="scrollToStart" 
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          В начало
        </button>
        <button 
          @click="scrollToEnd" 
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          В конец
        </button>
        <button 
          @click="scrollToRandom" 
          class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Случайный элемент
        </button>
        <button 
          @click="addItem" 
          class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Добавить элемент
        </button>
      </div>
    </div>
    
    <div class="bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
      <h2 class="text-xl font-semibold mb-4">Особенности реализации</h2>
      <ul class="space-y-2 text-gray-700">
        <li>✅ <strong>Горизонтальный скролл колесом мыши</strong> - работает без addEventListener в onMounted</li>
        <li>✅ <strong>Поддержка клавиатуры</strong> - стрелки влево/вправо</li>
        <li>✅ <strong>Виртуализация</strong> - RecycleScroller для производительности</li>
        <li>✅ <strong>Плавная анимация</strong> - smooth scroll behavior</li>
        <li>✅ <strong>Навигационные кнопки</strong> - для удобства использования</li>
        <li>✅ <strong>Адаптивность</strong> - кнопки скрываются на мобильных</li>
        <li>✅ <strong>Кастомный скроллбар</strong> - стилизованный под дизайн</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HorizontalScroller from '~/components/HorizontalScroller.vue'

const scrollerRef = ref()

// Генерируем тестовые данные
const generateItems = (count: number) => {
  const categories = ['Технологии', 'Дизайн', 'Маркетинг', 'Разработка', 'Аналитика']
  const items = []
  
  for (let i = 0; i < count; i++) {
    items.push({
      id: i + 1,
      title: `Элемент ${i + 1}`,
      description: `Описание для элемента номер ${i + 1}. Это демонстрационный контент для показа возможностей горизонтального скролла.`,
      category: categories[i % categories.length],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')
    })
  }
  
  return items
}

const items = ref(generateItems(50))

// Методы для управления скроллом
const scrollToStart = () => {
  scrollerRef.value?.scrollToStart()
}

const scrollToEnd = () => {
  scrollerRef.value?.scrollToEnd()
}

const scrollToRandom = () => {
  const randomIndex = Math.floor(Math.random() * items.value.length)
  scrollerRef.value?.scrollToItem(randomIndex)
}

const addItem = () => {
  const newItem = {
    id: items.value.length + 1,
    title: `Новый элемент ${items.value.length + 1}`,
    description: `Это новый элемент, добавленный в конец списка.`,
    category: 'Новое',
    date: new Date().toLocaleDateString('ru-RU')
  }
  items.value.push(newItem)
}

// SEO
const { setPageSeo } = useSeo()
setPageSeo('Горизонтальный скролл | MyApp', 'Демонстрация горизонтального скролла с RecycleScroller')
</script>

<style scoped>
.item-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.item-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.item-index {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.item-body {
  flex: 1;
  margin-bottom: 12px;
}

.item-body p {
  margin: 0;
  line-height: 1.5;
  font-size: 14px;
  opacity: 0.9;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  opacity: 0.8;
}

.item-category {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 8px;
}

.item-date {
  font-weight: 500;
}
</style>

