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

import React from 'react'
import PropTypes from 'prop-types'

import TableRow from '../TableRow'
import { HeadCell } from '../Cells'
import SizeBox from '../SizeBox'

import CanUseDOM from '../../../functions/CanUseDOM'

// CSS Modulses Server Side Prerendering
const s = CanUseDOM() ? require('./scss/style.module.scss') : require('./scss/style.module.scss.json')

const Head = (props) => {
  const { columns, selected, emitSlect } = props

  return <thead className={s.thead}>
    <TableRow className={[s.tr]}>

      <HeadCell className={[s.th]} scope="col"><SizeBox disabled>#</SizeBox></HeadCell>

      {Object.keys(columns).map((colName, index) => {
        const sizeBoxStyle = columns[colName].__style || {}
        // if (Object.keys(sizeBoxStyle).length !== 0 ) console.log(sizeBoxStyle)

        switch (columns[colName]?.type) {
          case 'row-select':
            return <HeadCell key={index} className={[s.th]} scope="col">
              <SizeBox disabled>
                <input type="checkbox" checked={selected} onChange={() => emitSlect(!selected)} />
              </SizeBox>
            </HeadCell>
          default:
            return <HeadCell key={index} className={[s.th]} scope="col">
              <SizeBox row={-1} name={colName} style={sizeBoxStyle} type="colSwap">
                {columns[colName].title}
              </SizeBox>
            </HeadCell>
        }
      })}
    </TableRow>
  </thead>
}

Head.propTypes = {
  columns: PropTypes.object,
  selected: PropTypes.bool,
  emitSlect: PropTypes.func
}

Head.defaultProps = {
  columns: {},
  selected: false,
  emitSlect: null
}

export default Head