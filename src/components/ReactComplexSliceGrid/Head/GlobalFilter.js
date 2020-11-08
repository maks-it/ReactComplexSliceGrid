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

// React
import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

// Table components
import TableRow from '../TableRow'
import { HeadCell } from '../Cells'
import SizeBox from '../SizeBox'

// Components
import ContentEditable from '../ContentEditable'

const GlobalFilter = (props) => {
    const { s, tableOverflow, showFilters, columns, globalFilterText, emitGlobalFilter } = props



    return <TableRow className={[s.tr, showFilters ? s.show : null]}>
        <HeadCell className={[s.th]}><i className="fas fa-search"></i></HeadCell>
       
        <HeadCell colSpan={Object.keys(columns).length } className={[s.thEditable]}>
            <SizeBox disabled style={{
                width: `calc(100% - ${tableOverflow}px)`
            }}>
                <ContentEditable {...{
                    type: 'globalFilter',
                    name: "globalFilter",
                    value: globalFilterText,
                    onChange: emitGlobalFilter
                    // onLeave: (e) => console.log(e)
                }}/>
            </SizeBox>
        </HeadCell>
    </TableRow>
}

GlobalFilter.propTypes = {
    emitGlobalFilter: PropTypes.func,

}

GlobalFilter.defeultProps = {
    columns: {},
    emitFilter: null
}

export default GlobalFilter


