<template>
  <!--
    Карточка одной задачи.
    Слева условие, справа только её проверки.
    На узком экране проверки встают под текстом, но остаются в этой карточке,
    а не в общем списке внизу урока.
  -->
  <article class="border rounded-md p-4 grid gap-4 md:grid-cols-2 md:items-start">
    <div class="min-w-0 space-y-2">
      <slot />
    </div>
    <ul class="space-y-2 md:border-l md:border-gray-200 md:pl-4" aria-label="Проверка задачи">
      <li
        v-if="checks.length === 0"
        class="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
      >
        Для этой задачи ещё нет проверок.
      </li>
      <li
        v-for="check in checks"
        :key="check.id"
        class="rounded-md border px-3 py-2 text-sm"
        :class="check.ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'"
      >
        <div class="font-medium">{{ check.ok ? 'Ок' : 'Ещё нет' }} · {{ check.title }}</div>
        <div class="text-xs mt-1 opacity-80">
          ждали <code>{{ formatValue(check.expected) }}</code>,
          получили <code>{{ formatValue(check.actual) }}</code>
        </div>
      </li>
    </ul>
  </article>
</template>

<script setup lang="ts">
type TaskCheck = {
  id: string
  title: string
  expected: unknown
  actual: unknown
  ok: boolean
}

defineProps<{
  checks: TaskCheck[]
}>()

function formatValue(value: unknown) {
  if (value === undefined) return 'undefined'
  if (Array.isArray(value)) return `[${value.join(', ')}]`
  if (typeof value === 'string') return JSON.stringify(value)
  return String(value)
}
</script>
