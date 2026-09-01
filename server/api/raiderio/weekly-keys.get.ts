import type { H3Event } from 'h3'

interface RaiderRun {
  completed_at?: string
  dungeon?: string
  mythic_level?: number
  clear_time_ms?: number
  par_time_ms?: number
  num_keystone_upgrades?: number
}

interface RaiderProfileResponse {
  name?: string
  race?: string
  class?: string
  active_spec_name?: string
  thumbnail_url?: string
  realm?: string
  region?: string
  mythic_plus_recent_runs?: RaiderRun[]
  mythic_plus_weekly_highest_level_runs?: RaiderRun[]
  mythic_plus_previous_weekly_highest_level_runs?: RaiderRun[]
  mythic_plus_highest_level_runs?: RaiderRun[]
  mythic_plus_best_runs?: RaiderRun[]
}

interface WeeklyKeysResponse {
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
  weeklyRuns: RaiderRun[]
  mythicPlusRecentRunsRaw: RaiderRun[]
  source: string
  resetAt: string
  periodEnd: string
  isSourceLimited: boolean
}

const MSK_UTC_OFFSET_HOURS = 3
const WEDNESDAY = 3

function getPeriodStartFromLastWednesdayMsk(): Date {
  const now = new Date()
  const nowMsk = new Date(now.getTime() + MSK_UTC_OFFSET_HOURS * 60 * 60 * 1000)
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
  let diff = currentMskDay - WEDNESDAY
  if (diff < 0) diff += 7
  startMsk.setUTCDate(startMsk.getUTCDate() - diff)

  if (nowMsk < startMsk) {
    startMsk.setUTCDate(startMsk.getUTCDate() - 7)
  }

  return new Date(startMsk.getTime() - MSK_UTC_OFFSET_HOURS * 60 * 60 * 1000)
}

function parseYmd(value: string): { year: number, month: number, day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const probe = new Date(Date.UTC(year, month - 1, day))
  if (
    probe.getUTCFullYear() !== year
    || probe.getUTCMonth() !== month - 1
    || probe.getUTCDate() !== day
  ) {
    return null
  }
  return { year, month, day }
}

function mskDayStartUtc(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0) - MSK_UTC_OFFSET_HOURS * 60 * 60 * 1000)
}

function mskDayEndUtc(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999) - MSK_UTC_OFFSET_HOURS * 60 * 60 * 1000)
}

function getRunUniqueKey(run: RaiderRun) {
  return [
    run.completed_at || '',
    run.dungeon || '',
    String(run.mythic_level || 0),
    String(run.clear_time_ms || 0),
  ].join('|')
}

function mergeUniqueRuns(...lists: Array<RaiderRun[] | undefined>): RaiderRun[] {
  const merged = new Map<string, RaiderRun>()
  for (const list of lists) {
    for (const run of list ?? []) {
      merged.set(getRunUniqueKey(run), run)
    }
  }
  return Array.from(merged.values())
}

declare const $fetch: any

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event)
  const region = String(query.region || 'eu').toLowerCase()
  const realm = String(query.realm || '').trim()
  const name = String(query.name || '').trim()
  const fromRaw = String(query.from || '').trim()
  const toRaw = String(query.to || '').trim()

  if (!realm || !name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Параметры realm и name обязательны',
    })
  }

  const fromParts = fromRaw ? parseYmd(fromRaw) : null
  const toParts = toRaw ? parseYmd(toRaw) : null
  if (fromRaw && !fromParts) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректная дата начала (from)' })
  }
  if (toRaw && !toParts) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректная дата окончания (to)' })
  }

  const resetAt = fromParts
    ? mskDayStartUtc(fromParts.year, fromParts.month, fromParts.day)
    : getPeriodStartFromLastWednesdayMsk()
  const periodEnd = toParts
    ? mskDayEndUtc(toParts.year, toParts.month, toParts.day)
    : new Date()

  if (resetAt.getTime() > periodEnd.getTime()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Дата начала не может быть позже даты окончания',
    })
  }

  const fields = [
    'mythic_plus_recent_runs',
    'mythic_plus_weekly_highest_level_runs',
    'mythic_plus_previous_weekly_highest_level_runs',
    'mythic_plus_highest_level_runs',
    'mythic_plus_best_runs',
  ].join(',')
  const accessKey = process.env.RAIDER_IO_API_KEY?.trim()
  const endpoint = new URL('https://raider.io/api/v1/characters/profile')
  endpoint.searchParams.set('region', region)
  endpoint.searchParams.set('realm', realm)
  endpoint.searchParams.set('name', name)
  endpoint.searchParams.set('fields', fields)
  if (accessKey) endpoint.searchParams.set('access_key', accessKey)

  try {
    const profile = await $fetch(endpoint.toString(), {
      headers: {
        'User-Agent': 'MyNuxtApp/1.0 (+https://raider.io/api)',
      },
    }) as RaiderProfileResponse

    const recentRuns = profile.mythic_plus_recent_runs ?? []
    const knownRuns = mergeUniqueRuns(
      recentRuns,
      profile.mythic_plus_weekly_highest_level_runs,
      profile.mythic_plus_previous_weekly_highest_level_runs,
      profile.mythic_plus_highest_level_runs,
      profile.mythic_plus_best_runs,
    )
    const recentThisWeek = knownRuns.filter((run: RaiderRun) => {
      if (!run.completed_at) return false
      const completedAt = new Date(run.completed_at)
      return !Number.isNaN(completedAt.getTime()) && completedAt >= resetAt && completedAt <= periodEnd
    })

    const sortedWeeklyRecentRuns = recentThisWeek
      .slice()
      .sort((a: RaiderRun, b: RaiderRun) => {
        const aTime = new Date(a.completed_at || 0).getTime()
        const bTime = new Date(b.completed_at || 0).getTime()
        return bTime - aTime
      })

    const weeklyRuns = sortedWeeklyRecentRuns
    const weeklyTenPlusCount = recentThisWeek.filter((run: RaiderRun) => (run.mythic_level || 0) >= 10).length
    const meetsTenPlusCondition = weeklyTenPlusCount >= 10

    const response: WeeklyKeysResponse = {
      character: {
        name: profile.name ?? name,
        realm: profile.realm ?? realm,
        region: profile.region ?? region,
        class: profile.class ?? '',
        spec: profile.active_spec_name ?? '',
        thumbnailUrl: profile.thumbnail_url ?? '',
      },
      weeklyKeysCompleted: weeklyRuns.length,
      weeklyTenPlusCount,
      meetsTenPlusCondition,
      weeklyRuns,
      mythicPlusRecentRunsRaw: knownRuns,
      source: 'raiderio_merged_run_fields',
      resetAt: resetAt.toISOString(),
      periodEnd: periodEnd.toISOString(),
      // у каждого поля Raider.IO потолок ~10 забегов, полного лога API не отдаёт
      isSourceLimited: true,
    }
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 502,
      statusMessage: error?.statusMessage || 'Не удалось получить данные Raider.IO',
    })
  }
})
