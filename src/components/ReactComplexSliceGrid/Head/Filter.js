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
