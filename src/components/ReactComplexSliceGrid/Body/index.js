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
import { HeadCell, BodyCell } from '../Cells'
import SizeBox from '../SizeBox'

// Components
import ContentEditable from '../../ContentEditable'

import { DeepMerge } from '../../../functions/Deep'


// CSS Modulses Server Side Prerendering
import s from './scss/style.module.scss'

const Body = (props) => {
  const { columns, items, chunk, emitSlect, emitChange } = props

  return <tbody className={s.tbody}>
    {items.map((row, rowIndex) => {
      rowIndex = rowIndex + chunk
      return <TableRow key={rowIndex} tabIndex={rowIndex} className={[s.tr]}>

        <HeadCell scope="row" className={[s.th]}>
          <SizeBox disabled>
            {rowIndex + 1}
          </SizeBox>
        </HeadCell>

        {Object.keys(row).filter(colName => Object.keys(columns).includes(colName)).map((colName, colIndex) => {
          const sizeBoxStyle = DeepMerge(columns[colName].__style || {}, row.__style || {})
          // console.log(sizeBoxStyle)

          switch (columns[colName]?.type) {
            case 'row-select':
              return <BodyCell key={colIndex} tabIndex={colIndex} className={[s.td]}>
                <SizeBox disabled>
                  <input type="checkbox" checked={row.selected} onChange={() => emitSlect(rowIndex)}/>
                </SizeBox>
              </BodyCell>

            case 'image':
              return <BodyCell key={colIndex} tabIndex={colIndex} className={[s.td]}>
                <SizeBox disabled>
                  <img src={row[colName]} className="img-fluid img-thumbnail" />
                </SizeBox>
              </BodyCell>

            case 'editable':
              return <BodyCell key={colIndex} tabIndex={colIndex} className={[s.td]}>
                <SizeBox row={rowIndex} name={colName} style={sizeBoxStyle}>
                  <ContentEditable style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  name={colName} value={row[colName]} onChange={(e) => emitChange(e, rowIndex)}/>
                </SizeBox>
              </BodyCell>

            default:
              return <BodyCell key={colIndex} tabIndex={colIndex} className={[s.td]}>
                <SizeBox row={rowIndex} name={colName} style={sizeBoxStyle}>
                  {row[colName]}
                </SizeBox>
              </BodyCell>
          }
        })}
      </TableRow>
    })}
  </tbody>
}

Body.propTypes = {
  columns: PropTypes.object,
  items: PropTypes.array,
  chunk: PropTypes.number,
  emitSlect: PropTypes.func,
  emitChange: PropTypes.func
}

Body.defaultProps = {
  columns: {},
  items: [],
  chunk: 0,
  emitSelect: null,
  emitChange: null
}

export default Body
