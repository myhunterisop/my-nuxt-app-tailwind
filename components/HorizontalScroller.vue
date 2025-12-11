<template>
  <div class="horizontal-scroller-container">
    <RecycleScroller
      ref="scrollerRef"
      class="scroller"
      :items="items"
      :item-size="itemSize"
      :buffer="200"
      direction="horizontal"
      :key-field="keyField"
      v-slot="{ item, index }"
    >
      <div class="item" :style="{ width: itemSize + 'px' }">
        <slot :item="item" :index="index">
          <div class="default-item">
            {{ item.title || item.name || `Item ${index}` }}
          </div>
        </slot>
      </div>
    </RecycleScroller>
    
    <!-- Навигационные кнопки -->
    <div class="navigation">
      <button 
        @click="scrollLeft" 
        :disabled="!canScrollLeft"
        class="nav-button left"
      >
        ←
      </button>
      <button 
        @click="scrollRight" 
        :disabled="!canScrollRight"
        class="nav-button right"
      >
        →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'

interface Props {
  items: any[]
  itemSize?: number
  keyField?: string
  scrollStep?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemSize: 200,
  keyField: 'id',
  scrollStep: 300
})

const scrollerRef = ref()
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

// Проверяем возможность скролла
const updateScrollState = () => {
  if (!scrollerRef.value) return
  
  const scrollElement = scrollerRef.value.$el
  if (!scrollElement) return
  
  canScrollLeft.value = scrollElement.scrollLeft > 0
  canScrollRight.value = scrollElement.scrollLeft < (scrollElement.scrollWidth - scrollElement.clientWidth)
}

// Функции скролла
const scrollLeft = () => {
  if (!scrollerRef.value) return
  
  const scrollElement = scrollerRef.value.$el
  if (!scrollElement) return
  
  scrollElement.scrollBy({
    left: -props.scrollStep,
    behavior: 'smooth'
  })
}

const scrollRight = () => {
  if (!scrollerRef.value) return
  
  const scrollElement = scrollerRef.value.$el
  if (!scrollElement) return
  
  scrollElement.scrollBy({
    left: props.scrollStep,
    behavior: 'smooth'
  })
}

// Обработка колеса мыши для горизонтального скролла
const handleWheel = (event: WheelEvent) => {
  if (!scrollerRef.value) return
  
  const scrollElement = scrollerRef.value.$el
  if (!scrollElement) return
  
  // Предотвращаем вертикальный скролл страницы
  event.preventDefault()
  
  // Применяем горизонтальный скролл
  scrollElement.scrollBy({
    left: event.deltaY,
    behavior: 'auto'
  })
}

// Обработка клавиатуры
const handleKeydown = (event: KeyboardEvent) => {
  if (!scrollerRef.value) return
  
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      scrollLeft()
      break
    case 'ArrowRight':
      event.preventDefault()
      scrollRight()
      break
  }
}

onMounted(async () => {
  await nextTick()
  
  if (scrollerRef.value?.$el) {
    const scrollElement = scrollerRef.value.$el
    
    // Добавляем обработчики событий
    scrollElement.addEventListener('scroll', updateScrollState)
    scrollElement.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('keydown', handleKeydown)
    
    // Инициализируем состояние скролла
    updateScrollState()
  }
})

onUnmounted(() => {
  if (scrollerRef.value?.$el) {
    const scrollElement = scrollerRef.value.$el
    scrollElement.removeEventListener('scroll', updateScrollState)
    scrollElement.removeEventListener('wheel', handleWheel)
  }
  document.removeEventListener('keydown', handleKeydown)
})

// Публичные методы для внешнего использования
const scrollToItem = (index: number) => {
  if (!scrollerRef.value) return
  
  const scrollElement = scrollerRef.value.$el
  if (!scrollElement) return
  
  const scrollLeft = index * props.itemSize
  scrollElement.scrollTo({
    left: scrollLeft,
    behavior: 'smooth'
  })
}

const scrollToStart = () => {
  if (!scrollerRef.value) return
  
  const scrollElement = scrollerRef.value.$el
  if (!scrollElement) return
  
  scrollElement.scrollTo({
    left: 0,
    behavior: 'smooth'
  })
}

const scrollToEnd = () => {
  if (!scrollerRef.value) return
  
  const scrollElement = scrollerRef.value.$el
  if (!scrollElement) return
  
  scrollElement.scrollTo({
    left: scrollElement.scrollWidth,
    behavior: 'smooth'
  })
}

// Экспортируем методы для родительского компонента
defineExpose({
  scrollToItem,
  scrollToStart,
  scrollToEnd,
  scrollLeft,
  scrollRight
})
</script>

<style scoped>
.horizontal-scroller-container {
  position: relative;
  width: 100%;
}

.scroller {
  width: 100%;
  height: 200px; /* Задайте нужную высоту */
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
}

.scroller::-webkit-scrollbar {
  height: 8px;
}

.scroller::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scroller::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.scroller::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.item {
  display: inline-block;
  height: 100%;
  flex-shrink: 0;
  padding: 16px;
  box-sizing: border-box;
}

.default-item {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-weight: 500;
}

.navigation {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 10;
}

.nav-button {
  pointer-events: auto;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-button.left {
  margin-left: 10px;
}

.nav-button.right {
  margin-right: 10px;
}

/* Скрываем кнопки на мобильных устройствах */
@media (max-width: 768px) {
  .navigation {
    display: none;
  }
}
</style>

