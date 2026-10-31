<template>
  <picture
    v-if="fallback?.src"
    :class="pictureClass"
    :style="pictureStyle"
  >
    <source
      v-for="source in pictureSources"
      :key="source.type"
      :type="source.type"
      :sizes="sizes"
      :srcset="source.srcset"
    />
    <img
      :src="fallback.src"
      :alt="alt"
      :width="fallback.w || undefined"
      :loading="loading"
      :class="imageClass"
    />
  </picture>
</template>

<script setup lang="ts">
// setup — компилятор Vue сам создаёт setup() компонента: без export default и без return.
// lang="ts" — этот блок проверяется TypeScript'ом (в Nuxt это уже включено из коробки).

// computed — функция Vue: кэширует результат и пересчитывает его, только если изменились зависимости.
import { computed } from 'vue'

// Описание одного варианта картинки в srcset: URL и ширина в пикселях (дескриптор 400w, 800w…).
interface ImgMetaSource {
  src: string // путь/URL файла (у нас часто с ?w=800&format=webp от imagetools)
  w: number // ширина этого файла; браузер сопоставляет её с атрибутом sizes
}

// Контракт пропа meta: что родитель обязан передать в <UiImg :meta="..." />.
interface ImgMeta {
  img: { src: string, w: number } // запасной <img>: если ни один <source> не подошёл
  sources: Record<string, ImgMetaSource[]> // ключ = формат (avif/webp), значение = набор ширин
}

// Браузер берёт ПЕРВЫЙ подходящий <source>. AVIF меньше и новее, поэтому он должен быть раньше WebP.
const FORMAT_ORDER = ['avif', 'webp']

// defineProps — макрос Vue: объявляет входные параметры компонента (то, что пишут в шаблоне как атрибуты).
// withDefaults — вторым аргументом задаёт значения, если родитель проп не передал.
// Результат кладём в `props`, чтобы в computed явно читать props.meta, а не «магические» переменные.
const props = withDefaults(defineProps<{
  meta: ImgMeta // обязательный: без него не из чего собрать picture
  sizes?: string // CSS-sizes для srcset, например "(max-width: 768px) 100vw, 50vw"
  alt?: string // текст для скринридеров; в HTML у img alt должен быть всегда
  loading?: 'lazy' | 'eager' // lazy — грузить, когда картинка близко к экрану; eager — сразу
  imageClass?: string // классы на <img> (скругление, тень) — стилизует родитель, не сам UiImg
  pictureClass?: string // доп. классы на <picture> (например w-full); display:block уже в pictureStyle
}>(), {
  alt: '', // пустая строка = декоративное изображение, не «undefined» в DOM
  loading: 'lazy', // для styleguide/контентных фото дефолт безопаснее, чем грузить всё сразу
})

// Берём запасной JPEG/WebP из meta. computed, чтобы при смене :meta картинка обновилась.
const fallback = computed(() => props.meta.img)

// Стили на сам <picture>, без лишнего div.
// display:block — как у бывшего div: иначе picture inline, и max-width не ограничит img с w-full.
// maxWidth — потолок по ширине файла из meta, чтобы 800px-фото не растягивалось на всю колонку.
const pictureStyle = computed(() => {
  const width = fallback.value?.w // у computed значение лежит в .value (в шаблоне Vue сам разворачивает)
  return {
    display: 'block',
    ...(width ? { maxWidth: `${width}px` } : {}),
  }
})

// Список <source> для <picture>: тип MIME + строка srcset. Пересчёт только при смене meta.
const pictureSources = computed(() => {
  const sources = props.meta.sources ?? {} // ?? {} — если sources нет, не падаем на Object.keys(undefined)
  // форматы вне приоритета (например png) — после avif/webp, порядок ключей объекта ненадёжен
  const rest = Object.keys(sources).filter((type) => !FORMAT_ORDER.includes(type))
  // сначала приоритет, потом остальное; пустые массивы выкидываем — пустой <source> браузеру не нужен
  const types = [...FORMAT_ORDER, ...rest].filter((type) => sources[type]?.length)

  // map → массив объектов под v-for в шаблоне
  return types.map((type) => ({
    type: `image/${type}`, // MIME: "webp" → "image/webp", так браузер понимает формат source
    srcset: sources[type]
      .map((item) => `${item.src} ${item.w}w`) // синтаксис srcset: "url 400w, url 800w"
      .join(', '), // несколько ширин склеиваются через запятую — это один атрибут srcset
  }))
})
</script>
