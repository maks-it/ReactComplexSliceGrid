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

import React, { useState } from 'react'
import PropTypes from 'prop-types'

import TableRow from '../TableRow'
import { HeadCell } from '../Cells'
import SizeBox from '../SizeBox'
import Filter from './Filter'
import GlobalFilter from './GlobalFilter'

import SortIndicator from './SortIndicator'

import CanUseDOM from '../../../functions/CanUseDOM'


// CSS Modulses Server Side Prerendering
const s = CanUseDOM() ? require('./scss/style.module.scss') : require('./scss/style.module.scss.json')

const Head = (props) => {
  const { globalFilterText, columns, selected, emitSlect, emitSort, emitFilter, emitGlobalFilter } = props

  const[showFilters, toggleShowFilters] = useState(false)

  return <thead className={s.thead}>
    <GlobalFilter {...{
      s: s,
      showFilters: showFilters,
      columns: columns,
      globalFilterText: globalFilterText,
      emitGlobalFilter: emitGlobalFilter
    }} />

    <TableRow className={[s.tr, s.show]}>
      <HeadCell className={[s.th]} scope="col"
        emitDoubleCLick={() => toggleShowFilters(!showFilters)}>
        <SizeBox disabled>#</SizeBox>
      </HeadCell>

      {Object.keys(columns).map((colName, index) => {
        const sizeBoxStyle = columns[colName].__style || {}
        // if (Object.keys(sizeBoxStyle).length !== 0 ) console.log(sizeBoxStyle)

        switch (columns[colName]?.dataType) {
          case 'row-select':
            return <HeadCell key={index} className={[s.th]} scope="col">
              <SizeBox disabled>
                <input type="checkbox" checked={selected} onChange={() => emitSlect(!selected)} />
              </SizeBox>
            </HeadCell>
          default:
            return <HeadCell key={index} className={[s.th]} scope="col" emitDoubleCLick={() => {
              emitSort(colName)
            }}>
              <SizeBox row={-1} name={colName} rowDisabled style={sizeBoxStyle} type="colSwap">
                {columns[colName].title} <SortIndicator {...{
                  sortDir: columns[colName].sortDir
                }} />
              </SizeBox>
            </HeadCell>
        }
      })}
    </TableRow>

    <Filter {...{
      s: s,
      showFilters: showFilters,
      columns: columns,
      emitFilter: emitFilter
    }} />

    
  </thead>
}

Head.propTypes = {
  columns: PropTypes.object,
  selected: PropTypes.bool,
  emitSlect: PropTypes.func,
  emitSort: PropTypes.func,
  emitFilter: PropTypes.func,
  emitGlobalFilter: PropTypes.func
}

Head.defaultProps = {
  columns: {},
  selected: false,
  emitSlect: null,
  emitSort: null,
  emitFilter: null,
  emitGlobalFilter: null
}

export default Head
