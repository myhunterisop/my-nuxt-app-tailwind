import { defineStore } from 'pinia'

export const useSeoStore = defineStore('seo', {
  state: () => ({
    title: '',
    description: ''
  }),
  actions: {
    setSeo({ title, description }: { title?: string; description?: string }) {
      if (title !== undefined) this.title = title
      if (description !== undefined) this.description = description
    },
    resetSeo() {
      this.title = ''
      this.description = ''
    }
  }
}) 