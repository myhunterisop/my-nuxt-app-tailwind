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

declare const $fetch: any

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event)
  const region = String(query.region || 'eu').toLowerCase()
  const realm = String(query.realm || '').trim()
  const name = String(query.name || '').trim()

  if (!realm || !name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Параметры realm и name обязательны',
    })
  }

  const fields = 'mythic_plus_recent_runs,mythic_plus_weekly_highest_level_runs'
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

    const resetAt = getPeriodStartFromLastWednesdayMsk()
    const now = new Date()
    const recentRuns = profile.mythic_plus_recent_runs ?? []
    const recentThisWeek = recentRuns.filter((run: RaiderRun) => {
      if (!run.completed_at) return false
      const completedAt = new Date(run.completed_at)
      return !Number.isNaN(completedAt.getTime()) && completedAt >= resetAt && completedAt <= now
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
      mythicPlusRecentRunsRaw: recentRuns,
      source: 'mythic_plus_recent_runs',
      resetAt: resetAt.toISOString(),
      // mythic_plus_recent_runs у Raider.IO отдаёт только ограниченное окно recent-раннов
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
