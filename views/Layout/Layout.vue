<template>
    <div class="min-h-screen flex flex-col bg-white text-gray-900">
        <!-- Видео фон -->
        <div class="fixed inset-0 z-0">
            <video 
                ref="videoRef"
                autoplay 
                muted 
                loop 
                playsinline
                preload="metadata"
                class="w-full h-full object-cover"
            >
                <source src="/images/large.mp4" type="video/mp4">
            </video>
        </div>

        <!-- Эффект блюра поверх видео -->
        <div class="fixed inset-0 z-5 bg-opacity-10 backdrop-blur-sm"></div>

        <header class="relative z-20 w-full border-b border-gray-200 py-4 px-6 flex items-center justify-between bg-opacity-95 backdrop-blur-md shadow-sm">
            <!-- Логотип и навигация -->
            <div class="flex items-center gap-3">
                <span class="font-bold text-xl tracking-widest">LOGO</span>
            </div>
            <nav class="hidden md:flex gap-8 text-sm uppercase tracking-widest">
                <a href="/" class="text-white drop-shadow-lg hover:text-blue-200 transition">Главная</a>
                <a href="/users" class="text-white drop-shadow-lg hover:text-blue-200 transition">Пользователи</a>
                <a href="/posts" class="text-white drop-shadow-lg hover:text-blue-200 transition">Посты</a>
            </nav>
            <div class="flex items-center gap-3">
                <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Войти</button>
            </div>
        </header>
    
        <main class="relative z-10 flex-1 w-full max-w-5xl mx-auto py-8 px-4">
            <slot />
        </main>
    
        <footer class="relative z-20 w-full border-t border-gray-200 py-6 px-6 text-center text-gray-500 text-sm bg-opacity-95 backdrop-blur-md mt-8">
            &copy; 2025 MySite. Все права защищены.
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const videoRef = ref(null)

onMounted(() => {
    if (videoRef.value) {
        videoRef.value.playbackRate = 0.85
    }
})
</script> 