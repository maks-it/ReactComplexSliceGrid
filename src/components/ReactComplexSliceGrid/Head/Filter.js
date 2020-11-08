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

// Components
import ContentEditable from '../ContentEditable'

const Filter = (props) => {
    const { s, showFilters, columns, emitFilter } = props

    return  <TableRow className={[s.tr, showFilters ? s.show : null]}>
        <HeadCell className={[s.th]} scope="col">
            <i className="fas fa-filter"></i>
        </HeadCell>

        {Object.keys(columns).map((colName, colIndex) => {
            const sizeBoxStyle = columns[colName].__style || {}

            switch (columns[colName]?.dataType) {
                case 'row-select':
                    return <HeadCell key={colIndex} className={[s.th]} scope="col"></HeadCell>
                default:
                    return <HeadCell key={colIndex} className={[s.thEditable]} scope="col">
                        <SizeBox disabled style={sizeBoxStyle}>
                            <ContentEditable {...{
                                type: 'filter',
                                name: colName,
                                value: columns[colName].filterText ? columns[colName].filterText: "",
                                onChange: emitFilter
                                // onLeave: (e) => console.log(e)
                            }} />
                        </SizeBox>
                    </HeadCell>
            }
        })}
    </TableRow>
}



Filter.propTypes = {
    emitFilter: PropTypes.func,

}

Filter.defeultProps = {
    columns: {},
    emitFilter: null
}

export default Filter
