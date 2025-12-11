interface BossSummaryItem {
  bossName: string
  itemIcons: string[]
  upgradePercentages: number[]
  expectedValue: string
  bestValue: string
  priority: string
}

interface BossSummaryTable {
  bossName: string
  items: BossSummaryItem[]
}

// Импортируем $fetch для TypeScript
declare const $fetch: any

export const useBossSummaryParser = () => {
  
  // Получение HTML страницы отчета
  const getReportHtml = async (reportId: string): Promise<string> => {
    try {
      console.log(`Загружаем HTML страницу отчета: ${reportId}`)
      const response = await $fetch(`/api/raidbots/${reportId}`)
      console.log('Получен HTML ответ')
      
      // Сохраняем HTML в консоль для анализа
      console.log('=== HTML СОДЕРЖИМОЕ ===')
      console.log('Первые 2000 символов HTML:', response.substring(0, 2000))
      console.log('Последние 1000 символов HTML:', response.substring(response.length - 1000))
      console.log('=== КОНЕЦ HTML ===')
      
      return response
    } catch (error) {
      console.error('Ошибка при получении HTML отчета:', error)
      throw error
    }
  }

  // Поиск таблицы Boss Summary в HTML
  const findBossSummaryTable = (html: string): any[] => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      
      console.log('Ищем таблицу Boss Summary...')
      console.log('Длина HTML:', html.length)
      
      // Ищем заголовок "BOSS SUMMARY"
      const bossSummaryHeader = doc.querySelector('*:contains("BOSS SUMMARY")') || 
                               Array.from(doc.querySelectorAll('*')).find(el => 
                                 el.textContent?.includes('BOSS SUMMARY'))
      
      if (bossSummaryHeader) {
        console.log('Найден заголовок BOSS SUMMARY:', bossSummaryHeader)
        
        // Ищем родительский контейнер
        let container = bossSummaryHeader
        for (let i = 0; i < 5; i++) {
          container = container.parentElement
          if (!container) break
          
          console.log(`Родительский элемент ${i}:`, {
            tagName: container.tagName,
            className: container.className,
            textLength: container.textContent?.length || 0
          })
        }
        
        if (container) {
          return [{
            selector: 'boss-summary-container',
            index: 0,
            text: container.textContent?.substring(0, 500) || '',
            html: container.outerHTML?.substring(0, 1000) || '',
            attributes: Object.fromEntries(
              Array.from(container.attributes).map(attr => [attr.name, attr.value])
            ),
            tagName: container.tagName,
            className: container.className
          }]
        }
      }
      
      // Альтернативный поиск по ключевым словам
      const keywords = ['BOSS SUMMARY', 'Expected Value', 'Best', 'Priority', 'DPS']
      const elements = doc.querySelectorAll('*')
      
      for (const element of elements) {
        const text = element.textContent || ''
        if (keywords.every(keyword => text.includes(keyword))) {
          console.log('Найден элемент с ключевыми словами:', element)
          return [{
            selector: 'keyword-match',
            index: 0,
            text: text.substring(0, 500),
            html: element.outerHTML?.substring(0, 1000) || '',
            attributes: Object.fromEntries(
              Array.from(element.attributes).map(attr => [attr.name, attr.value])
            ),
            tagName: element.tagName,
            className: element.className
          }]
        }
      }
      
      console.log('Boss Summary не найден')
      return []
    } catch (error) {
      console.error('Ошибка при поиске таблицы Boss Summary:', error)
      return []
    }
  }

  // Парсинг данных из таблицы Boss Summary
  const parseBossSummaryData = (html: string): BossSummaryItem[] => {
    const bossSummary: BossSummaryItem[] = []
    
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      
      console.log('Парсим данные Boss Summary...')
      
      // Ищем строки с боссами
      const bossRows = doc.querySelectorAll('*')
      const bossNames = [
        'Plexus Sentinel', 'Loom\'ithar', 'Soulbinder Naazindhri', 
        'Forgeweaver Araz', 'The Soul Hunters', 'Fractillus',
        'Nexus-King Salhadaar', 'Dimensius, the All-Devouring', 'Trash Drop'
      ]
      
      bossNames.forEach(bossName => {
        const bossElement = Array.from(bossRows).find(el => 
          el.textContent?.includes(bossName))
        
        if (bossElement) {
          console.log(`Найден босс: ${bossName}`)
          
          // Ищем проценты в этой строке
          const percentages = []
          const text = bossElement.textContent || ''
          const percentMatches = text.match(/-?\d+\.?\d*%/g) || []
          
          percentMatches.forEach(match => {
            const percent = parseFloat(match.replace('%', ''))
            percentages.push(percent)
          })
          
          // Ищем значения DPS
          const dpsMatches = text.match(/\+?\d+(\s\d+)*\sDPS/g) || []
          const expectedValue = dpsMatches[0] || '0 DPS'
          const bestValue = dpsMatches[1] || '0 DPS'
          
          // Ищем приоритет
          const priorityMatch = text.match(/Priority[:\s]*(\d+)/i) || 
                              text.match(/(\d+)(?=\s*$)/)
          const priority = priorityMatch ? priorityMatch[1] : '-'
          
          bossSummary.push({
            bossName,
            itemIcons: [], // Иконки предметов сложно извлечь из HTML
            upgradePercentages: percentages,
            expectedValue,
            bestValue,
            priority
          })
          
          console.log(`Добавлен босс ${bossName}:`, {
            percentages,
            expectedValue,
            bestValue,
            priority
          })
        }
      })
      
      console.log(`Парсинг завершен. Найдено боссов: ${bossSummary.length}`)
      return bossSummary
      
    } catch (error) {
      console.error('Ошибка при парсинге данных Boss Summary:', error)
      return bossSummary
    }
  }

  // Получение данных Boss Summary из отчета
  const getBossSummaryData = async (reportId: string): Promise<BossSummaryItem[]> => {
    try {
      const html = await getReportHtml(reportId)
      return parseBossSummaryData(html)
    } catch (error) {
      console.error('Ошибка при получении данных Boss Summary:', error)
      throw error
    }
  }

  // Создание таблицы приоритетов по предметам
  const createItemPriorityTable = (bossSummary: BossSummaryItem[]): any[] => {
    const itemPriorities: any[] = []
    
    // Группируем все предметы по имени
    const itemGroups = new Map<string, any[]>()
    
    bossSummary.forEach(boss => {
      boss.upgradePercentages.forEach((percent, index) => {
        const itemKey = `Item_${index}`
        if (!itemGroups.has(itemKey)) {
          itemGroups.set(itemKey, [])
        }
        itemGroups.get(itemKey)!.push({
          bossName: boss.bossName,
          upgradePercent: percent,
          expectedValue: boss.expectedValue,
          bestValue: boss.bestValue,
          priority: boss.priority
        })
      })
    })
    
    // Создаем таблицу приоритетов
    itemGroups.forEach((items, itemKey) => {
      const sortedItems = items.sort((a, b) => b.upgradePercent - a.upgradePercent)
      
      itemPriorities.push({
        itemName: itemKey,
        candidates: sortedItems.map(item => ({
          bossName: item.bossName,
          upgradePercent: item.upgradePercent,
          expectedValue: item.expectedValue,
          bestValue: item.bestValue,
          priority: item.priority
        }))
      })
    })
    
    return itemPriorities
  }

  return {
    getReportHtml,
    findBossSummaryTable,
    parseBossSummaryData,
    getBossSummaryData,
    createItemPriorityTable
  }
}
