<template>
  <span
    v-if="isLoading"
    class="ui-ico ui-ico--is-loading"
  />
  <svg
    v-else
    :viewBox="viewBox"
    :class="['ui-ico', uiIcoClasses]"
    focusable="false"
    role="img"
    v-html="svgInner"
  ></svg>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  name: string
  dir?: 'up' | 'down' | 'left' | 'right'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}>()

const uiIcoClasses = computed(() => {
  const classes = []
  if (props.dir) classes.push(`ui-ico--${props.dir}`)
  if (props.size) classes.push(`ui-ico--size-${props.size}`)
  return classes.join(' ')
})

const svgInner = ref<string>('')
const isLoading = ref(false)

watch(
  () => props.name,
  async (newName) => {
    if (!newName) {
      svgInner.value = ''
      isLoading.value = false
      return
    }
    isLoading.value = true
    try {
      const raw = (await import(`~/assets/icons/${newName}.svg?raw`)).default as string
      // Извлекаем только содержимое между тегами <svg> и </svg>
      const contentMatch = raw.match(/<svg[^>]*>(.*?)<\/svg>/s)
      svgInner.value = contentMatch ? contentMatch[1] : ''
    } catch {
      svgInner.value = ''
    } finally {
      isLoading.value = false
    }
  },
  { immediate: true }
)

function extractViewBox(svgString?: string) {
  if (!svgString) return '0 0 16 16'
  const match = svgString.match(/viewBox="([^"]+)"/i)
  return match ? match[1] : '0 0 16 16'
}
const viewBox = computed(() => extractViewBox(svgInner.value))
</script>

<style lang="scss" scoped>
@use "./styles/component" as *;
</style>