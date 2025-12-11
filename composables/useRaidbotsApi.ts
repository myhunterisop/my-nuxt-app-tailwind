interface RaidbotsReport {
  id: string
  status: string
  data?: any
}

interface DropOptimizerItem {
  itemId: number
  itemName: string
  upgradePercent: number
  characterName: string
  characterClass: string
  characterSpec: string
  bossName?: string
}

interface ItemPriority {
  itemId: number
  itemName: string
  candidates: {
    characterName: string
    characterClass: string
    characterSpec: string
    upgradePercent: number
  }[]
}

// Импортируем $fetch для TypeScript
declare const $fetch: any

export const useRaidbotsApi = () => {
  const config = useRuntimeConfig()
  
  // Функция для рекурсивного поиска данных об апгрейдах
  const findUpgradesRecursively = (obj: any, path: string = ''): any[] => {
    const upgrades: any[] = []
    
    if (typeof obj !== 'object' || obj === null) {
      return upgrades
    }
    
    // Если это массив апгрейдов
    if (Array.isArray(obj) && obj.length > 0 && obj[0] && (obj[0].itemId || obj[0].itemName || obj[0].upgradePercent)) {
      console.log(`Найдены апгрейды в ${path}:`, obj)
      return obj
    }
    
    // Рекурсивно ищем в объекте
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newPath = path ? `${path}.${key}` : key
        const result = findUpgradesRecursively(obj[key], newPath)
        if (result.length > 0) {
          upgrades.push(...result)
        }
      }
    }
    
    return upgrades
  }
  
  // Получение отчета по ID через наш серверный endpoint
  const getReport = async (reportId: string): Promise<any> => {
    try {
      console.log(`Загружаем отчет: ${reportId}`)
      const response = await $fetch(`/api/raidbots/${reportId}`)
      console.log('Ответ отчета:', response)
      return response
    } catch (error) {
      console.error('Ошибка при получении отчета:', error)
      throw error
    }
  }

  // Получение данных DropOptimizer из JSON отчета
  const getDropOptimizerData = async (reportId: string): Promise<DropOptimizerItem[]> => {
    try {
      const report = await getReport(reportId)
      
      // Парсим данные и извлекаем информацию о предметах
      const items: DropOptimizerItem[] = []
      
      console.log('Анализируем структуру отчета:', report)
      console.log('Доступные ключи в отчете:', Object.keys(report || {}))
      
      // Ищем данные DropOptimizer в JSON отчете
      if (report && report.sim && report.sim.profiles) {
        console.log('Найдены профили в отчете')
        
        // Проходим по всем профилям (персонажам)
        Object.keys(report.sim.profiles).forEach((profileName: string) => {
          const profile = report.sim.profiles[profileName]
          console.log(`Обрабатываем профиль: ${profileName}`, profile)
          
          // Ищем данные об апгрейдах предметов
          if (profile && profile.gear && profile.gear.upgrades) {
            console.log(`Найдены апгрейды для ${profileName}:`, profile.gear.upgrades)
            
            profile.gear.upgrades.forEach((upgrade: any) => {
              const item = {
                itemId: upgrade.itemId || upgrade.id || 0,
                itemName: upgrade.itemName || upgrade.name || 'Unknown Item',
                upgradePercent: upgrade.upgradePercent || upgrade.upgrade || 0,
                characterName: profileName,
                characterClass: profile.class || 'Unknown',
                characterSpec: profile.spec || 'Unknown',
                bossName: upgrade.bossName || upgrade.boss || 'Unknown'
              }
              items.push(item)
              console.log('Добавлен предмет:', item)
            })
          } else {
            console.log(`У профиля ${profileName} нет данных об апгрейдах`)
          }
        })
      } else {
        console.log('Структура отчета не содержит ожидаемых данных')
        console.log('Доступные ключи:', Object.keys(report || {}))
        
        // Попробуем альтернативные пути поиска данных
        if (report && report.profiles) {
          console.log('Найдены профили в корне отчета')
          Object.keys(report.profiles).forEach((profileName: string) => {
            const profile = report.profiles[profileName]
            console.log(`Обрабатываем профиль: ${profileName}`, profile)
            
            // Ищем апгрейды в разных местах
            if (profile && profile.upgrades) {
              console.log(`Найдены апгрейды для ${profileName}:`, profile.upgrades)
              profile.upgrades.forEach((upgrade: any) => {
                const item = {
                  itemId: upgrade.itemId || upgrade.id || 0,
                  itemName: upgrade.itemName || upgrade.name || 'Unknown Item',
                  upgradePercent: upgrade.upgradePercent || upgrade.upgrade || 0,
                  characterName: profileName,
                  characterClass: profile.class || 'Unknown',
                  characterSpec: profile.spec || 'Unknown',
                  bossName: upgrade.bossName || upgrade.boss || 'Unknown'
                }
                items.push(item)
                console.log('Добавлен предмет:', item)
              })
            }
          })
        }
        
        // Попробуем найти данные в других местах
        if (report && report.characters) {
          console.log('Найдены персонажи в отчете')
          Object.keys(report.characters).forEach((charName: string) => {
            const character = report.characters[charName]
            console.log(`Обрабатываем персонажа: ${charName}`, character)
            
            if (character && character.upgrades) {
              console.log(`Найдены апгрейды для ${charName}:`, character.upgrades)
              character.upgrades.forEach((upgrade: any) => {
                const item = {
                  itemId: upgrade.itemId || upgrade.id || 0,
                  itemName: upgrade.itemName || upgrade.name || 'Unknown Item',
                  upgradePercent: upgrade.upgradePercent || upgrade.upgrade || 0,
                  characterName: charName,
                  characterClass: character.class || 'Unknown',
                  characterSpec: character.spec || 'Unknown',
                  bossName: upgrade.bossName || upgrade.boss || 'Unknown'
                }
                items.push(item)
                console.log('Добавлен предмет:', item)
              })
            }
          })
        }
        
        // Если ничего не найдено, попробуем рекурсивный поиск
        if (items.length === 0) {
          console.log('Пробуем рекурсивный поиск апгрейдов...')
          const foundUpgrades = findUpgradesRecursively(report)
          console.log('Найдено апгрейдов рекурсивно:', foundUpgrades.length)
          
          foundUpgrades.forEach((upgrade: any, index: number) => {
            const item = {
              itemId: upgrade.itemId || upgrade.id || index,
              itemName: upgrade.itemName || upgrade.name || 'Unknown Item',
              upgradePercent: upgrade.upgradePercent || upgrade.upgrade || 0,
              characterName: upgrade.characterName || 'Unknown',
              characterClass: upgrade.class || 'Unknown',
              characterSpec: upgrade.spec || 'Unknown',
              bossName: upgrade.bossName || upgrade.boss || 'Unknown'
            }
            items.push(item)
            console.log('Добавлен предмет из рекурсивного поиска:', item)
          })
        }
      }

      console.log(`Найдено предметов для отчета ${reportId}: ${items.length}`)
      return items
    } catch (error) {
      console.error('Ошибка при получении данных DropOptimizer:', error)
      throw error
    }
  }

  // Создание таблицы приоритетов для конкретного предмета
  const createItemPriorityTable = async (reportIds: string[], itemId?: number): Promise<ItemPriority[]> => {
    try {
      const allItems: DropOptimizerItem[] = []
      
      // Получаем данные из всех отчетов
      for (const reportId of reportIds) {
        const items = await getDropOptimizerData(reportId)
        allItems.push(...items)
      }

      // Группируем предметы по ID
      const itemGroups = new Map<number, DropOptimizerItem[]>()
      
      allItems.forEach(item => {
        if (!itemGroups.has(item.itemId)) {
          itemGroups.set(item.itemId, [])
        }
        itemGroups.get(item.itemId)!.push(item)
      })

      // Создаем таблицу приоритетов
      const priorities: ItemPriority[] = []
      
      itemGroups.forEach((items, itemId) => {
        // Фильтруем по конкретному предмету, если указан
        if (itemId && items[0].itemId !== itemId) {
          return
        }

        // Сортируем кандидатов по убыванию апгрейда
        const sortedCandidates = items
          .sort((a, b) => b.upgradePercent - a.upgradePercent)
          .map(item => ({
            characterName: item.characterName,
            characterClass: item.characterClass,
            characterSpec: item.characterSpec,
            upgradePercent: item.upgradePercent
          }))

        priorities.push({
          itemId: items[0].itemId,
          itemName: items[0].itemName,
          candidates: sortedCandidates
        })
      })

      return priorities
    } catch (error) {
      console.error('Ошибка при создании таблицы приоритетов:', error)
      throw error
    }
  }

  // Получение всех предметов с приоритетами
  const getAllItemPriorities = async (reportIds: string[]): Promise<ItemPriority[]> => {
    return await createItemPriorityTable(reportIds)
  }

  // Получение приоритетов для конкретного предмета
  const getItemPriority = async (reportIds: string[], itemId: number): Promise<ItemPriority | null> => {
    const priorities = await createItemPriorityTable(reportIds, itemId)
    return priorities.length > 0 ? priorities[0] : null
  }

  // Экспорт данных в CSV
  const exportToCSV = (priorities: ItemPriority[]): string => {
    const headers = ['Предмет', 'Кандидат', 'Класс', 'Специализация', 'Апгрейд (%)', 'Приоритет']
    const rows: string[] = []

    priorities.forEach(priority => {
      priority.candidates.forEach((candidate, index) => {
        rows.push([
          priority.itemName,
          candidate.characterName,
          candidate.characterClass,
          candidate.characterSpec,
          candidate.upgradePercent.toFixed(1),
          index + 1
        ].join(','))
      })
    })

    return [headers.join(','), ...rows].join('\n')
  }

  return {
    getReport,
    getDropOptimizerData,
    createItemPriorityTable,
    getAllItemPriorities,
    getItemPriority,
    exportToCSV
  }
}
