<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-2xl font-semibold mb-2">Raider.IO: Mythic+ за неделю</h1>
        <p class="text-gray-600 mb-4">
          Таблица по нескольким персонажам. Условие: минимум
          <span class="font-semibold">{{ minKeysThreshold }}</span>
          ключей уровня
          <span class="font-semibold">{{ minKeyLevelThreshold }}+</span>
          за выбранный период (по умолчанию — с прошлой среды по сегодня, МСК).
          Raider.IO не отдаёт полный лог: каждое поле — до 10 забегов, мы склеиваем
          recent / weekly / previous week / highest / best и копим уникальные ключи в браузере при повторных обновлениях.
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="loadAllPlayers"
            :disabled="loading"
            class="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Загрузка...' : 'Обновить всех' }}
          </button>
          <button
            @click="resetPlayers"
            class="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600"
          >
            Сброс
          </button>
          <button
            @click="addPlayerRow"
            class="bg-emerald-600 text-white px-5 py-2 rounded-md hover:bg-emerald-700"
          >
            Добавить персонажа
          </button>
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-700">Мин. кол-во:</label>
            <input
              v-model.number="minKeysThreshold"
              type="number"
              min="1"
              class="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-700">Мин. уровень:</label>
            <input
              v-model.number="minKeyLevelThreshold"
              type="number"
              min="2"
              class="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-700" for="period-from">С:</label>
            <input
              id="period-from"
              v-model="periodFrom"
              type="date"
              class="px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-700" for="period-to">По:</label>
            <input
              id="period-to"
              v-model="periodTo"
              type="date"
              class="px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6 text-red-700">
        {{ error }}
      </div>

      <div
        v-if="failedPlayers.length > 0"
        class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4"
      >
        <div class="font-medium text-amber-800 mb-2">Не выполнили условие:</div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(player, idx) in failedPlayers"
            :key="`${player.name}-${player.realm}-${idx}`"
            class="inline-flex items-center px-2 py-1 rounded bg-amber-100 text-amber-900 text-sm"
          >
            {{ player.name }} ({{ player.realm }}) — {{ player.qualified }}/{{ minKeysThreshold }}
          </span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="text-left px-3 py-2">Персонаж</th>
              <th class="text-left px-3 py-2">Реалм</th>
              <th class="text-left px-3 py-2">Ключей за период</th>
              <th class="text-left px-3 py-2">Ключей {{ minKeyLevelThreshold }}+</th>
              <th class="text-left px-3 py-2">Условие выполнено</th>
              <th class="text-left px-3 py-2">Действие</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(row, idx) in players" :key="idx">
              <tr
                class="border-b cursor-pointer hover:bg-gray-50"
                @click="toggleExpanded(idx)"
              >
                <td class="px-3 py-2 font-medium">
                  <input
                    v-model="row.name"
                    @click.stop
                    class="w-full px-2 py-1 border border-gray-300 rounded-md"
                    placeholder="Имя персонажа"
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model="row.realm"
                    @click.stop
                    class="w-full px-2 py-1 border border-gray-300 rounded-md"
                    placeholder="Реалм"
                  />
                </td>
                <td class="px-3 py-2">{{ row.result?.weeklyKeysCompleted ?? '-' }}</td>
                <td class="px-3 py-2">{{ row.result ? getQualifiedRunsCount(row.result) : '-' }}</td>
                <td class="px-3 py-2 text-xl leading-none">
                  <span
                    v-if="row.result && getQualifiedRunsCount(row.result) >= minKeysThreshold"
                    class="text-green-600"
                  >
                    ✓
                  </span>
                  <span v-else class="text-gray-400">—</span>
                </td>
                <td class="px-3 py-2">
                  <button
                    @click.stop="removePlayerRow(idx)"
                    :disabled="players.length <= 1"
                    class="text-red-600 hover:text-red-700 disabled:text-gray-300"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
              <tr v-if="expandedRow === idx" class="bg-gray-50 border-b">
                <td colspan="6" class="px-3 py-3">
                  <div v-if="row.loading" class="text-gray-500">Загрузка...</div>
                  <div v-else-if="row.error" class="text-red-600">{{ row.error }}</div>
                  <div v-else-if="row.result">
                    <details open>
                      <summary class="cursor-pointer font-medium">Все попытки за период</summary>
                      <div class="mt-2 overflow-x-auto">
                        <table class="min-w-full text-xs">
                          <thead class="bg-white border-b">
                            <tr>
                              <th class="text-left px-2 py-1">Подземелье</th>
                              <th class="text-left px-2 py-1">Уровень</th>
                              <th class="text-left px-2 py-1">Статус</th>
                              <th class="text-left px-2 py-1">Завершено</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(run, runIdx) in row.result.weeklyRuns" :key="runIdx" class="border-b">
                              <td class="px-2 py-1">{{ run.dungeon || '-' }}</td>
                              <td class="px-2 py-1">+{{ run.mythic_level ?? '-' }}</td>
                              <td class="px-2 py-1">
                                <span v-if="isTimedRun(run)" class="text-green-700">в тайм</span>
                                <span v-else class="text-amber-700">не в тайм</span>
                              </td>
                              <td class="px-2 py-1">{{ formatDate(run.completed_at) }}</td>
                            </tr>
                            <tr v-if="row.result.weeklyRuns.length === 0">
                              <td colspan="4" class="px-2 py-2 text-gray-500">Нет попыток за выбранный период.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </details>
                  </div>
                  <div v-else class="text-gray-500">Нажмите "Обновить всех", чтобы загрузить данные.</div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="bg-white rounded-lg shadow-md p-4 mt-4">
        <div class="font-medium mb-3">Склеенные забеги Raider.IO (без полного лога)</div>
        <div class="space-y-3">
          <div
            v-for="(row, idx) in players"
            :key="`raw-${idx}`"
            class="border rounded p-3 bg-gray-50"
          >
            <div class="text-sm font-medium mb-2">{{ row.name || 'Без имени' }} ({{ row.realm || 'Без реалма' }})</div>
            <pre class="text-xs whitespace-pre-wrap break-words">{{ formatJson(row.result?.mythicPlusRecentRunsRaw ?? []) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
declare const $fetch: any

type WeeklyRun = {
  dungeon?: string
  mythic_level?: number
  completed_at?: string
  clear_time_ms?: number
  par_time_ms?: number
  num_keystone_upgrades?: number
}

type WeeklyResponse = {
  character: {
    name: string
    realm: string
    region: string
    class: string
    spec: string
    thumbnailUrl: string
  }
  weeklyKeysCompleted: number
  weeklyTenPlusCount: number
  meetsTenPlusCondition: boolean
  weeklyRuns: WeeklyRun[]
  mythicPlusRecentRunsRaw: WeeklyRun[]
  source: string
  resetAt: string
  periodEnd: string
  isSourceLimited: boolean
}

type WeeklyHistoryRecord = {
  resetAt: string
  periodEnd: string
  weeklyRuns: WeeklyRun[]
}

const WEEKLY_HISTORY_STORAGE_KEY = 'raiderio-weekly-history-v1'

type PlayerRow = {
  name: string
  realm: string
  region: 'eu' | 'us' | 'kr' | 'tw'
  loading: boolean
  error: string
  result: WeeklyResponse | null
}

const defaultPlayers: PlayerRow[] = [
  { name: 'Вайзмэнион', realm: 'Гордунни', region: 'eu', loading: false, error: '', result: null },
  { name: 'Жеймсо', realm: 'Гордунни', region: 'eu', loading: false, error: '', result: null },
  { name: 'Пожирателесс', realm: 'Гордунни', region: 'eu', loading: false, error: '', result: null },
  { name: 'Поппидрейтон', realm: 'Гордунни', region: 'eu', loading: false, error: '', result: null },
  { name: 'Мистикхирос', realm: 'Гордунни', region: 'eu', loading: false, error: '', result: null },
  { name: 'Керреть', realm: 'Гордунни', region: 'eu', loading: false, error: '', result: null },
  { name: 'Эррей', realm: 'Гордунни', region: 'eu', loading: false, error: '', result: null },
  { name: 'Авээцезарь', realm: 'Гордунни', region: 'eu', loading: false, error: '', result: null },
  { name: 'Змеявочке', realm: 'Ревущий Фьорд', region: 'eu', loading: false, error: '', result: null },
  { name: 'Каусаприма', realm: 'Гордунни', region: 'eu', loading: false, error: '', result: null },
  { name: 'Анейда', realm: 'Гордунни', region: 'eu', loading: false, error: '', result: null },
  { name: 'Фенникс', realm: 'Пиратская Бухта', region: 'eu', loading: false, error: '', result: null },
  { name: 'Мидаско', realm: 'Вечная песня', region: 'eu', loading: false, error: '', result: null },
  { name: 'Наттусик', realm: 'Свежеватель душ', region: 'eu', loading: false, error: '', result: null },
  { name: 'Чуббаака', realm: 'Гордунни', region: 'eu', loading: false, error: '', result: null },
  { name: 'Магкарок', realm: 'Ревущий Фьорд', region: 'eu', loading: false, error: '', result: null },
  { name: 'Джаная', realm: 'Гордунни', region: 'eu', loading: false, error: '', result: null },
  { name: 'Пинкфростх', realm: 'Ревущий Фьорд', region: 'eu', loading: false, error: '', result: null },
  { name: 'Несерчайн', realm: 'Гордунни', region: 'eu', loading: false, error: '', result: null },
  { name: 'Шадовгрим', realm: 'Гордунни', region: 'eu', loading: false, error: '', result: null },
  { name: 'Бумбапала', realm: 'Ревущий Фьорд', region: 'eu', loading: false, error: '', result: null },
  { name: 'Омлетко', realm: 'Ревущий Фьорд', region: 'eu', loading: false, error: '', result: null },
  { name: 'Elgwyn', realm: 'Kazzak', region: 'eu', loading: false, error: '', result: null },
].sort((a, b) => a.name.localeCompare(b.name, 'ru', { sensitivity: 'base' })) as PlayerRow[]

const players = ref<PlayerRow[]>(defaultPlayers.map((row) => ({ ...row })))
const loading = ref(false)
const error = ref('')
const expandedRow = ref<number | null>(null)
const minKeysThreshold = ref(8)
const minKeyLevelThreshold = ref(10)
const MSK_UTC_OFFSET_MS = 3 * 60 * 60 * 1000

const toMskYmd = (date: Date) => {
  const msk = new Date(date.getTime() + MSK_UTC_OFFSET_MS)
  return msk.toISOString().slice(0, 10)
}

const getDefaultPeriodFrom = () => {
  const now = new Date()
  const nowMsk = new Date(now.getTime() + MSK_UTC_OFFSET_MS)
  const startMsk = new Date(Date.UTC(
    nowMsk.getUTCFullYear(),
    nowMsk.getUTCMonth(),
    nowMsk.getUTCDate(),
    9,
    0,
    0,
    0,
  ))
  const currentMskDay = startMsk.getUTCDay()
  let diff = currentMskDay - 3
  if (diff < 0) diff += 7
  startMsk.setUTCDate(startMsk.getUTCDate() - diff)
  if (nowMsk < startMsk) {
    startMsk.setUTCDate(startMsk.getUTCDate() - 7)
  }
  return startMsk.toISOString().slice(0, 10)
}

const periodFrom = ref(getDefaultPeriodFrom())
const periodTo = ref(toMskYmd(new Date()))

const getCharacterHistoryKey = (row: PlayerRow) => {
  return `${row.region}:${row.realm.trim().toLowerCase()}:${row.name.trim().toLowerCase()}`
}

const getRunUniqueKey = (run: WeeklyRun) => {
  return [
    run.completed_at || '',
    run.dungeon || '',
    String(run.mythic_level || 0),
    String(run.clear_time_ms || 0),
  ].join('|')
}

const mergeWeeklyRuns = (currentRuns: WeeklyRun[], cachedRuns: WeeklyRun[]) => {
  const mergedMap = new Map<string, WeeklyRun>()
  for (const run of [...cachedRuns, ...currentRuns]) {
    mergedMap.set(getRunUniqueKey(run), run)
  }

  return Array.from(mergedMap.values()).sort((a, b) => {
    const aTime = new Date(a.completed_at || 0).getTime()
    const bTime = new Date(b.completed_at || 0).getTime()
    return bTime - aTime
  })
}

const readWeeklyHistory = (): Record<string, WeeklyHistoryRecord> => {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(WEEKLY_HISTORY_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, WeeklyHistoryRecord>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const writeWeeklyHistory = (history: Record<string, WeeklyHistoryRecord>) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(WEEKLY_HISTORY_STORAGE_KEY, JSON.stringify(history))
  } catch {
    // ignore localStorage quota/availability issues
  }
}

const loadOne = async (row: PlayerRow) => {
  if (!row.name.trim() || !row.realm.trim()) {
    row.result = null
    row.error = 'Заполните персонажа и реалм'
    return
  }

  row.loading = true
  row.error = ''
  try {
    const data = await $fetch('/api/raiderio/weekly-keys', {
      params: {
        region: row.region,
        realm: row.realm.trim(),
        name: row.name.trim(),
        from: periodFrom.value,
        to: periodTo.value,
      },
    }) as WeeklyResponse

    // API отдаёт ограниченный recent window, поэтому на клиенте копим runs за выбранный период
    const history = readWeeklyHistory()
    const characterKey = getCharacterHistoryKey(row)
    const cached = history[characterKey]
    const isSamePeriod = cached?.resetAt === data.resetAt && cached?.periodEnd === data.periodEnd
    const cachedRuns = isSamePeriod ? cached.weeklyRuns : []
    const periodStartMs = new Date(data.resetAt).getTime()
    const periodEndMs = new Date(data.periodEnd).getTime()
    const mergedWeeklyRuns = mergeWeeklyRuns(data.weeklyRuns, cachedRuns).filter((run) => {
      const completedAt = new Date(run.completed_at || 0).getTime()
      return completedAt >= periodStartMs && completedAt <= periodEndMs
    })
    const weeklyTenPlusCount = mergedWeeklyRuns.filter((run) => (run.mythic_level || 0) >= 10).length

    history[characterKey] = {
      resetAt: data.resetAt,
      periodEnd: data.periodEnd,
      weeklyRuns: mergedWeeklyRuns,
    }
    writeWeeklyHistory(history)

    row.result = {
      ...data,
      weeklyRuns: mergedWeeklyRuns,
      weeklyKeysCompleted: mergedWeeklyRuns.length,
      weeklyTenPlusCount,
      meetsTenPlusCondition: weeklyTenPlusCount >= 10,
    }
  } catch (err: any) {
    row.result = null
    row.error = err?.statusMessage || 'Ошибка при запросе к Raider.IO'
  } finally {
    row.loading = false
  }
}

const loadAllPlayers = async () => {
  if (!periodFrom.value || !periodTo.value) {
    error.value = 'Укажите даты начала и окончания периода'
    return
  }
  if (periodFrom.value > periodTo.value) {
    error.value = 'Дата начала не может быть позже даты окончания'
    return
  }

  loading.value = true
  error.value = ''
  try {
    await Promise.all(players.value.map((row) => loadOne(row)))
  } catch (err: any) {
    error.value = err?.message || 'Ошибка при загрузке списка персонажей'
  } finally {
    loading.value = false
  }
}

const resetPlayers = () => {
  players.value = defaultPlayers.map((row) => ({ ...row, loading: false, error: '', result: null }))
  expandedRow.value = null
  error.value = ''
}

const addPlayerRow = () => {
  players.value.push({
    name: '',
    realm: '',
    region: 'eu',
    loading: false,
    error: '',
    result: null,
  })
}

const removePlayerRow = (idx: number) => {
  if (players.value.length <= 1) return
  players.value.splice(idx, 1)
  if (expandedRow.value === idx) expandedRow.value = null
  if (expandedRow.value !== null && expandedRow.value > idx) {
    expandedRow.value = expandedRow.value - 1
  }
}

const toggleExpanded = (idx: number) => {
  expandedRow.value = expandedRow.value === idx ? null : idx
}

const getQualifiedRunsCount = (result: WeeklyResponse) => {
  return result.weeklyRuns.filter((run) => (run.mythic_level || 0) >= minKeyLevelThreshold.value).length
}

const isTimedRun = (run: WeeklyRun) => {
  if (typeof run.num_keystone_upgrades === 'number') return run.num_keystone_upgrades > 0
  if (typeof run.clear_time_ms === 'number' && typeof run.par_time_ms === 'number') {
    return run.clear_time_ms <= run.par_time_ms
  }
  return false
}

const failedPlayers = computed(() => {
  return players.value
    .filter((row) => row.result && getQualifiedRunsCount(row.result) < minKeysThreshold.value)
    .map((row) => ({
      name: row.name,
      realm: row.realm,
      qualified: row.result ? getQualifiedRunsCount(row.result) : 0,
    }))
})

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString()
}

const formatJson = (value: unknown) => JSON.stringify(value, null, 2)
</script>
