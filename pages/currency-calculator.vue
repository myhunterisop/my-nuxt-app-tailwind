<template>
  <div class="calculator p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Калькулятор затрат (RUB → KGS → валюта)</h1>

    <div class="grid gap-4">
      <div class="flex gap-3 items-center">
        <label class="w-36">Сумма покупки</label>
        <input v-model.number="amount" type="number" step="0.01" class="input rounded p-2 border flex-1" />
        <select v-model="currency" class="p-2 border rounded">
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="KZT">KZT</option>
        </select>
      </div>

      <div class="flex gap-3 items-center">
        <label class="w-36">Процент комиссии</label>
        <input v-model.number="percent" type="number" step="1" class="input rounded p-2 border w-32" />
      </div>

      <details open class="p-3 border rounded bg-gray-50">
        <summary class="cursor-pointer font-medium">Курсы (можно изменить)</summary>
        <div class="mt-3 grid grid-cols-2 gap-3">
          <label class="flex items-center gap-2">1 RUB = <input v-model.number="rates.rubToKgs" type="number" step="0.0001" class="input p-1 border rounded w-28" /> KGS (смотри Бакай покупка RUB)</label>
          <label class="flex items-center gap-2">1 EUR = <input v-model.number="rates.eurToKgs" type="number" step="0.01" class="input p-1 border rounded w-28" /> KGS (смотри Бакай продажа EUR)</label>
          <label class="flex items-center gap-2">1 USD = <input v-model.number="rates.usdToKgs" type="number" step="0.01" class="input p-1 border rounded w-28" /> KGS (смотри Бакай продажа USD)</label>
          <label class="flex items-center gap-2">1 KZT = <input v-model.number="rates.kztToKgs" type="number" step="0.0001" class="input p-1 border rounded w-28" /> KGS (смотри Бакай продажа KZT)</label>
        </div>
      </details>

      <div class="p-3 border rounded">
        <div class="mb-2">Расчёт:</div>
        <div class="grid grid-cols-1 gap-2">
          <div>- Нужный KGS: <strong>{{ kgsNeededDisplay }}</strong></div>
          <div>- Нужный RUB (фактический): <strong>{{ rubNeededDisplay }}</strong></div>
          <div>- Нужный RUB (с учётом наблюдаемой поправки): <strong>{{ rubNeededWithSurchargeDisplay }}</strong></div>
          <div>- Нужный RUB (с учётом введённого %): <strong>{{ rubNeededWithPercentDisplay }}</strong></div>
        </div>
      </div>

      <!-- Таблица примеров покупок -->
      <div class="p-3 border rounded bg-white">
        <div class="flex items-center justify-between mb-2">
          <div class="font-medium">Примеры покупок</div>
          <div>
            <button @click="addRow" class="px-3 py-1 bg-green-600 text-white rounded text-sm">Добавить пример</button>
          </div>
        </div>
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left">
              <th class="pb-2">Название</th>
              <th class="pb-2">KZT</th>
              <th class="pb-2">USD</th>
              <th class="pb-2">EUR</th>
              <th class="pb-2">RUB (расчёт)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in rows" :key="i" class="border-t">
              <td class="py-2">
                <div class="flex items-center gap-2">
                  <input v-model="row.name" class="p-1 border rounded w-40" />
                  <button v-if="rows.length > 1" @click="removeRow(i)" class="text-sm text-red-600 px-2 py-1">Удалить</button>
                </div>
              </td>
              <td class="py-2"><input v-model.number="row.kzt" type="number" step="0.01" class="p-1 border rounded w-28"/></td>
              <td class="py-2"><input v-model.number="row.usd" type="number" step="0.01" class="p-1 border rounded w-28"/></td>
              <td class="py-2"><input v-model.number="row.eur" type="number" step="0.01" class="p-1 border rounded w-28"/></td>
              <td class="py-2">
                <div v-if="hasAnyAmount(row)">
                  <div v-if="row.kzt !== null && row.kzt !== undefined">KZT → {{ formatRub(convertToRub(row.kzt, 'KZT')) }} / с {{ percent }}% → {{ formatRub(convertToRubWithPercent(row.kzt, 'KZT')) }}</div>
                  <div v-if="row.usd !== null && row.usd !== undefined">USD → {{ formatRub(convertToRub(row.usd, 'USD')) }} / с {{ percent }}% → {{ formatRub(convertToRubWithPercent(row.usd, 'USD')) }}</div>
                  <div v-if="row.eur !== null && row.eur !== undefined">EUR → {{ formatRub(convertToRub(row.eur, 'EUR')) }} / с {{ percent }}% → {{ formatRub(convertToRubWithPercent(row.eur, 'EUR')) }}</div>
                </div>
                <div v-else class="text-gray-500">Введите суммы в колонках</div>
              </td>
            </tr>
          </tbody>
          <tfoot class="border-t">
            <tr class="bg-gray-50">
              <td class="py-2 font-medium">Сумма</td>
              <td class="py-2"><input :value="sumKzt" readonly class="p-1 border rounded w-28 bg-white" /></td>
              <td class="py-2"><input :value="sumUsd" readonly class="p-1 border rounded w-28 bg-white" /></td>
              <td class="py-2"><input :value="sumEur" readonly class="p-1 border rounded w-28 bg-white" /></td>
              <td class="py-2 text-sm text-gray-600">
                <div class="text-xs">Всего RUB:</div>
                <div class="font-medium">{{ sumRubDisplay }}</div>
                <div class="text-xs mt-1">С %: {{ sumRubWithPercentDisplay }}</div>
                <div class="text-xs mt-1 border-t pt-1">С поправкой:</div>
                <div class="font-medium">{{ sumRubWithSurchargeDisplay }}</div>
                <div class="text-xs mt-1">С % + поправка: {{ sumRubWithPercentAndSurchargeDisplay }}</div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="p-3 text-sm text-gray-700 border rounded">
        <div class="mb-2 font-medium">Информация о наблюдаемой комиссии</div>
        <div class="mb-1">На основе двух примеров (89.99 EUR → 106.9 USD и 78 EUR → 92.65 USD) автоматически вычислена поправка (multiplier): <strong>{{ multiplierDisplay }}</strong></div>
        <div class="text-xs text-gray-600">Применяется к расчёту RUB чтобы учесть разницу между теоретическим обменом через KGS и фактически списанной суммой.</div>
      </div>

      <div class="text-right">
        <button @click="reset" class="px-4 py-2 bg-blue-600 text-white rounded">Сброс</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const amount = ref<number>(50999)
