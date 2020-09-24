/**
 * https://stackoverflow.com/questions/48048957/react-long-press-event
 * 
 * import React, { useState } from "react";
import "./styles.css";
import useLongPress from "./useLongPress";

export default function App() {
  const [longPressCount, setlongPressCount] = useState(0)
  const [clickCount, setClickCount] = useState(0)

  const onLongPress = () => {
    console.log('longpress is triggered');
    setlongPressCount(longPressCount + 1)
  };

  const onClick = () => {
    console.log('click is triggered')
    setClickCount(clickCount + 1)
  }

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  return (
    <div className="App">
      <button {...longPressEvent}>use  Loooong  Press</button>
      <span>Long press count: {longPressCount}</span>
      <span>Click count: {clickCount}</span>
    </div>
  );
}

 */

import { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'

const useLongPress = (props) => {
  const { onLongPress, onClick, shouldPreventDefault, delay } = props

  const [longPressTriggered, setLongPressTriggered] = useState(false)
  const timeout = useRef()
  const target = useRef()

  const start = useCallback(e => {
      if (shouldPreventDefault && e.target) {
        e.target.addEventListener('touchend', preventDefault, {
          passive: false
        })
        target.current = e.target
      }
      timeout.current = setTimeout(() => {
        onLongPress(e)
        setLongPressTriggered(true)
      }, delay)
    },
    [onLongPress, delay, shouldPreventDefault]
  )

  const clear = useCallback((e, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current)
      shouldTriggerClick && !longPressTriggered && onClick()
      setLongPressTriggered(false)
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', preventDefault)
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered]
  )

  return {
    onMouseDown: e => start(e),
    onTouchStart: e => start(e),
    onMouseUp: e => clear(e),
    onMouseLeave: e => clear(e, false),
    onTouchEnd: e => clear(e)
  }
}

const isTouchEvent = (e) => {
  return 'touches' in e
}

const preventDefault = (e) => {
  if (!isTouchEvent(e)) return

  if (e.touches.length < 2 && e.preventDefault) {
    e.preventDefault()
  }
}

useLongPress.propTypes = {
  onLongPress: PropTypes.func,
  onClick: PropTypes.func,
  shouldPreventDefault: PropTypes.bool,
  delay: PropTypes.number
}

useLongPress.defaultProps = {
  onLongPress: null,
  onClick: null,
  shouldPreventDefault: true,
  delay: 300
}

export default useLongPress
