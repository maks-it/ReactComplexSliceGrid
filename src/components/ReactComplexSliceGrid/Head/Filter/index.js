import React from 'react'
import PropTypes from 'prop-types'

import TableRow from '../../TableRow'
import { HeadCell } from '../../Cells'
import SizeBox from '../../SizeBox'

// Components
import MyInput from '../../../MyInput'
import ContentEditable from '../../../ContentEditable'


import CanUseDOM from '../../../../functions/CanUseDOM'

// CSS Modulses Server Side Prerendering
const s = CanUseDOM() ? require('./scss/style.module.scss') : require('./scss/style.module.scss.json')


const Filter = (props) => {
    const { columns, emitFilter, emitGlobalFilter } = props

    return  <TableRow className={[s.tr]}>
        <HeadCell className={[s.th]} scope="col">
            <i className="fas fa-filter"></i>
        </HeadCell>

        {Object.keys(columns).map((colName, colIndex) => {
            const sizeBoxStyle = columns[colName].__style || {}

            switch (columns[colName]?.type) {
                case 'row-select':
                    return <HeadCell key={colIndex} className={[s.th]} scope="col"></HeadCell>
                default:
                    return <HeadCell key={colIndex} className={[s.thEditable]} scope="col">
                        <SizeBox disabled style={sizeBoxStyle}>
                            
                            {/*<MyInput {...{
                                name: colName,
                                //value: "", //columns[colName].filterText ? columns[colName].filterText: "",
                                onChange: emitFilter
                            }} />*/}


                            <ContentEditable {...{
                                name: colName,
                                value: columns[colName].filterText ? columns[colName].filterText: "",
                                onChange: emitFilter
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
