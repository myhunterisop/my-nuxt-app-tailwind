<template>
  <div
    class="horizontal-scroller"
    tabindex="0"
    @keydown="onKeydown"
  >
    <ClientOnly>
      <RecycleScroller
        ref="scrollerRef"
        class="horizontal-scroller__track"
        :class="{ 'is-dragging': isDragging }"
        :style="{ height: `${height}px` }"
        :items="items"
        :item-size="itemSize"
        :buffer="buffer"
        direction="horizontal"
        :key-field="keyField"
        emit-update
        @scroll="updateScrollState"
        @update="onUpdate"
        @visible="updateScrollState"
        @resize="updateScrollState"
        v-slot="{ item, index }"
      >
        <div
          class="horizontal-scroller__item"
          :style="{ width: `${itemSize}px` }"
        >
          <slot :item="item" :index="index">
            <div class="horizontal-scroller__fallback">
              {{ fallbackLabel(item, index) }}
            </div>
          </slot>
        </div>
      </RecycleScroller>

      <template #fallback>
        <div
          class="horizontal-scroller__track"
          :style="{ height: `${height}px` }"
        />
      </template>
    </ClientOnly>

    <div
      v-if="showNav"
      class="horizontal-scroller__nav"
    >
      <button
        type="button"
        class="horizontal-scroller__nav-btn horizontal-scroller__nav-btn--left"
        :disabled="!canScrollLeft"
        aria-label="Прокрутить влево"
        @click="scrollLeft"
      >
        ←
      </button>
      <button
        type="button"
        class="horizontal-scroller__nav-btn horizontal-scroller__nav-btn--right"
        :disabled="!canScrollRight"
        aria-label="Прокрутить вправо"
        @click="scrollRight"
      >
        →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import type { RecycleScrollerExposed } from 'vue-virtual-scroller'

type ScrollerItem = Record<string, unknown>

type RecycleScrollerInst = RecycleScrollerExposed<ScrollerItem> & {
  $el?: HTMLElement
}

const props = withDefaults(defineProps<{
  items: ScrollerItem[]
  itemSize?: number
  keyField?: string
  scrollStep?: number
  height?: number
  buffer?: number
  showNav?: boolean
  draggable?: boolean
  inertia?: boolean
}>(), {
  itemSize: 200,
  keyField: 'id',
  scrollStep: 300,
  height: 200,
  buffer: 200,
  showNav: true,
  draggable: true,
  inertia: true,
})

const emit = defineEmits<{
  range: [payload: { start: number, end: number, total: number }]
}>()

const scrollerRef = ref<RecycleScrollerInst | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const isDragging = ref(false)

let dragStartX = 0
let dragStartScroll = 0
let dragMoved = false
let inertiaFrame = 0
let inertiaVelocity = 0
let inertiaLastTime = 0
let inertiaScroll = 0
const velocitySamples: Array<{ t: number, x: number }> = []

const INERTIA_FRICTION = 0.0022
const INERTIA_MIN_VELOCITY = 0.006
const INERTIA_MAX_VELOCITY = 2.4
const VELOCITY_WINDOW_MS = 80
const EDGE_SOFT_PX = 140

const resetVelocitySamples = () => {
  velocitySamples.length = 0
}

const pushVelocitySample = (x: number) => {
  const t = performance.now()
  velocitySamples.push({ t, x })
  const cutoff = t - VELOCITY_WINDOW_MS
  while (velocitySamples.length > 1 && velocitySamples[0].t < cutoff) {
    velocitySamples.shift()
  }
}

const samplePointerVelocity = () => {
  if (velocitySamples.length < 2) return 0
  const first = velocitySamples[0]
  const last = velocitySamples[velocitySamples.length - 1]
  const dt = last.t - first.t
  if (dt <= 0) return 0
  const velocity = (last.x - first.x) / dt
  return Math.max(-INERTIA_MAX_VELOCITY, Math.min(INERTIA_MAX_VELOCITY, velocity))
}

const trackEl = computed<HTMLElement | null>(() => {
  const inst = scrollerRef.value
  if (!inst) return null
  if (inst.el && 'value' in inst.el) return inst.el.value ?? inst.$el ?? null
  return inst.$el ?? null
})

const getTrackEl = () => trackEl.value

const stopInertia = () => {
  if (inertiaFrame) {
    cancelAnimationFrame(inertiaFrame)
    inertiaFrame = 0
  }
  inertiaVelocity = 0
}

const clampScroll = (el: HTMLElement, next: number) => {
  const max = Math.max(0, el.scrollWidth - el.clientWidth)
  return Math.min(max, Math.max(0, next))
}

const tickInertia = (time: number) => {
  const el = getTrackEl()
  if (!el || !props.inertia) {
    stopInertia()
    return
  }

  const rawDt = time - inertiaLastTime
  inertiaLastTime = time
  if (rawDt <= 0 || rawDt > 48) {
    inertiaFrame = requestAnimationFrame(tickInertia)
    return
  }
  const dt = rawDt
  const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
  const remaining = inertiaVelocity > 0
    ? maxScroll - inertiaScroll
    : inertiaScroll

  if (remaining < EDGE_SOFT_PX && remaining >= 0) {
    const maxEdgeVelocity = remaining * 0.012
    if (Math.abs(inertiaVelocity) > maxEdgeVelocity) {
      inertiaVelocity = Math.sign(inertiaVelocity) * maxEdgeVelocity
    }
  }

  inertiaVelocity *= Math.exp(-INERTIA_FRICTION * dt)
  inertiaScroll += inertiaVelocity * dt
  inertiaScroll = clampScroll(el, inertiaScroll)
  el.scrollLeft = inertiaScroll

  const remainingAfter = inertiaVelocity > 0
    ? maxScroll - inertiaScroll
    : inertiaScroll
  const settled = Math.abs(inertiaVelocity) < INERTIA_MIN_VELOCITY || remainingAfter <= 0.35
  if (settled) {
    stopInertia()
    updateScrollState()
    return
  }

  inertiaFrame = requestAnimationFrame(tickInertia)
}

