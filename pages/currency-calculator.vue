<template>
  <div class="calculator p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Калькулятор затрат (RUB → KGS → валюта)</h1>

    <div class="grid gap-4">
      <div class="flex gap-3 items-center">
        <label class="w-36" for="purchase-amount">Сумма покупки</label>
        <input
          id="purchase-amount"
          v-model.number="amount"
          type="number"
          min="0"
          step="0.01"
          class="input rounded p-2 border flex-1"
        />
        <select v-model="currency" class="p-2 border rounded bg-white">
          <option v-for="code in FOREIGN_CURRENCIES" :key="code" :value="code">
            {{ code }}
          </option>
        </select>
      </div>

      <div class="flex gap-3 items-center">
        <label class="w-36" for="commission-percent">Процент комиссии</label>
        <input
          id="commission-percent"
          v-model.number="percent"
          type="number"
          min="0"
          step="1"
          class="input rounded p-2 border w-32"
        />
      </div>

      <details open class="p-3 border rounded bg-gray-50">
        <summary class="cursor-pointer font-medium">Курсы (можно изменить)</summary>
        <div class="mt-3 grid grid-cols-2 gap-3">
          <label class="flex items-center gap-2">
            1 RUB =
            <input v-model.number="rates.rubToKgs" type="number" step="0.0001" class="input p-1 border rounded w-28" />
            KGS (Бакай, покупка RUB)
          </label>
          <label class="flex items-center gap-2">
            1 EUR =
            <input v-model.number="rates.eurToKgs" type="number" step="0.01" class="input p-1 border rounded w-28" />
            KGS (Бакай, продажа EUR)
          </label>
          <label class="flex items-center gap-2">
            1 USD =
            <input v-model.number="rates.usdToKgs" type="number" step="0.01" class="input p-1 border rounded w-28" />
            KGS (Бакай, продажа USD)
          </label>
          <label class="flex items-center gap-2">
            1 KZT =
            <input v-model.number="rates.kztToKgs" type="number" step="0.0001" class="input p-1 border rounded w-28" />
            KGS (Бакай, продажа KZT)
          </label>
        </div>
      </details>

      <div class="p-3 border rounded">
        <div class="mb-2">Расчёт:</div>
        <div class="grid grid-cols-1 gap-2">
          <div>- Нужный KGS: <strong>{{ formatMoney(kgsNeeded, 'KGS') }}</strong></div>
          <div>- Нужный RUB (фактический): <strong>{{ formatMoney(rubNeeded, 'RUB') }}</strong></div>
          <div>- Нужный RUB (с наблюдаемой поправкой): <strong>{{ formatMoney(rubNeededWithSurcharge, 'RUB') }}</strong></div>
          <div>- Нужный RUB (с введённым %): <strong>{{ formatMoney(rubNeededWithPercent, 'RUB') }}</strong></div>
        </div>
      </div>

      <div class="p-3 border rounded bg-white overflow-x-auto">
        <div class="flex items-center justify-between mb-2">
          <div class="font-medium">Примеры покупок</div>
          <button type="button" class="px-3 py-1 bg-green-600 text-white rounded text-sm" @click="addRow">
            Добавить пример
          </button>
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
            <tr v-for="row in rows" :key="row.id" class="border-t">
              <td class="py-2">
                <div class="flex items-center gap-2">
                  <input v-model="row.name" class="p-1 border rounded w-40" />
                  <button
                    v-if="rows.length > 1"
                    type="button"
                    class="text-sm text-red-600 px-2 py-1"
                    @click="removeRow(row.id)"
                  >
                    Удалить
                  </button>
                </div>
              </td>
              <td class="py-2">
                <input v-model.number="row.kzt" type="number" step="0.01" class="p-1 border rounded w-28" />
              </td>
              <td class="py-2">
                <input v-model.number="row.usd" type="number" step="0.01" class="p-1 border rounded w-28" />
              </td>
              <td class="py-2">
                <input v-model.number="row.eur" type="number" step="0.01" class="p-1 border rounded w-28" />
              </td>
              <td class="py-2">
                <div v-if="hasAnyAmount(row)">
                  <div v-if="isFilled(row.kzt)">
                    KZT → {{ formatMoney(toRub(row.kzt, 'KZT'), 'RUB') }}
                    / с {{ percent }}% → {{ formatMoney(withPercent(toRub(row.kzt, 'KZT')), 'RUB') }}
                  </div>
                  <div v-if="isFilled(row.usd)">
                    USD → {{ formatMoney(toRub(row.usd, 'USD'), 'RUB') }}
                    / с {{ percent }}% → {{ formatMoney(withPercent(toRub(row.usd, 'USD')), 'RUB') }}
                  </div>
                  <div v-if="isFilled(row.eur)">
                    EUR → {{ formatMoney(toRub(row.eur, 'EUR'), 'RUB') }}
                    / с {{ percent }}% → {{ formatMoney(withPercent(toRub(row.eur, 'EUR')), 'RUB') }}
                  </div>
                </div>
                <div v-else class="text-gray-500">Введите суммы в колонках</div>
              </td>
            </tr>
          </tbody>
          <tfoot class="border-t">
            <tr class="bg-gray-50">
              <td class="py-2 font-medium">Сумма</td>
              <td class="py-2"><input :value="sumKzt.toFixed(2)" readonly class="p-1 border rounded w-28 bg-white" /></td>
              <td class="py-2"><input :value="sumUsd.toFixed(2)" readonly class="p-1 border rounded w-28 bg-white" /></td>
              <td class="py-2"><input :value="sumEur.toFixed(2)" readonly class="p-1 border rounded w-28 bg-white" /></td>
              <td class="py-2 text-sm text-gray-600">
                <div class="text-xs">Всего RUB:</div>
                <div class="font-medium">{{ formatMoney(sumRub, 'RUB') }}</div>
                <div class="text-xs mt-1">С %: {{ formatMoney(sumRubWithPercent, 'RUB') }}</div>
                <div class="text-xs mt-1 border-t pt-1">С поправкой:</div>
                <div class="font-medium">{{ formatMoney(sumRubWithSurcharge, 'RUB') }}</div>
                <div class="text-xs mt-1">С % + поправка: {{ formatMoney(sumRubWithPercentAndSurcharge, 'RUB') }}</div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="p-3 text-sm text-gray-700 border rounded">
        <div class="mb-2 font-medium">Информация о наблюдаемой комиссии</div>
        <div class="mb-1">
          По примерам 89.99 EUR → 106.9 USD и 78 EUR → 92.65 USD поправка:
          <strong>{{ multiplierDisplay }}</strong>
        </div>
        <div class="text-xs text-gray-600">
          Умножает RUB, чтобы учесть разницу между теоретическим EUR→USD через KGS и фактическим списанием.
        </div>
      </div>

      <div class="text-right">
        <button type="button" class="px-4 py-2 bg-blue-600 text-white rounded" @click="reset">
          Сброс
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type ForeignCurrency = 'EUR' | 'USD' | 'KZT'

