# Nuxt.js REST API Demo

Демонстрационный проект, показывающий различные способы работы с REST API в Nuxt.js приложении с UI компонентами.

## 🚀 Возможности

- **Прямая работа с API** - Использование `$fetch` для HTTP запросов
- **TypeScript типизация** - Полная типизация API запросов и ответов
- **Валидация данных** - Runtime валидация с помощью Zod
- **Пагинация и фильтрация** - Примеры работы с большими наборами данных
- **UI компоненты** - Переиспользуемые компоненты с документацией
- **SEO управление** - Централизованное управление мета-тегами через Pinia
- **Fallback данные** - Локальные моковые данные при недоступности API

## 📁 Структура проекта

```
├── components/
│   ├── UiIco/              # Компонент для SVG иконок
│   │   ├── UiIco.vue
│   │   └── styles/
│   │       ├── component.scss
│   │       ├── ui-ico.scss
│   │       └── sizes.scss
│   └── UiImg/              # Компонент для изображений
│       └── UiImg.vue
├── composables/            # Переиспользуемая логика
│   ├── useApiData.ts       # Универсальный API composable
│   ├── usePagination.ts    # Пагинация
│   ├── useSearch.ts        # Поиск и фильтрация
│   ├── useSeo.ts          # SEO управление
│   └── useFallbackData.ts  # Fallback данные
├── stores/
│   └── seo.ts             # Store для SEO мета-тегов
├── mocks/
│   └── posts.json         # Моковые данные для fallback
├── pages/
│   ├── index.vue          # Главная страница
│   ├── users.vue          # Управление пользователями
│   ├── posts.vue          # Блог постов с пагинацией
│   └── styleguide.vue     # UI Styleguide
├── layouts/
│   └── default.vue        # Nuxt layout с SEO интеграцией
└── views/
    └── Layout/
        └── Layout.vue     # Основной layout компонент
```

## 🛠 Установка и запуск

### Установка зависимостей

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install
```

### Запуск в режиме разработки

```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev
```

Приложение будет доступно по адресу `http://localhost:3000`

## 📖 Документация

### Основные концепции

1. **$fetch** - Прямые HTTP запросы к внешним API
2. **Zod валидация** - Runtime валидация API ответов
3. **Composables** - Переиспользуемая логика (API, пагинация, поиск, SEO)
4. **UI компоненты** - Переиспользуемые компоненты с собственной системой стилей
5. **Pinia stores** - Управление глобальным состоянием (SEO)
6. **Fallback данные** - Локальные моковые данные при недоступности API

### Примеры использования

#### Базовый API запрос с валидацией

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
})

// Использование composable для API данных
const { data: users, isLoading, error, fetchData } = useApiData(UserSchema)
await fetchData('https://jsonplaceholder.typicode.com/users')
```

#### Пагинация и поиск

```typescript
// Пагинация
const { displayedItems, currentPage, totalPages, nextPage, prevPage } = usePagination(items, 15)

// Поиск
const { search, filteredItems, clearSearch } = useSearch(items, ['title', 'body'], 700)
```

#### Использование UI компонентов

```vue
<template>
  <!-- Иконка с размером и направлением -->
  <UiIco name="signal-stream" size="lg" dir="right" class="text-blue-500" />
  
  <!-- Responsive изображение -->
  <UiImg
    :meta="imgMeta"
    alt="Описание изображения"
    sizes="(max-width: 768px) 100vw, 50vw"
    image-class="rounded-lg w-full"
  />
</template>
```

#### SEO управление

```typescript
const { setPageSeo } = useSeo()
setPageSeo('Заголовок страницы', 'Описание страницы')
```

## 🎯 Демо страницы

### Главная страница (`/`)
- Обзор возможностей проекта
- Демонстрация UI компонентов
- Навигация к демо страницам

### Управление пользователями (`/users`)
- Загрузка пользователей с внешнего API через `useApiData`
- Runtime валидация данных с Zod
- SEO управление через `useSeo`
- Загрузка по кнопке с прелоадером

### Блог постов (`/posts`)
- Поиск и фильтрация постов через `useSearch`
- Пагинация (15 постов на страницу) через `usePagination`
- Фильтрация по автору
- Кнопка очистки фильтров
- Fallback на моковые данные через `useFallbackData`
- SEO управление через `useSeo`

### UI Styleguide (`/styleguide`)
- Демонстрация всех UI компонентов
- Примеры использования с различными параметрами
- Документация props и возможностей
- Интерактивные примеры

## 🎨 UI Компоненты

### UiIco
Компонент для отображения SVG иконок с поддержкой:
- Динамической загрузки SVG файлов
- Собственной системы размеров (xs, sm, md, lg, xl, 2xl, 3xl)
- Поворота в 4 направлениях (up, right, down, left)
- Извлечения viewBox из SVG
- Состояния загрузки

### UiImg
Компонент для отображения изображений с поддержкой:
- Responsive изображений
- Множественных форматов (WebP, AVIF)
- Fallback изображений
- Lazy loading
- Гибкой стилизации

## 🔧 Composables

### useApiData
Универсальный composable для работы с API данными:
- Автоматическая валидация с Zod
- Управление состоянием загрузки и ошибок
- Типизированные данные

### usePagination
Composable для пагинации:
- Вычисляемые свойства для навигации
- Методы переключения страниц
- Настраиваемое количество элементов на странице

### useSearch
Composable для поиска и фильтрации:
- Debounced поиск
- Фильтрация по нескольким полям
- Очистка поиска

### useSeo
Composable для SEO управления:
- Упрощенная установка title и description
- Интеграция с Pinia store
- Автоматическое обновление мета-тегов

### useFallbackData
Composable для fallback данных:
- Автоматический fallback при недоступности API
- Валидация fallback данных
- Настраиваемые сообщения об ошибках

## 🏗️ Layout система

### Layout.vue (views/Layout/Layout.vue)
Основной layout компонент с HTML структурой:
- Header с навигацией и логотипом
- Main контейнер с максимальной шириной
- Footer с копирайтом
- Responsive дизайн с Tailwind CSS

### default.vue (layouts/default.vue)
Nuxt layout файл, который:
- Использует компонент Layout.vue
- Интегрирует SEO управление через Pinia
- Автоматически обновляет title и description страниц

## 🔧 Конфигурация

### Настройка API базового URL

В `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com'
    }
  }
})
```

### Переменные окружения

Создайте файл `.env`:

```env
API_BASE_URL=https://jsonplaceholder.typicode.com
```

## 📚 Подробная документация

Полное руководство по работе с REST API в Nuxt.js находится в файле [`docs/api-guide.md`](./docs/api-guide.md).

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add some amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для получения дополнительной информации.
