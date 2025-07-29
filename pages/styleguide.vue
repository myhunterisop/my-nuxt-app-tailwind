<template>
  <div class="container mx-auto p-6">
    <h1 class="text-4xl font-bold mb-8">UI Styleguide</h1>
    
    <!-- UiIco Component -->
    <section class="mb-12">
      <h2 class="text-3xl font-semibold mb-6">UiIco Component</h2>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-medium mb-4">Базовое использование</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" />
            <span>signal-stream</span>
          </div>
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" class="text-blue-500" />
            <span>Blue color</span>
          </div>
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" class="text-green-500" />
            <span>Green color</span>
          </div>
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" class="text-red-500" />
            <span>Red color</span>
          </div>
        </div>

        <h3 class="text-xl font-medium mb-4">Размеры</h3>
        <div class="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" size="xs" />
            <span>size="xs"</span>
          </div>
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" size="sm" />
            <span>size="sm"</span>
          </div>
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" size="md" />
            <span>size="md"</span>
          </div>
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" size="lg" />
            <span>size="lg"</span>
          </div>
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" size="xl" />
            <span>size="xl"</span>
          </div>
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" size="2xl" />
            <span>size="2xl"</span>
          </div>
        </div>

        <h3 class="text-xl font-medium mb-4">Размеры с цветами</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" size="xs" class="text-blue-500" />
            <span>xs + blue</span>
          </div>
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" size="md" class="text-green-500" />
            <span>md + green</span>
          </div>
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" size="xl" class="text-red-500" />
            <span>xl + red</span>
          </div>
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" size="3xl" class="text-purple-500" />
            <span>3xl + purple</span>
          </div>
        </div>

        <h3 class="text-xl font-medium mb-4">Направления</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" dir="up" class="text-blue-500" />
            <span>dir="up"</span>
          </div>
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" dir="right" class="text-blue-500" />
            <span>dir="right"</span>
          </div>
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" dir="down" class="text-blue-500" />
            <span>dir="down"</span>
          </div>
          <div class="flex items-center space-x-2">
            <UiIco name="signal-stream" dir="left" class="text-blue-500" />
            <span>dir="left"</span>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-md">
          <h4 class="font-medium mb-2">Props:</h4>
          <ul class="text-sm space-y-1">
            <li><code class="bg-gray-200 px-1 rounded">name</code> - название иконки (обязательный)</li>
            <li><code class="bg-gray-200 px-1 rounded">dir</code> - направление поворота: "up", "right", "down", "left"</li>
            <li><code class="bg-gray-200 px-1 rounded">size</code> - размер иконки: "xs", "sm", "md", "lg", "xl", "2xl", "3xl"</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- UiImg Component -->
    <section class="mb-12">
      <h2 class="text-3xl font-semibold mb-6">UiImg Component</h2>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-medium mb-4">Базовое использование</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="font-medium mb-2">Обычное изображение</h4>
            <UiImg
              :meta="imgMeta"
              alt="Пример изображения 1"
              sizes="(max-width: 768px) 100vw, 50vw"
              image-class="rounded-lg w-full"
              picture-class="block"
            />
          </div>
          <div>
            <h4 class="font-medium mb-2">С ограничением ширины</h4>
            <UiImg
              :meta="imgMeta2"
              alt="Пример изображения 2"
              sizes="(max-width: 768px) 100vw, 300px"
              image-class="rounded-lg w-full max-w-xs"
              picture-class="block"
            />
          </div>
        </div>

        <h3 class="text-xl font-medium mb-4">Различные стили</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 class="font-medium mb-2">Круглое изображение</h4>
            <UiImg
              :meta="imgMeta"
              alt="Круглое изображение"
              sizes="200px"
              image-class="rounded-full w-32 h-32 object-cover"
              picture-class="block"
            />
          </div>
          <div>
            <h4 class="font-medium mb-2">С тенью</h4>
            <UiImg
              :meta="imgMeta2"
              alt="Изображение с тенью"
              sizes="300px"
              image-class="rounded-lg w-full shadow-lg"
              picture-class="block"
            />
          </div>
          <div>
            <h4 class="font-medium mb-2">С границей</h4>
            <UiImg
              :meta="imgMeta"
              alt="Изображение с границей"
              sizes="300px"
              image-class="rounded-lg w-full border-4 border-blue-500"
              picture-class="block"
            />
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-md">
          <h4 class="font-medium mb-2">Props:</h4>
          <ul class="text-sm space-y-1">
            <li><code class="bg-gray-200 px-1 rounded">meta</code> - метаданные изображения (обязательный)</li>
            <li><code class="bg-gray-200 px-1 rounded">alt</code> - альтернативный текст (обязательный)</li>
            <li><code class="bg-gray-200 px-1 rounded">sizes</code> - размеры для srcset</li>
            <li><code class="bg-gray-200 px-1 rounded">image-class</code> - CSS классы для img</li>
            <li><code class="bg-gray-200 px-1 rounded">picture-class</code> - CSS классы для picture</li>
            <li><code class="bg-gray-200 px-1 rounded">loading</code> - атрибут loading</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Информация о компонентах -->
    <section class="mb-12">
      <h2 class="text-3xl font-semibold mb-6">Информация</h2>
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-xl font-medium mb-4">UiIco</h3>
            <p class="text-gray-600 mb-2">
              Компонент для отображения SVG иконок с поддержкой:
            </p>
            <ul class="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Динамической загрузки SVG файлов</li>
              <li>Извлечения viewBox из SVG</li>
              <li>Поворота иконок в 4 направлениях</li>
              <li>Гибкого управления размерами через CSS</li>
              <li>Состояния загрузки</li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-medium mb-4">UiImg</h3>
            <p class="text-gray-600 mb-2">
              Компонент для отображения изображений с поддержкой:
            </p>
            <ul class="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Responsive изображений</li>
              <li>Множественных форматов (WebP, AVIF)</li>
              <li>Fallback изображений</li>
              <li>Lazy loading</li>
              <li>Гибкой стилизации</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSeoStore } from '~/stores/seo'

const seo = useSeoStore()
seo.setSeo({
  title: 'UI Styleguide | MyApp',
  description: 'Демонстрация UI компонентов приложения MyApp'
})

// Метаданные для UiImg
const imgMeta = {
  img: { 
    src: '/images/1.jpg?w=800&format=webp', 
    w: 800 
  },
  sources: {
    webp: [
      { src: '/images/1.jpg?w=400&format=webp', w: 400 },
      { src: '/images/1.jpg?w=800&format=webp', w: 800 },
      { src: '/images/1.jpg?w=1200&format=webp', w: 1200 }
    ],
    avif: [
      { src: '/images/1.jpg?w=400&format=avif', w: 400 },
      { src: '/images/1.jpg?w=800&format=avif', w: 800 },
      { src: '/images/1.jpg?w=1200&format=avif', w: 1200 }
    ]
  }
}

// Метаданные для UiImg
const imgMeta2 = {
  img: { 
    src: '/images/2.jpg?w=800&format=webp', 
    w: 800 
  },
  sources: {
    webp: [
      { src: '/images/2.jpg?w=400&format=webp', w: 400 },
      { src: '/images/2.jpg?w=800&format=webp', w: 800 },
      { src: '/images/2.jpg?w=1200&format=webp', w: 1200 }
    ],
    avif: [
      { src: '/images/2.jpg?w=400&format=avif', w: 400 },
      { src: '/images/2.jpg?w=800&format=avif', w: 800 },
      { src: '/images/2.jpg?w=1200&format=avif', w: 1200 }
    ]
  }
}
</script> 