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

import React, { useEffect, useState, useLayoutEffect, useRef, memo } from 'react'
import PropTypes from 'prop-types'

import Head from './Head'
import Body from './Body'

import { HScrollBar, VScrollBar } from './ScrollBars'

// Functions
import { DeepCopy } from '../../functions/Deep'

import PickObjectProps from '../../functions/PickObjectProps'

// CSS Modulses Server Side Prerendering
import s from './scss/style.module.scss'

const ComplexGrid = (props) => {
  const { caption, items, columns, onSelect, onChange } = props



  /*
  * Table has inner states to manage internal positioning and settings
  */

  // row items
  const [innerItems, _hookInnerItems] = useState([])
  const innerItemsRef = useRef(innerItems)
  const hookInnerItems = (data) => {
    innerItemsRef.current = data
    _hookInnerItems(data)
  }

  // columns
  const [innerColumns, _hookInnerColumns] = useState({})
  const innerColumnsRef = useRef(innerColumns)
  const hookInnerColumns = (data) => {
    innerColumnsRef.current = data
    _hookInnerColumns(data)
  }

  // vertical range slider value (vertical scroll bar replacement)
  const [slicer, _setSlicer] = useState(0)
  const slicerRef = useRef(slicer)
  const setSlicer = (data) => {
    slicerRef.current = data
    _setSlicer(data)
  }

  // horizontal range slider value (horizontal scroll bar replacement)
  const [hSlicer, _setHSlicer] = useState(0)
  const hSlicerRef = useRef(hSlicer)
  const setHSlicer = (data) => {
    hSlicerRef.current = data
    _setHSlicer(data)
  }

  // touch states
  const [touchState, _setTouchState] = useState({})
  const touchStateRef = useRef(touchState)
  const setTouchState = (data) => {
    touchStateRef.current = data
    _setTouchState(data)
  }


  const containerRef = useRef(null)
  const tableRef = useRef(null)
  const contextMenuRef = useRef(null)

  /*
   * Custom scroll events
   */

  // arrow keys scrolling and tabulation
  const handleKeyDown = (e) => {
    if (['ArrowDown'].includes(e.key)) {
      e.preventDefault()
      const max = innerItemsRef.current.length - 1
      setSlicer(slicerRef.current + 1 > max ? max : slicerRef.current + 1)
    }

    if (['ArrowUp'].includes(e.key)) {
      e.preventDefault()
      setSlicer(slicerRef.current - 1 < 0 ? 0 : slicerRef.current - 1)
    }

    if (['ArrowRight'].includes(e.key)) {
      e.preventDefault()
      const max = innerColumnsRef.current.length - 1
      setHSlicer(hSlicerRef.current + 1 > max ? max : hSlicerRef.current + 1)
    }

    if (['ArrowLeft'].includes(e.key)) {
      e.preventDefault()
      setHSlicer(hSlicerRef.current - 1 < 0 ? 0 : hSlicerRef.current - 1)
    }
  }

  // mouse scrolling
  const handleMouseScroll = (e) => {
    e.preventDefault()

    // https://deepmikoto.com/coding/1--javascript-detect-mouse-wheel-direction
    // e.wheelDelta (most cases) and e.detail (firefox cases)
    const delta = e.wheelDelta ? e.wheelDelta / 120 : e.detail ? -e.detail / 2 : 0

    setSlicer(slicerRef.current - delta < 0 ? 0 : slicerRef.current - delta)
  }

  /*
   * Custom touch an drag events
   */
  const handleTouchStart = (e) => {
    // var reactHandler = Object.keys(e.target).filter(key => key.indexOf('__reactEventHandlers') >= 0).map(key => e.target[key]).shift()
    // console.log(reactHandler) // React Event handler object and Properties
    // const { name } = reactHandler
    const target = e.touches ? e.touches[0].target : e.target
    console.log(target)

    const name = target.getAttribute('name')

    const newState = {
      startPosX: e.touches ? e.touches[0].screenX : e.screenX,
      startPosY: e.touches ? e.touches[0].screenY : e.screenY
    }

    if (['colResizer', 'rowResizer'].includes(name)) {
      console.log('Complex Grid: start touch cell resizing')
      newState.touchAction = name

      // newState.sizeBoxProps = DeepMerge(Object.keys(e.target.parentNode).filter(key => key.indexOf('__reactEventHandlers') >= 0).map(key => e.target.parentNode[key]).shift(), {
      //   height: e.target.parentNode.offsetHeight, // extensible problem
      //  width: e.target.parentNode.offsetWidth // extensible problem
      // })

      const sizeBox = target.parentElement
      newState.sizeBoxProps = {
        row: sizeBox.getAttribute('row'),
        name: sizeBox.getAttribute('name'),

        height: sizeBox.offsetHeight,
        width: sizeBox.offsetWidth
      }
    } else {
      console.log('Complex Grid: start touch scrolling')
      newState.touchAction = 'scrolling'
    }

    setTouchState(newState)
  }

  const handleTouchMove = (e) => {
    const mouseX = e.touches ? e.touches[0].screenX : e.screenX
    const mouseY = e.touches ? e.touches[0].screenY : e.screenY

    if (['colResizer', 'rowResizer'].includes(touchState.touchAction)) {
      console.log('Complex Grid: touch cell resizing')

      const delta = touchState.touchAction === 'colResizer' ? touchState.startPosX - mouseX : touchState.startPosY - mouseY
      const newVal = touchState.touchAction === 'colResizer' ? touchState.sizeBoxProps.width - delta : touchState.sizeBoxProps.height - delta

      if (touchState.touchAction === 'colResizer') {
        const newInnerColumns = DeepCopy(innerColumns)
        newInnerColumns[touchState.sizeBoxProps.name].__style = {
          width: newVal
        }

        hookInnerColumns(newInnerColumns)
      } else {
        const newInnerItems = DeepCopy(innerItems)
        newInnerItems[touchState.sizeBoxProps.row].__style = {
          height: newVal
        }

        hookInnerItems(newInnerItems)
      }
    }

    if (touchState.touchAction === 'scrolling') {
      console.log('Complex Grid: touch scrolling')

      // to do
      // should be calculated based on the screen resolution
      const windowHeight = window.innerHeight
      const windowWidth = window.innerWidth

      let deltaY = -(touchState.startPosY - mouseY)
      let deltaX = -(touchState.startPosX - mouseX)

      if (windowHeight > windowWidth) {
      // mobile vertical
        deltaY = Math.round(deltaY / 75)
        deltaX = Math.round(deltaX / 150)
      } else {
      // mobile horizontal
        deltaY = Math.round(deltaY / 150)
        deltaX = Math.round(deltaX / 75)
      }

      setSlicer(slicerRef.current - deltaY < 0 ? 0 : slicerRef.current - deltaY)
      setHSlicer(hSlicerRef.current - deltaX < 0 ? 0 : hSlicerRef.current - deltaX)
    }
  }

  const handleTouchEnd = () => {
    if (!touchState.touchAction) {
      return
    }

    console.log('Complex Grid: touch end')
    setTouchState({})
  }

  /*
   * Custom right click events
  */
  const handleContextMenu = (e) => {
    e.preventDefault()
    /*
    console.log(Object.keys(e).map(key => console.log(`${key}: ${e[key]}`)))

    const startPosX = e.touches ? e.touches[0].pageX : e.pageX
    const startPosY = e.touches ? e.touches[0].pageY : e.pageY

    console.log(`${startPosX} ${startPosY}`)

    contextMenuRef.current.style.position = 'absolute'
    contextMenuRef.current.style.left = `${startPosX}px`
    contextMenuRef.current.style.top = `${startPosY}px`
    */
  }

  useEffect(() => {
    /*
    * In case there are some missing parameters in var columns,
    * such values will not be rendered in head. To resolve this issue
    * items default props names should used instead
    */
    const newColumns = {}
    Object.keys([...items].shift()).map(colName => {
      newColumns[colName] = Object.keys(columns).includes(colName) ? columns[colName] : { title: colName }
    })
    hookInnerColumns(newColumns)

    // Add some event listeners
    const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'
    containerRef.current.addEventListener(wheelEvent, handleMouseScroll, false)
    // containerRef.current.addEventListener('oncontextmenu', handleContextMenu, false)

    return () => {
      containerRef.current.removeEventListener(wheelEvent, handleMouseScroll)
      // containerRef.current.removeEventListener('oncontextmenu', handleContextMenu)
    }
  }, [])

  /*
   * When items are added or deleted externally inner state should be updated.
   */
  useEffect(() => {
    if (items.length !== innerItems.length) {
      hookInnerItems(DeepCopy(items).map(item => {
        /*
         * To avoid controlled/uncontrolled warning selected prop is
         * immediatelly set to its default value
         */
        item.selected = false
        return item
      }))
    }
  }, [items])

  /*
  if (CanUseDOM()) {
    useLayoutEffect(() => {
      const theadRow =  tableRef.current.getElementsByTagName('tr')?.[0]
      const th = theadRow.getElementsByTagName('th')

      const newCols = []
      for(let i=0, len=th.length; i<len; i++) {
        console.log(th[i])
        newCols.push({
          width: th[i].offsetWidth
        })
      }

      console.log(newCols.reduce((sum, next) => sum && next.width, true))

    })
  }
*/

if (!(items.length > 0)) {
  return <div className={`${s.container}`}><div>No Data</div></div>
}


  return <div ref={containerRef} className={`${s.container}`}
    onKeyDown={handleKeyDown}

    // touch scrolling events
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}

    onMouseDown={handleTouchStart}
    onMouseMove={handleTouchMove}
    onMouseUp={handleTouchEnd}

    onContextMenu={handleContextMenu}>

    {/* Scroll Bars */}
    <VScrollBar value={slicer} min={0} max={innerItems.length - 1} step={1} onChange={(e) => {
      setSlicer(parseInt(e.target.value))
    }}/>

    <HScrollBar value={hSlicer} min={0} max={Object.keys(innerColumns).length - 1} step={1} onChange={(e) => {
      setHSlicer(parseInt(e.target.value))
    }} />

    {/* Table */}
    <table ref={tableRef} className={`${s.complexGrid}`}>
      {/* <caption>{caption}</caption> */}

      <Head {...{
        columns: PickObjectProps(innerColumns, Object.keys(innerColumns).slice(hSlicer, hSlicer + 20)),
        selected: innerItems.reduce((sum, next) => sum && next.selected, true),
        emitSlect: (selected) => {
          const newItems = DeepCopy(innerItems).map(row => {
            row.selected = selected
            return row
          })

          hookInnerItems(newItems)
          // callback
          if (onSelect && {}.toString.call(onSelect) === '[object Function]') {
            const colName = Object.keys(innerColumns).filter(colName => innerColumns[colName]?.type === 'row-select').shift()
            onSelect(newItems.filter(row => row.selected).map(row => row[colName]))
          }
        }
      }} />

      <Body {...{
        columns: PickObjectProps(innerColumns, Object.keys(innerColumns).slice(hSlicer, hSlicer + 20)),
        items: innerItems.slice(slicer, slicer + 20),
        chunk: slicer,
        emitSlect: (row) => {
          const newItems = DeepCopy(innerItems)
          newItems[row].selected = !newItems[row].selected
          hookInnerItems(newItems)

          // callback
          if (onSelect && {}.toString.call(onSelect) === '[object Function]') {
            const colName = Object.keys(innerColumns).filter(colName => innerColumns[colName]?.type === 'row-select').shift()
            onSelect(newItems.filter(row => row.selected).map(row => row[colName]))
          }
        },
        emitChange: (e, row) => {
          const { name, value } = e.target

          const newItems = DeepCopy(innerItems)
          newItems[row][name] = value
          hookInnerItems(newItems)

          // callback
          if (onChange && {}.toString.call(onChange) === '[object Function]') {
            onChange(e, row)
          }
        }
      }}/>
    </table>

    <div ref={contextMenuRef}>Context menu</div>
  </div>
}

ComplexGrid.propTypes = {
  caption: PropTypes.string,
  columns: PropTypes.object,
  items: PropTypes.array,
  onSelect: PropTypes.func,
  onChange: PropTypes.func
}

ComplexGrid.defaultProps = {
  caption: 'MAKS-IT Complex Grid',
  columns: {},
  items: [],
  onSelect: null,
  onChange: null
}

export default memo(ComplexGrid)
