import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// Functions
import CanUseDOM from '../../../functions/CanUseDOM'

// CSS Modulses Server Side Prerendering
const s = CanUseDOM() ? require('./scss/style.module.scss') : require('./scss/style.module.scss.json')

const ContextMenu = (props) => {
  const { isOpen, className, onClose, ...others } = props

  const contextMenuRef = useRef(null)

  const emitClose = (e) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
      if (onClose && {}.toString.call(onClose) === '[object Function]') {
        onClose()
      }
    }
  }
  useEffect(() => {
    window.addEventListener('mousedown', emitClose, false)

    return () => {
      window.removeEventListener('mousedown', emitClose)
    }
  }, [])

  return <div ref={contextMenuRef} className={classNames(s.cmContainer, isOpen ? s.show : {})} {...others}>
    <ul className={classNames(s.ul, s.themeDefault)}>
      <li className={s.li}><i className="fas fa-copy"></i> Copy</li>
      <li className={s.li}><i class="fas fa-paste"></i> Paste</li>
      <li className={s.divider}></li>
      <li className={s.li}><i className="fas fa-undo"></i> Size Restore</li>
      <li className={s.divider}></li>
      <li className={s.li}><i className="fas fa-columns"></i> Remove Column</li>
      <li className={s.li}><i className="fas fa-grip-lines"></i> Remove Row</li>
      <li className={s.divider}></li>
      <li className={s.li}><i className="fas fa-file-csv"></i> Export to CSV</li>
      <li className={s.li}><i className="fas fa-file-excel"></i> Export to Excel</li>
    </ul>

  </div>
}

ContextMenu.propTypes = {
  isOpen: PropTypes.bool,
  className: PropTypes.array,
  onClose: PropTypes.func
}

export default ContextMenu