type Rates = {
  rubToKgs: number
  eurToKgs: number
  usdToKgs: number
  kztToKgs: number
}

type PurchaseRow = {
  id: number
  name: string
  kzt: number | null
  usd: number | null
  eur: number | null
}

const FOREIGN_CURRENCIES: ForeignCurrency[] = ['EUR', 'USD', 'KZT']

const DEFAULT_AMOUNT = 50999
const DEFAULT_CURRENCY: ForeignCurrency = 'KZT'
const DEFAULT_PERCENT = 10
const DEFAULT_RATES: Rates = {
  rubToKgs: 1.02,
  eurToKgs: 97.7,
  usdToKgs: 87.5,
  kztToKgs: 0.205,
}

const CARD_SURCHARGE_EXAMPLES = [
  { eur: 89.99, chargedUsd: 106.9 },
  { eur: 78, chargedUsd: 92.65 },
]

const { setPageSeo } = useSeo()
setPageSeo('Калькулятор валют | MyApp', 'Расчёт затрат RUB → KGS → EUR/USD/KZT')

let nextRowId = 1
const createRow = (name: string): PurchaseRow => ({
  id: nextRowId++,
  name,
  kzt: null,
  usd: null,
  eur: null,
})

const defaultRows = (): PurchaseRow[] => [
  createRow('Epic'),
  createRow('Подписка 6 мес.'),
]

const amount = ref(DEFAULT_AMOUNT)
const currency = ref<ForeignCurrency>(DEFAULT_CURRENCY)
const percent = ref(DEFAULT_PERCENT)
const rates = ref<Rates>({ ...DEFAULT_RATES })
const rows = ref<PurchaseRow[]>(defaultRows())

