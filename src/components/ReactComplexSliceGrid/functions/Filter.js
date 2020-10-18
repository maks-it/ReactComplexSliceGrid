
/**
 * Filtering
 * Single columns filter 
 */
const FilterItems = (items, columns) => {
    const newItems = []
        
    // used for loop due to the performance reasons
    for(let i = 0, len = items.length; i < len; i++) {
        const item = items[i]
        let found = []
        let hasFilter = false

        Object.keys(columns).filter(colName => colName !=='id').forEach(colName => {
        const filterText = columns[colName].filterText.toLowerCase()
        const text = item[colName] ? item[colName].toString().toLowerCase() : ''

        if(filterText !== '') {
            hasFilter = true

            if(text.indexOf(filterText) > -1) {
            found.push(true)
            } else {
            found.push(false)
            }
        }
        })

        if(hasFilter ? !found.includes(false) : true) {
        newItems.push(item)
        }
    }

    return newItems
}

/**
 * Multiple columns filter
 */
const GlobalFilterItems = (items, columns, filterText) => {
  filterText = filterText.toLowerCase()
  const newItems = []

  for(let i = 0, len = items.length; i < len; i++) {
    const item = items[i]
    let found = false

    if(filterText !== '') {
      Object.keys(columns).filter(colName => colName !=='id').forEach(colName => {
        const text = item[colName] ? item[colName].toString().toLowerCase() : ''
        if(text.indexOf(filterText) > -1) {
          found = true
        }
      })
    } else {
      found = true
    }

    if(found) newItems.push(item)
  }

  return newItems
}

export {
    FilterItems,
    GlobalFilterItems
}

