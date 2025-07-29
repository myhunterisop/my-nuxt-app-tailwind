<template>
    <div class="relative min-h-screen">
        <div class="relative z-10 flex-1 w-full max-w-5xl mx-auto py-8 px-4">
            <h1 class="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">Добро пожаловать в Nuxt.js API Demo</h1>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div class="bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white border-opacity-20">
                    <NuxtLink 
                        to="/styleguide" 
                        class="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Компоненты UI
                    </NuxtLink>
                </div>
                
                <div class="bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white border-opacity-20">
                    <h2 class="text-2xl font-semibold mb-4">REST API Демо</h2>
                    <p class="text-gray-600 mb-4">
                        Изучите различные способы работы с REST API в Nuxt.js приложении
                    </p>
                    <div class="space-y-2">
                        <NuxtLink 
                            to="/users" 
                            class="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Пользователи
                        </NuxtLink>
                    </div>
                </div>
            </div>
            
            <div class="bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6 border border-white border-opacity-20">
                <h2 class="text-2xl font-semibold mb-4">Возможности проекта</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="text-center">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                            <UiIco name="signal-stream" class="text-blue-500 " />
                        </div>
                        <h3 class="font-semibold mb-2">Composables</h3>
                        <p class="text-gray-600 text-sm">Переиспользуемая логика для работы с API</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                            <UiIco name="signal-stream" class="text-green-500 text-2xl" />
                        </div>
                        <h3 class="font-semibold mb-2">TypeScript</h3>
                        <p class="text-gray-600 text-sm">Полная типизация API запросов и ответов</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                            <UiIco name="signal-stream" class="text-purple-500 text-2xl" />
                        </div>
                        <h3 class="font-semibold mb-2">Server Routes</h3>
                        <p class="text-gray-600 text-sm">API роуты на стороне сервера</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import UiIco from '~/components/UiIco/UiIco.vue'

import { useSeoStore } from '~/stores/seo'

const seo = useSeoStore()
seo.setSeo({
  title: 'Главная | MyApp',
  description: 'Главная страница MyApp'
})
</script>