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
 * Sorting
 * Multiple columns sorting
 */
const SortItems = (items, columns) => {
    const criteria = []
    Object.keys(columns).forEach(colName => {
        criteria.push({
        key: colName,
        dataType: columns[colName].dataType,
        dir: columns[colName].sortDir
        })
    })

    return items.sort((a, b) => {
        /**
         * 
         * @param {*} v 
         */
        const isNum = function(v){
        return (!isNaN(parseFloat(v)) && isFinite(v));	
        };

        /**
         * 
         * @param {*} a 
         * @param {*} b 
         * @param {number} d - direction
         */
        const sortNum = (a, b, d) => {
        a = a * 1
        b = b * 1

        if (a === b) return 0
        return a > b ? 1 * d : -1 * d;
        }

        /**
         * 
         * @param {*} a 
         * @param {*} b 
         * @param {number} d 
         */
        const sortStr = (a, b, d) => {
        a = a ? a.toString() : ''
        b = b ? b.toString() : ''

        return a.localeCompare(b) * d
        }
        
        const results = []
        
        for(let i = 0, len = criteria.length; i < len; i++) {
        const k = criteria[i].key
        const dataType = criteria[i].dataType
        const dir = criteria[i].dir === 'asc' ? 1 : criteria[i].dir === 'desc' ? -1 : 0
        
        switch(dataType) {
            case 'string':
            results.push(sortStr(a[k], b[k], dir))
            break

            case 'number':
            results.push(sortNum(a[k], b[k], dir))
            break

            case 'date-time':
            break

            default:
            break
        } 
        }

        return results.reduce((sum, result) => sum || result, 0)
    })
}

export {
    SortItems
}