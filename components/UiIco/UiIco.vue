<template>
  <svg
    v-if="svgContent"
    v-bind="svgAttrs"
    :class="['ui-ico', uiIcoClasses]"
    v-html="svgInner"
    focusable="false"
    role="img"
  ></svg>
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

const uiIcoClasses = computed(() =>
  props.dir ? `ui-ico--${props.dir}` : ''
)

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