const rateFor = (code: ForeignCurrency) => {
  if (code === 'EUR') return rates.value.eurToKgs
  if (code === 'USD') return rates.value.usdToKgs
  return rates.value.kztToKgs
}

const toKgs = (value: number, code: ForeignCurrency) => {
  if (!Number.isFinite(value) || value < 0) return 0
  const rate = rateFor(code)
  if (!rate || rate <= 0) return 0
  return value * rate
}

const toRub = (value: number | null | undefined, code: ForeignCurrency) => {
  if (!isFilled(value)) return Number.NaN
  const rubRate = rates.value.rubToKgs
  if (!rubRate || rubRate <= 0) return Number.NaN
  return toKgs(value, code) / rubRate
}

const withPercent = (rub: number) => {
  if (!Number.isFinite(rub)) return Number.NaN
  return rub * (1 + (percent.value || 0) / 100)
}

const withSurcharge = (rub: number) => {
  if (!Number.isFinite(rub)) return Number.NaN
  return rub * multiplier.value
}

const isFilled = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value)
}

const hasAnyAmount = (row: PurchaseRow) => {
  return isFilled(row.kzt) || isFilled(row.usd) || isFilled(row.eur)
}

const rowRub = (row: PurchaseRow, applyPercent = false) => {
  const parts = [
    toRub(row.kzt, 'KZT'),
    toRub(row.usd, 'USD'),
    toRub(row.eur, 'EUR'),
  ]
  const base = parts.reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0)
  return applyPercent ? withPercent(base) : base
}

const formatMoney = (value: number, suffix: string) => {
  if (!Number.isFinite(value)) return '-'
  return `${Number(value.toFixed(2)).toLocaleString()} ${suffix}`
}

const multiplier = computed(() => {
  const ratios = CARD_SURCHARGE_EXAMPLES.map((example) => {
    const theoreticalUsd = toKgs(example.eur, 'EUR') / rateFor('USD')
    if (!theoreticalUsd) return 1
    return example.chargedUsd / theoreticalUsd
  })
  const avg = ratios.reduce((sum, value) => sum + value, 0) / ratios.length
  return avg || 1
})

const kgsNeeded = computed(() => toKgs(Number(amount.value) || 0, currency.value))
const rubNeeded = computed(() => {
  const rubRate = rates.value.rubToKgs
  if (!rubRate || rubRate <= 0) return 0
  return kgsNeeded.value / rubRate
})
const rubNeededWithSurcharge = computed(() => withSurcharge(rubNeeded.value))
const rubNeededWithPercent = computed(() => withPercent(rubNeeded.value))
const multiplierDisplay = computed(() => {
  const extraPercent = (multiplier.value - 1) * 100
  return `${multiplier.value.toFixed(4)} (${extraPercent.toFixed(2)}%)`
})

const sumBy = (field: 'kzt' | 'usd' | 'eur') => {
  return rows.value.reduce((sum, row) => sum + (Number(row[field]) || 0), 0)
}

const sumKzt = computed(() => sumBy('kzt'))
const sumUsd = computed(() => sumBy('usd'))
const sumEur = computed(() => sumBy('eur'))
const sumRub = computed(() => rows.value.reduce((sum, row) => sum + rowRub(row), 0))
const sumRubWithPercent = computed(() => rows.value.reduce((sum, row) => sum + rowRub(row, true), 0))
const sumRubWithSurcharge = computed(() => sumRub.value * multiplier.value)
const sumRubWithPercentAndSurcharge = computed(() => sumRubWithPercent.value * multiplier.value)

const addRow = () => {
  rows.value.push(createRow(`Пример ${rows.value.length + 1}`))
}

const removeRow = (id: number) => {
  if (rows.value.length <= 1) return
  rows.value = rows.value.filter((row) => row.id !== id)
}

const reset = () => {
  amount.value = DEFAULT_AMOUNT
  currency.value = DEFAULT_CURRENCY
  percent.value = DEFAULT_PERCENT
  rates.value = { ...DEFAULT_RATES }
  nextRowId = 1
  rows.value = defaultRows()
}
</script>

<style scoped>
.calculator {
  background: #f9f9f9;
}
.input {
  background: white;
}
</style>