const currency = ref<'EUR'|'USD'|'KZT'>('KZT')

const rates = ref({
  // исходные курсы, можно менять в UI
  rubToKgs: 1.075,
  eurToKgs: 102.0,
  usdToKgs: 87.5,
  kztToKgs: 0.185,
})

// Процентная надбавка (ввод пользователем)
const percent = ref<number>(6)

// Строки таблицы примеров
const rows = ref<Array<{ name: string; kzt: number | null; usd: number | null; eur: number | null }>>([
  { name: 'Epic', kzt: null, usd: null, eur: null },
  { name: 'Подписка 6 мес.', kzt: null, usd: null, eur: null },
])

// Примеры из задания
const examples = [
  { eur: 89.99, chargedUsd: 106.9 },
  { eur: 78, chargedUsd: 92.65 },
]

const multiplier = computed(() => {
  // для каждого примера вычисляем теоретический USD (через KGS)
  const ratios = examples.map(ex => {
    const computedUsd = (ex.eur * rates.value.eurToKgs) / rates.value.usdToKgs
    return ex.chargedUsd / computedUsd
  })
  // средняя поправка
  const avg = ratios.reduce((s, v) => s + v, 0) / ratios.length
  return avg || 1
})

const targetRateKgs = computed(() => {
  switch (currency.value) {
    case 'EUR': return rates.value.eurToKgs
    case 'USD': return rates.value.usdToKgs
    case 'KZT': return rates.value.kztToKgs
  }
})

const kgsNeeded = computed(() => {
  return amount.value * targetRateKgs.value
})

const rubNeeded = computed(() => {
  return kgsNeeded.value / rates.value.rubToKgs
})

const rubNeededWithSurcharge = computed(() => {
  return rubNeeded.value * multiplier.value
})

const rubNeededWithPercent = computed(() => {
  return rubNeeded.value * (1 + (percent.value || 0) / 100)
})

function reset() {
  amount.value = 50999
  currency.value = 'KZT'
  percent.value = 6
  rates.value = { rubToKgs: 1.075, eurToKgs: 102.0, usdToKgs: 87.5, kztToKgs: 0.185 }
  rows.value = [ { name: 'Epic', kzt: null, usd: null, eur: null }, { name: 'Подписка 6 мес.', kzt: null, usd: null, eur: null } ]
}
function addRow() {
  const idx = rows.value.length + 1
  rows.value.push({ name: `Пример ${idx}`, kzt: null, usd: null, eur: null })
}

