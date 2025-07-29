import { ref, computed, type Ref } from 'vue'

export function usePagination<T>(items: Ref<T[]>, itemsPerPage: number = 15) {
  const currentPage = ref(1)
  
  const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage))
  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
  const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, items.value.length))
  const displayedItems = computed(() => items.value.slice(startIndex.value, endIndex.value))
  
  const visiblePages = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const delta = 2 // количество страниц слева и справа от текущей
    
    let start = Math.max(1, current - delta)
    let end = Math.min(total, current + delta)
    
    // Если страниц мало, показываем все
    if (end - start < 4) {
      start = Math.max(1, end - 4)
      end = Math.min(total, start + 4)
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  })

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const goToPage = (page: number) => {
    currentPage.value = page
  }

  const resetPagination = () => {
    currentPage.value = 1
  }

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    displayedItems,
    visiblePages,
    prevPage,
    nextPage,
    goToPage,
    resetPagination
  }
} 