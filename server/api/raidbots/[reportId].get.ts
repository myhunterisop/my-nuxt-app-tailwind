export default defineEventHandler(async (event) => {
  const reportId = getRouterParam(event, 'reportId')
  
  if (!reportId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Report ID is required'
    })
  }

  try {
    console.log(`Проксируем запрос к Raidbots для отчета: ${reportId}`)
    
    const response = await $fetch(`https://www.raidbots.com/simbot/report/${reportId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    console.log('Получен HTML ответ от Raidbots')
    return response
  } catch (error) {
    console.error('Ошибка при получении данных от Raidbots:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch report data: ${error.message}`
    })
  }
})
