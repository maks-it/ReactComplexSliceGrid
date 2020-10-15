// React
import React from 'react'
import PropTypes from 'prop-types'

// Table components
import TableRow from '../TableRow'
import { HeadCell } from '../Cells'
import SizeBox from '../SizeBox'

// Components
import ContentEditable from '../../ContentEditable'

const GlobalFilter = (props) => {
    const { s, showFilters, columns, globalFilterText, emitGlobalFilter } = props

    return <TableRow className={[s.tr, showFilters ? s.show : null]}>
        <HeadCell className={[s.th]}><i className="fas fa-search"></i></HeadCell>
       
        <HeadCell colSpan={Object.keys(columns).length } className={[s.thEditable]}>
            <SizeBox disabled style={null}>
                <ContentEditable {...{
                    type: 'filter',
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


