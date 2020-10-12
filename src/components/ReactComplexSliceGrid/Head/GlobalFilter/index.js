import React from 'react'
import PropTypes from 'prop-types'

import TableRow from '../../TableRow'
import { HeadCell } from '../../Cells'
import SizeBox from '../../SizeBox'
import MyInput from '../../../MyInput'

import CanUseDOM from '../../../../functions/CanUseDOM'

// CSS Modulses Server Side Prerendering
const s = CanUseDOM() ? require('./scss/style.module.scss') : require('./scss/style.module.scss.json')

const GlobalFilter = (props) => {
    const { columns, emitGlobalFilter } = props

    return <TableRow className={[s.tr]}>
        <HeadCell className={[s.th]}><i className="fas fa-search"></i></HeadCell>
       
        <HeadCell colSpan={Object.keys(columns).length } className={[s.th]}>
            <SizeBox disabled style={null}>
                <MyInput {...{
                    name: "globalFilter",
                    //value: "",
                    onChange: emitGlobalFilter
                }} />
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


