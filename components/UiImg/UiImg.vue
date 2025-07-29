<template>
    <div :style="`max-width: ${fallback?.w || 0}px`">
      <picture :class="pictureClass">
        <template v-for="([type, srcMeta], idx) in Object.entries(sources)" :key="type">
          <source
            :type="`image/${type}`"
            :sizes="sizes"
            :srcset="srcMeta.map((m: any) => `${m.src} ${m.w}w`).join(', ')"
          />
        </template>
        <img
          :src="fallback?.src"
          :alt="alt"
          :loading="loading"
          :class="imageClass"
        />
      </picture>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, toRef } from 'vue'
  
  interface ImgMetaSource {
    src: string
    w: number
  }
  interface ImgMeta {
    img: { src: string; w: number }
    sources: Record<string, ImgMetaSource[]>
  }
  
  const props = defineProps<{
    meta: ImgMeta[] | ImgMeta
    sizes?: string
    alt?: string
    loading?: 'lazy' | 'eager' | null
    imageClass?: string
    pictureClass?: string
  }>()
  
  // Приводим meta к массиву, если это не массив
  const metaArr = computed<ImgMeta[]>(() =>
    Array.isArray(props.meta) ? props.meta : [props.meta]
  )
  
  const sources = computed(() => metaArr.value[0]?.sources || {})
  const fallback = computed(() => metaArr.value[0]?.img || {})
  
  const sizes = toRef(props, 'sizes')
  const alt = toRef(props, 'alt')
  const loading = computed(() => props.loading ?? 'lazy')
  const imageClass = toRef(props, 'imageClass')
  const pictureClass = toRef(props, 'pictureClass')
  </script>