const startInertia = (pointerVelocity: number) => {
  const el = getTrackEl()
  stopInertia()
  if (!el || !props.inertia || Math.abs(pointerVelocity) < INERTIA_MIN_VELOCITY) return
  inertiaVelocity = -pointerVelocity
  inertiaScroll = el.scrollLeft
  inertiaLastTime = performance.now()
  inertiaFrame = requestAnimationFrame(tickInertia)
}

const updateScrollState = () => {
  const el = getTrackEl()
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 1
  canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 1
}

const scrollBy = (delta: number) => {
  stopInertia()
  getTrackEl()?.scrollBy({ left: delta, behavior: 'smooth' })
  window.setTimeout(updateScrollState, 50)
}

const scrollLeft = () => scrollBy(-props.scrollStep)
const scrollRight = () => scrollBy(props.scrollStep)

const scrollToItem = (index: number) => {
  scrollerRef.value?.scrollToItem(index, { smooth: true })
}

const scrollToStart = () => {
  scrollerRef.value?.scrollToPosition(0, { smooth: true })
}

const scrollToEnd = () => {
  const last = props.items.length - 1
  if (last >= 0) scrollerRef.value?.scrollToItem(last, { smooth: true, align: 'end' })
}

const isInteractiveTarget = (target: EventTarget | null) => {
  return target instanceof Element
    && Boolean(target.closest('button, a, input, textarea, select, label'))
}

const onPointerDown = (event: PointerEvent) => {
  if (!props.draggable || event.button !== 0 || isInteractiveTarget(event.target)) return
  const el = getTrackEl()
  if (!el) return

  stopInertia()
  isDragging.value = true
  dragMoved = false
  dragStartX = event.clientX
  dragStartScroll = el.scrollLeft
  resetVelocitySamples()
  pushVelocitySample(event.clientX)
  try {
    el.setPointerCapture(event.pointerId)
  } catch {
    // pointer capture недоступен для неtrusted-событий
  }
}

const onPointerMove = (event: PointerEvent) => {
  if (!isDragging.value) return
  const el = getTrackEl()
  if (!el) return

  pushVelocitySample(event.clientX)

  const delta = event.clientX - dragStartX
  if (Math.abs(delta) > 3) dragMoved = true
  el.scrollLeft = dragStartScroll - delta
}

const onPointerUp = (event: PointerEvent) => {
  if (!isDragging.value) return
  const el = getTrackEl()
  isDragging.value = false
  try {
    if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId)
  } catch {
    // ignore
  }
  startInertia(samplePointerVelocity())
  updateScrollState()
}

const onDragClickCapture = (event: MouseEvent) => {
  if (!dragMoved) return
  event.preventDefault()
  event.stopPropagation()
  dragMoved = false
}

const onWheel = (event: WheelEvent) => {
  const el = getTrackEl()
  if (!el) return
  stopInertia()
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

  const atStart = el.scrollLeft <= 0
  const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1
  if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return

  event.preventDefault()
  el.scrollLeft += event.deltaY
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    scrollLeft()
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    scrollRight()
  }
}

const fallbackLabel = (item: ScrollerItem, index: number) => {
  const title = item.title ?? item.name
  return typeof title === 'string' ? title : `Item ${index}`
}

const onUpdate = (start: number, end: number) => {
  emit('range', { start, end, total: props.items.length })
  updateScrollState()
}

useEventListener(trackEl, 'scroll', updateScrollState, { passive: true })
useEventListener(trackEl, 'wheel', onWheel, { passive: false })
useEventListener(trackEl, 'pointerdown', onPointerDown)
useEventListener(trackEl, 'pointermove', onPointerMove)
useEventListener(trackEl, 'pointerup', onPointerUp)
useEventListener(trackEl, 'pointercancel', onPointerUp)
useEventListener(trackEl, 'click', onDragClickCapture, { capture: true })
useEventListener(trackEl, 'dragstart', (event) => event.preventDefault())

onMounted(async () => {
  await nextTick()
  updateScrollState()
})

onUnmounted(() => {
  stopInertia()
})

defineExpose({
  scrollToItem,
  scrollToStart,
  scrollToEnd,
  scrollLeft,
  scrollRight,
})
</script>

<style scoped>
.horizontal-scroller {
  position: relative;
  width: 100%;
  min-width: 0;
  outline: none;
}

.horizontal-scroller__track {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  cursor: grab;
  user-select: none;
  scroll-behavior: auto;
}

.horizontal-scroller__track.is-dragging {
  cursor: grabbing;
}

.horizontal-scroller__track::-webkit-scrollbar {
  height: 8px;
}

.horizontal-scroller__track::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.horizontal-scroller__track::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.horizontal-scroller__item {
  height: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
}

.horizontal-scroller__fallback {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.horizontal-scroller__nav {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 10;
}

.horizontal-scroller__nav-btn {
  pointer-events: auto;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

.horizontal-scroller__nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .horizontal-scroller__nav {
    display: none;
  }
}
</style>
