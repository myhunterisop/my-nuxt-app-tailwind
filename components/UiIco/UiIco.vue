<template>
  <svg
    v-if="svgContent"
    v-bind="svgAttrs"
    :class="uiIcoClasses"
    class="ui-ico"
    v-html="svgInner"
    focusable="false"
    role="img"
  />
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'

const props = defineProps<{
    name: string
    dir?: 'up' | 'down' | 'left' | 'right'
  }>()

const svgContent = ref<string | null>(null)
const svgAttrs = ref<Record<string, string>>({})
const svgInner = ref<string>('')

const uiIcoClasses = computed(() => ({
  'ui-ico--up': props.dir === 'up',
  'ui-ico--right': props.dir === 'right',
  'ui-ico--down': props.dir === 'down',
  'ui-ico--left': props.dir === 'left',
}))

watchEffect(async () => {
  if (!props.name) {
    svgContent.value = null
    svgAttrs.value = {}
    svgInner.value = ''
    return
  }
  try {
    const raw = (await import(`~/assets/icons/${props.name}.svg?raw`)).default as string
    svgContent.value = raw

    // Парсим SVG: достаем атрибуты и внутренний HTML
    const match = raw.match(/^<svg\s+([^>]*)>([\s\S]*)<\/svg>$/i)
    if (match) {
      // Парсим атрибуты
      const attrs: Record<string, string> = {}
      match[1].replace(/([a-zA-Z:-]+)\s*=\s*"([^"]*)"/g, (_, key, value) => {
        attrs[key] = value
        return ''
      })
      svgAttrs.value = attrs
      svgInner.value = match[2]
    } else {
      svgAttrs.value = {}
      svgInner.value = ''
    }
  } catch (e) {
    svgContent.value = null
    svgAttrs.value = {}
    svgInner.value = ''
  }
})
</script>

<style lang="scss" scoped>
@use "./styles/ui-ico.scss" as *;
</style>