<template>
  <span
    v-if="isLoading"
    :class="['ui-ico', 'ui-ico--is-loading', uiIcoClasses]"
    aria-hidden="true"
  />
  <svg
    v-else
    :viewBox="viewBox"
    :class="['ui-ico', uiIcoClasses]"
    focusable="false"
    role="img"
    aria-hidden="true"
    v-html="svgInner"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  name: string
  dir?: 'up' | 'down' | 'left' | 'right'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}>()

const uiIcoClasses = computed(() => [
  props.dir ? `ui-ico--${props.dir}` : '',
  props.size ? `ui-ico--size-${props.size}` : '',
])

const svgInner = ref('')
const viewBox = ref('0 0 16 16')
const isLoading = ref(Boolean(props.name))

let loadId = 0

const parseSvg = (raw: string) => {
  const viewBoxMatch = raw.match(/viewBox=["']([^"']+)["']/i)
  const innerMatch = raw.match(/<svg[^>]*>([\s\S]*)<\/svg>/i)
  return {
    viewBox: viewBoxMatch?.[1] ?? '0 0 16 16',
    inner: innerMatch?.[1]?.trim() ?? '',
  }
}

const isSafeIconName = (name: string) => /^[a-z0-9_-]+$/i.test(name)

// watch, а не onMounted: name может смениться на живом инстансе (список, тоггл).
// immediate: true грузит ещё на setup, до mount — отдельный onMounted дублировал бы первый запрос.
watch(
  () => props.name,
  async (name) => {
    const currentLoadId = ++loadId

    if (!name || !isSafeIconName(name)) {
      svgInner.value = ''
      viewBox.value = '0 0 16 16'
      isLoading.value = false
      return
    }

    isLoading.value = true

    try {
      const raw = (await import(`~/assets/icons/${name}.svg?raw`)).default as string
      if (currentLoadId !== loadId) return
      const parsed = parseSvg(raw)
      svgInner.value = parsed.inner
      viewBox.value = parsed.viewBox
    } catch {
      if (currentLoadId !== loadId) return
      svgInner.value = ''
      viewBox.value = '0 0 16 16'
    } finally {
      if (currentLoadId === loadId) isLoading.value = false
    }
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
@use "./styles/component" as *;
</style>
