import { ref, computed, type Ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

export function useSearch<T>(
  items: Ref<T[]>,
  searchFields: (keyof T)[],
  debounceMs: number = 700
) {
  const search = ref('')
  
  const filteredItems = computed(() => {
    if (!search.value.trim()) return items.value
    
    const query = search.value.trim().toLowerCase()
    return items.value.filter(item => 
      searchFields.some(field => 
        String(item[field]).toLowerCase().includes(query)
      )
    )
  })

  const debouncedSearch = useDebounceFn(() => {
    // Можно добавить логику для API поиска в будущем
  }, debounceMs)

  const clearSearch = () => {
    search.value = ''
  }

  const hasActiveSearch = computed(() => search.value.trim().length > 0)

  return {
    search,
    filteredItems,
    debouncedSearch,
    clearSearch,
    hasActiveSearch
  }
} 