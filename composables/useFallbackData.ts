import { z } from 'zod'
import { $fetch } from 'ofetch'

export function useFallbackData<T>(schema: z.ZodSchema<T>) {
  const loadWithFallback = async (
    apiUrl: string, 
    fallbackData: T[], 
    errorMessage: string = 'Данные недоступны'
  ) => {
    try {
      const response = await $fetch<unknown[]>(apiUrl)
      return z.array(schema).parse(response)
    } catch (e: any) {
      try {
        return z.array(schema).parse(fallbackData)
      } catch (mockErr: any) {
        throw new Error(errorMessage)
      }
    }
  }

  return { loadWithFallback }
} 