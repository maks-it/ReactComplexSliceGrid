import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const ColResizer = (props) => {
  const { className, ...others } = props

  return <div type="colResizer" className={classNames(className)} {...others}
    style={{
      position: 'absolute',
      right: '0px',
      top: '0px',

      height: '100%',
      width: '25px',

      cursor: 'col-resize',
      zIndex: 1
    }}
  ></div>
}

ColResizer.propTypes = {
  className: PropTypes.string
}

export default ColResizer
