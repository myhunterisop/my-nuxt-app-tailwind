<template>
  <Layout>
    <slot />
  </Layout>
</template>

<script setup lang="ts">
import Layout from '~/components/Layout/Layout.vue'
import { useSeoStore } from '~/stores/seo'
import { storeToRefs } from 'pinia'
import { useHead } from '#imports'

const seo = useSeoStore()
const { title, description } = storeToRefs(seo)

useHead({
  title,
  meta: [
    { name: 'description', content: description }
  ]
})
</script>
