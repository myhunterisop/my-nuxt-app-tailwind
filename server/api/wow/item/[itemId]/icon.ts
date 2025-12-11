export default defineEventHandler(async (event) => {
  const itemId = getRouterParam(event, 'itemId')
  
  if (!itemId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Item ID is required'
    })
  }

  try {
    console.log(`Запрашиваем иконку для предмета ID: ${itemId}`)
    
    // Пробуем получить информацию о предмете через WoW API
    const response = await $fetch(`https://eu.api.blizzard.com/data/wow/item/${itemId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.BLIZZARD_ACCESS_TOKEN || 'demo'}`,
        'Battlenet-Namespace': 'static-eu'
      }
    }).catch(() => null)

    if (response && response.media && response.media.key && response.media.key.href) {
      // Получаем URL иконки
      const mediaResponse = await $fetch(response.media.key.href, {
        headers: {
          'Authorization': `Bearer ${process.env.BLIZZARD_ACCESS_TOKEN || 'demo'}`,
          'Battlenet-Namespace': 'static-eu'
        }
      }).catch(() => null)

      if (mediaResponse && mediaResponse.assets && mediaResponse.assets[0] && mediaResponse.assets[0].value) {
        return {
          success: true,
          iconUrl: mediaResponse.assets[0].value,
          itemName: response.name?.en_US || 'Unknown Item'
        }
      }
    }

    // Fallback: используем заглушку
    return {
      success: false,
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg',
      itemName: 'Unknown Item'
    }

  } catch (error) {
    console.error('Ошибка получения иконки предмета:', error)
    
    // Возвращаем заглушку в случае ошибки
    return {
      success: false,
      iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg',
      itemName: 'Unknown Item'
    }
  }
})
