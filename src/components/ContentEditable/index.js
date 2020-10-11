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

import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import EditCaretPositioning from '../../functions/EditCaretPositioning'


const ContentEditable = (props) => {
  const { name, value, className, mode, onChange, ...others } = props

  const divRef = useRef(null)

  const [carretPosition, setCarretPosition] = useState(0)
  const [isEditable, setEditable] = useState(mode === 'enabled' ? true : false)

  // proxy handler
  const emitChange = () => {
    const { innerHTML } = divRef.current

    if (onChange && {}.toString.call(onChange) === '[object Function]') {
      // reassign target value
      onChange({
        target: {
          name: name,
          value: innerHTML
        }
      })
    }

    // set internal component state
    setCarretPosition(EditCaretPositioning.saveSelection(divRef.current))
    // console.log(divRef.current)
  }

  /*
  useEffect(() => {

  }, [carretPosition])
  */

  return <div ref={divRef} {...others} className={classNames(className)}
    onInput={emitChange}
    onBlur={() => {
      // Execute a JavaScript when a user leaves an input field
    }}
    onKeyUp={() => {
      EditCaretPositioning.restoreSelection(divRef.current, carretPosition)
    }}

    contentEditable
    dangerouslySetInnerHTML={{ __html: value }}
      /*onDoubleClick={mode === 'auto' ? () => setEditable(true) : null }
      onMouseLeave={mode === 'auto' ? () => setEditable(false) : null } */>
  </div>
}

ContentEditable.defaultProps = {
  value: "",
  mode: 'enabled' // 'disabled' || 'auto'
}

ContentEditable.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  className: PropTypes.array,
  mode: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

export default ContentEditable
