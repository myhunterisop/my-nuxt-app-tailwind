// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  builder: 'vite',
  css: ['~/src/assets/css/main.css'],
  vite: {
    resolve: {
      alias: {
        '@images': '/public/images',
      },
    },
    plugins: [
      tailwindcss(),
      {
        name: 'console-on-build',
        buildStart() {
          console.log('🔥 Vite is building from nuxt.config.ts')
        },
      },
    ],
    define: {
      __DEV__: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/variables.scss" as *;`,
        },
      },
    },
  },
})
