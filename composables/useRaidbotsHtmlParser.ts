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

export const useRaidbotsHtmlParser = () => {
  
  // Получение HTML страницы отчета
  const getReportHtml = async (reportId: string): Promise<string> => {
    try {
      console.log(`Загружаем HTML страницу отчета: ${reportId}`)
      const response = await $fetch(`/api/raidbots/${reportId}`)
      console.log('Получен HTML ответ')
      return response
    } catch (error) {
      console.error('Ошибка при получении HTML отчета:', error)
      throw error
    }
  }

  // Парсинг HTML с помощью DOM API (работает только в браузере)
  const parseHtmlReport = (html: string): DropOptimizerItem[] => {
    const items: DropOptimizerItem[] = []
    
    try {
      // Создаем DOM parser
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      
      console.log('HTML документ загружен, начинаем парсинг...')
      
      // Здесь будем искать нужные блоки
      // Пока что возвращаем пустой массив, пока вы не укажете конкретные селекторы
      
      return items
    } catch (error) {
      console.error('Ошибка при парсинге HTML:', error)
      return items
    }
  }

  // Функция для поиска элементов по CSS селекторам
  const findElementsBySelector = (html: string, selector: string): any[] => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const elements = doc.querySelectorAll(selector)
      
      console.log(`Найдено элементов по селектору "${selector}": ${elements.length}`)
      
      return Array.from(elements).map(el => ({
        text: el.textContent?.trim(),
        html: el.innerHTML,
        attributes: Object.fromEntries(
          Array.from(el.attributes).map(attr => [attr.name, attr.value])
        )
      }))
    } catch (error) {
      console.error(`Ошибка при поиске элементов по селектору "${selector}":`, error)
      return []
    }
  }

  // Функция для извлечения данных из конкретных блоков
  const extractDataFromBlocks = (html: string, selectors: string[]): any => {
    const result: any = {}
    
    selectors.forEach(selector => {
      const elements = findElementsBySelector(html, selector)
      result[selector] = elements
    })
    
    return result
  }

  // Получение данных DropOptimizer из HTML отчета
  const getDropOptimizerData = async (reportId: string): Promise<DropOptimizerItem[]> => {
    try {
      const html = await getReportHtml(reportId)
      
      // Пока что возвращаем пустой массив
      // Здесь будет логика парсинга после того, как вы укажете нужные селекторы
      console.log('HTML получен, готов к парсингу по указанным селекторам')
      
      return []
    } catch (error) {
      console.error('Ошибка при получении данных DropOptimizer:', error)
      throw error
    }
  }

  // Создание таблицы приоритетов
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
    getReportHtml,
    parseHtmlReport,
    findElementsBySelector,
    extractDataFromBlocks,
    getDropOptimizerData,
    createItemPriorityTable,
    getAllItemPriorities,
    exportToCSV
  }
}
