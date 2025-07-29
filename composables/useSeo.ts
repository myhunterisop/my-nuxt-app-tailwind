import { computed } from 'vue'

export function useSeo() {
  const seo = useSeoStore()
  
  const setPageSeo = (title: string, description: string) => {
    seo.setSeo({ title, description })
  }
  
  const resetSeo = () => {
    seo.resetSeo()
  }
  
  return {
    setPageSeo,
    resetSeo,
    title: computed(() => seo.title),
    description: computed(() => seo.description)
  }
} 