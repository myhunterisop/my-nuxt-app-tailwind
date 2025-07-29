import { ref } from 'vue'
import { z } from 'zod'
import { $fetch } from 'ofetch'

export function useApiData<T>(schema: z.ZodSchema<T>) {
  const data = ref<T[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchData = async (url: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<unknown[]>(url)
      data.value = z.array(schema).parse(response)
    } catch (e: any) {
      error.value = e.errors ? e.errors.map((err: any) => err.message).join('; ') : (e.message || 'Ошибка загрузки данных')
      data.value = []
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    data.value = []
    error.value = null
  }

  return {
    data,
    isLoading,
    error,
    fetchData,
    reset
  }
} 