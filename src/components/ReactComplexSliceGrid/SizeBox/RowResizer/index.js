import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const RowResizer = (props) => {
  const { className, ...others } = props

  useEffect(() => {

  }, [])

  return <div type="rowResizer" className={classNames(className)} {...others}
    style={{
      position: 'absolute',
      bottom: '0px',
      left: '0px',
      height: '15px',
      width: '100%',

      cursor: 'row-resize',

      //backgroundColor: 'white'
    }}
  ></div>
}

RowResizer.propTypes = {
  className: PropTypes.string
}

export default RowResizer
