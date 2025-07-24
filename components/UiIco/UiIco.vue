<template>
  <svg
    v-if="svgInner"
    class="ui-ico"
    :class="`ui-ico--${dir}`"
    focusable="false"
    role="img"
    v-html="svgInner"
  ></svg>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  name: string
  dir?: 'up' | 'down' | 'left' | 'right'
}>()

const svgInner = ref<string>('')

watch(
  () => props.name,
  async (newName) => {
    if (!newName) {
      svgInner.value = ''
      return
    }
    try {
      // @ts-ignore
      const raw = (await import(`~/assets/icons/${newName}.svg?raw`)).default as string
      // Вырезаем только содержимое <svg>...</svg>
      const match = raw.match(/^<svg[^>]*>([\s\S]*)<\/svg>$/i)
      svgInner.value = match ? match[1] : ''
    } catch {
      svgInner.value = ''
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@use "./styles/ui-ico" as *;
</style>