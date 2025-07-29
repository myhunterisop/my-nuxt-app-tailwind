// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { imagetools } from 'vite-imagetools'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  builder: 'vite',
  modules: [
    '@pinia/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      }
    }
  },
  vite: {
    resolve: {
      alias: {
        '@components': '/components',
        '@images': '/public/images',
      },
    },
    plugins: [
      tailwindcss(),
      imagetools(),
      {
        name: 'console-on-build',
        buildStart() {
          console.log('🔥 Vite is building from nuxt.config.ts')
        },
      },
    ],
  },
})