/**
 * @license
 * Internet Systems Consortium license
 *
 * Copyright (c) 2020 Maksym Sadovnychyy (MAKS-IT)
 * Website: https://maks-it.com
 * Email: commercial@maks-it.com
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
 * THIS SOFTWARE.
 */

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