function removeRow(i: number) {
  if (i >= 0 && i < rows.value.length) rows.value.splice(i, 1)
}

const sumRub = computed(() => {
  return rows.value.reduce((s, r) => {
    const a = convertToRub(r.kzt, 'KZT')
    const b = convertToRub(r.usd, 'USD')
    const c = convertToRub(r.eur, 'EUR')
    return s + (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b) + (isNaN(c) ? 0 : c)
  }, 0)
})

const sumRubWithPercent = computed(() => {
  return rows.value.reduce((s, r) => {
    const a = convertToRubWithPercent(r.kzt, 'KZT')
    const b = convertToRubWithPercent(r.usd, 'USD')
    const c = convertToRubWithPercent(r.eur, 'EUR')
    return s + (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b) + (isNaN(c) ? 0 : c)
  }, 0)
})

const sumRubWithSurcharge = computed(() => {
  return rows.value.reduce((s, r) => {
    const a = convertToRub(r.kzt, 'KZT')
    const b = convertToRub(r.usd, 'USD')
    const c = convertToRub(r.eur, 'EUR')
    const base = (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b) + (isNaN(c) ? 0 : c)
    return s + base * multiplier.value
  }, 0)
})

const sumRubWithPercentAndSurcharge = computed(() => {
  return rows.value.reduce((s, r) => {
    const a = convertToRubWithPercent(r.kzt, 'KZT')
    const b = convertToRubWithPercent(r.usd, 'USD')
    const c = convertToRubWithPercent(r.eur, 'EUR')
    const base = (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b) + (isNaN(c) ? 0 : c)
    return s + base * multiplier.value
  }, 0)
})

const sumRubDisplay = computed(() => formatRub(sumRub.value))
const sumRubWithPercentDisplay = computed(() => formatRub(sumRubWithPercent.value))
const sumRubWithSurchargeDisplay = computed(() => formatRub(sumRubWithSurcharge.value))
const sumRubWithPercentAndSurchargeDisplay = computed(() => formatRub(sumRubWithPercentAndSurcharge.value))

const sumKzt = computed(() => {
  return rows.value.reduce((s, r) => s + (Number(r.kzt) || 0), 0).toFixed(2)
})
const sumUsd = computed(() => {
  return rows.value.reduce((s, r) => s + (Number(r.usd) || 0), 0).toFixed(2)
})
const sumEur = computed(() => {
  return rows.value.reduce((s, r) => s + (Number(r.eur) || 0), 0).toFixed(2)
})

// Helpers for table and formatting
function hasAnyAmount(row: { kzt: number | null; usd: number | null; eur: number | null }) {
  return (row.kzt || row.kzt === 0) || (row.usd || row.usd === 0) || (row.eur || row.eur === 0)
}

function convertToRub(value: number | null | undefined, cur: 'KZT'|'USD'|'EUR') {
  if (value === null || value === undefined || isNaN(Number(value))) return NaN
  const v = Number(value)
  let kgs = 0
  if (cur === 'KZT') kgs = v * rates.value.kztToKgs
  if (cur === 'USD') kgs = v * rates.value.usdToKgs
  if (cur === 'EUR') kgs = v * rates.value.eurToKgs
  const rub = kgs / rates.value.rubToKgs
  return rub
}

function convertToRubWithPercent(value: number | null | undefined, cur: 'KZT'|'USD'|'EUR') {
  const base = convertToRub(value, cur)
  if (isNaN(base)) return NaN
  return base * (1 + (percent.value || 0) / 100)
}

function formatRub(val: number) {
  if (isNaN(val)) return '-'
  return Number(val.toFixed(2)).toLocaleString() + ' RUB'
}

const kgsNeededDisplay = computed(() => kgsNeeded.value.toFixed(2) + ' KGS')
const rubNeededDisplay = computed(() => Number(rubNeeded.value.toFixed(2)).toLocaleString() + ' RUB')
const rubNeededWithSurchargeDisplay = computed(() => Number(rubNeededWithSurcharge.value.toFixed(2)).toLocaleString() + ' RUB')
const rubNeededWithPercentDisplay = computed(() => Number(rubNeededWithPercent.value.toFixed(2)).toLocaleString() + ' RUB')
const multiplierDisplay = computed(() => multiplier.value.toFixed(4) + ' (' + ((multiplier.value - 1) * 100).toFixed(2) + '%)')
</script>

<style scoped>
.calculator {
    background: #f9f9f9;
}
.input { background: white; }
</style>
