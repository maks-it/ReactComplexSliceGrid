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

// Table components
import Head from './Head'
import Body from './Body'
import { HScrollBar, VScrollBar } from './ScrollBars'
import ContextMenu from './ContextMenu'

// Components
import MyInput from '../MyInput'

// Hooks
import { useLongPress } from '../../hooks'

// Functions
import { DeepCopy, DeepMerge } from '../../functions/Deep'
import CanUseDOM from '../../functions/CanUseDOM'
import PickObjectProps from '../../functions/PickObjectProps'
import { OffsetIndex } from '../../functions/Arrays'
import { IsTouchDevice2 } from '../../functions/TouchLib'
import { IsEqual, GetDelta } from '../../functions/Arrays/Delta'
import { createPortal } from 'react-dom'

// CSS Modulses Server Side Prerendering
const s = CanUseDOM() ? require('./scss/style.module.scss') : require('./scss/style.module.scss.json')

const ComplexGrid = (props) => {
  const { caption, items, maxRows, columns, onSelect, onSort, onFilter, onChange } = props

  /*
   * Refs
   *
   * Container and table Refs to attach event listeners
   */
  const containerRef = useRef(null)
  const tableRef = useRef(null)

  /*
  * States
  *
  * Table has inner states to manage internal positioning and settings
  * Resf are used eventually to access state from attached event listeners
  */

  // row items
  const [innerItems, _hookInnerItems] = useState([])
  const innerItemsRef = useRef(innerItems)
  const hookInnerItems = (data) => {
    const newData = DeepCopy(data)
    innerItemsRef.current = newData
    _hookInnerItems(newData)
  }

  // columns
  const [innerColumns, _hookInnerColumns] = useState({})
  const innerColumnsRef = useRef(innerColumns)
  const hookInnerColumns = (data) => {
    const newData = DeepCopy(data)
    innerColumnsRef.current = newData
    _hookInnerColumns(newData)
  }

  // global filter
  const [globalFilterText, _hookGlobalFilterText] = useState('')
  const globalFilterTextRef = useRef(globalFilterText)
  const hookGlobalFilterText = (data) => {
    globalFilterTextRef.current = data
    _hookGlobalFilterText(data)
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
    const newData = DeepCopy(data)
    touchStateRef.current = newData
    _setTouchState(newData)
  }

  // context menu state
  const [contextMenuState, _setContextMenuState] = useState({})
  const contectMenuStateRef = useRef(contextMenuState)
  const setContextMenuState = (data) => {
    const newData = DeepCopy(data)
    contectMenuStateRef.current = newData
    _setContextMenuState(newData)
  }

  // viewport state
  const [viewPortState, _setViewPortState] = useState({
    width: '100%',
    height: '600px'
  })
  const viewPortStateRef = useState(viewPortState)
  const setViewPortState = (data) => {
    viewPortStateRef.current = data
    _setViewPortState(data)
  }


  /*
   * Event handlers
   */

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

    if(['Tab'].includes(e.key)) {
      // e.preventDefault()
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
    if ([1, 2].includes(e.button)) {
      return
    }

    // var reactHandler = Object.keys(e.target).filter(key => key.indexOf('__reactEventHandlers') >= 0).map(key => e.target[key]).shift()
    // console.log(reactHandler) // React Event handler object and Properties
    // const { name } = reactHandler
    const target = e.touches && e.touches[0] ? e.touches[0].target : e.target
    const type = target.getAttribute('type')

    const newState = {
      startPosX: e.touches ? e.touches[0].screenX : e.screenX,
      startPosY: e.touches ? e.touches[0].screenY : e.screenY,
      startTime: new Date()
    }

    if (type) {
      newState.touchAction = type
      console.log(`Complex Grid: start touch ${type}`)
    }

    if (['colSwap', 'rowSwap'].includes(type)) {
      newState.sizeBoxProps = {
        row: parseInt(target.getAttribute('row')),
        name: target.getAttribute('name')
      }
    } else if (['colResizer', 'rowResizer'].includes(type)) {
      // newState.sizeBoxProps = DeepMerge(Object.keys(e.target.parentNode).filter(key => key.indexOf('__reactEventHandlers') >= 0).map(key => e.target.parentNode[key]).shift(), {
      //   height: e.target.parentNode.offsetHeight, // extensible problem
      //  width: e.target.parentNode.offsetWidth // extensible problem
      // })

      const sizeBox = target.parentElement
      /*
       * when sizebox has paddings offsetWidth and offsetHeight do not return its value.
       * to avoid this problem we must take computed style instead
       */
      const style = window.getComputedStyle(sizeBox, null) 

      newState.sizeBoxProps = {
        row: parseInt(sizeBox.getAttribute('row')),
        name: sizeBox.getAttribute('name'),

        height: parseInt(style.getPropertyValue("height")),
        width: parseInt(style.getPropertyValue("width"))
      }

      // console.log(newState.sizeBoxProps)
    } else {
      if (e.button === 0) {
        return
      }
      console.log('Complex Grid: start touch scrolling')
      newState.touchAction = 'scrolling'
    }

    setTouchState(newState)
  }

  const handleTouchMove = (e) => {
    e.preventDefault()

    const mouseX = e.touches ? e.touches[0].screenX : e.screenX
    const mouseY = e.touches ? e.touches[0].screenY : e.screenY

    if (touchState.touchAction) {
      console.log(`Complex Grid: touchMove ${touchState.touchAction}`)
    }

    if (['colSwap', 'rowSwap'].includes(touchState.touchAction)) {
      // todo 23092020 - Here goes code to animate row or column drag event
    } else if (['colResizer', 'rowResizer'].includes(touchState.touchAction)) {
      const delta = touchState.touchAction === 'colResizer' ? touchState.startPosX - mouseX : touchState.startPosY - mouseY
      const newVal = touchState.touchAction === 'colResizer' ? touchState.sizeBoxProps.width - delta : touchState.sizeBoxProps.height - delta
      // console.log(`${delta} - ${touchState.sizeBoxProps.width} = ${newVal}`)
      if (touchState.touchAction === 'colResizer') {
        innerColumns[touchState.sizeBoxProps.name].__style = {
          width: newVal
        }

        hookInnerColumns(innerColumns)
      } else {
        if (touchState.sizeBoxProps.row >= 0) {
          innerItems[touchState.sizeBoxProps.row].__style = {
            height: newVal
          }
  
          hookInnerItems(innerItems)
        }

      }
    } else if (touchState.touchAction) {
      // to do
      // should be calculated based on the screen resolution
      const windowHeight = window.innerHeight
      const windowWidth = window.innerWidth

      let deltaY = -(touchState.startPosY - mouseY)
      let deltaX = -(touchState.startPosX - mouseX)

      if (windowHeight > windowWidth) {
      // mobile vertical
        deltaY = Math.round(deltaY / 100)
        deltaX = Math.round(deltaX / 100)
      } else {
      // mobile horizontal
        deltaY = Math.round(deltaY / 100)
        deltaX = Math.round(deltaX / 100)
      }

      setSlicer(slicerRef.current - deltaY < 0 ? 0 : slicerRef.current - deltaY)
      setHSlicer(hSlicerRef.current - deltaX < 0 ? 0 : hSlicerRef.current - deltaX)
    }

  }

  const handleTouchEnd = (e) => {
    const mouseX = e.changedTouches ? e.changedTouches[0].clientX : e.screenX
    const mouseY = e.changedTouches ? e.changedTouches[0].clientX : e.screenY

    if (!touchState.touchAction) {
      return
    } else {
      console.log(`Complex Grid: touchEnd ${touchState.touchAction}`)
    }

    const changedTouch = e.changedTouches ? e.changedTouches[0] : null
    const target = changedTouch ? document.elementFromPoint(changedTouch.clientX, changedTouch.clientY) : e.target

    if (['colSwap'].includes(touchState.touchAction)) {
      const columns = Object.keys(innerColumns)

      const from = columns.indexOf(touchState.sizeBoxProps.name)
      const to = columns.indexOf(target.getAttribute('name'))
      console.log(`from: ${from} to: ${to}`)

      const newInnerColumns = {}
      OffsetIndex(from, to, columns).map(colName => newInnerColumns[colName] = innerColumns[colName])
      hookInnerColumns(newInnerColumns)
    }

    if (['rowSwap'].includes(touchState.touchAction)) {
      const from = touchState.sizeBoxProps.row
      const to = parseInt(target.getAttribute('row'))
      console.log(`from: ${from} to: ${to}`)

      hookInnerItems(OffsetIndex(from, to, innerItems))
    }
    
    setTouchState({})
  }

  /*
   * Custom right click events
   */
  const handleContextMenu = (e) => {
    e.preventDefault()
    // method returns the size of an element and its position relative to the viewport.
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect

    const rect = containerRef.current.getBoundingClientRect()

    setContextMenuState({
      isOpen: true,
      style: {
        left: `${e.clientX - rect.left}px`, // x position within the element.
        top: `${e.clientY - rect.top}px` // y position within the element.
      }
    })
  }

  const handleViewportResize = () => {
    console.log('CustomGrid resizing')

    const parentNode = containerRef.current.parentNode
    // console.log(parentNode.getBoundingClientRect())
    setViewPortState({
      width: `${parentNode.offsetWidth}px`,
      //height: `${parentNode.offsetHeight}px`
      height: /*`${parentNode.offsetHeight}px`*/window.innerHeight
    })
       

  }

  /*
   * Functions
   */

  /*
   * Filtering
   * Single columns filter 
   */
  const filterItems = (items, columns) => {
    const newItems = []
        
    // used for loop due to the performance reasons
    for(let i = 0, len = items.length; i < len; i++) {
      const item = items[i]
      let found = []
      let hasFilter = false

      Object.keys(columns).filter(colName => colName !=='id').forEach(colName => {
        const filterText = columns[colName].filterText
        const text = item[colName] ? item[colName].toString() : ''

        if(filterText !== '') {
          hasFilter = true

          if(text.indexOf(filterText) > -1) {
            found.push(true)
          } else {
            found.push(false)
          }
        }
      })

      if(hasFilter ? !found.includes(false) : true) {
        newItems.push(item)
      }
    }

    return newItems
  }

  /*
   * Multiple columns filter
   */
  const globalFilterItems = (items, columns, filterText) => {
    const newItems = []

    for(let i = 0, len = items.length; i < len; i++) {
      const item = items[i]
      let found = false

      if(filterText !== '') {
        Object.keys(columns).filter(colName => colName !=='id').forEach(colName => {
          if(item[colName] && item[colName].toString().includes(filterText)) {
            found = true
          }
        })
      } else {
        found = true
      }

      if(found) newItems.push(item)
    }

    return newItems
  }

  /*
   * Sorting
   * Multiple columns sorting
   */
  const sortItems = (items, columns) => {
    const criteria = []
    Object.keys(columns).forEach(colName => {
      criteria.push({
        key: colName,
        type: columns[colName].type,
        dir: columns[colName].sortDir
      })
    })

    return items.sort((a, b) => {
      const results = []

      const isNum = function(v){
        return (!isNaN(parseFloat(v)) && isFinite(v));	
      };

      /**
       * 
       * @param {*} a 
       * @param {*} b 
       * @param {number} d - direction
       */
      const sortNum = (a, b, d) => {
        a = a * 1
        b = b * 1
        if (a === b) return 0
        return a > b ? 1 * d : -1 * d;
      }

      /**
       * 
       * @param {*} a 
       * @param {*} b 
       * @param {number} d 
       */
      const sortStr = (a, b, d) => {
        a = a ? a.toString() : ''
        b = b ? b.toString() : ''
        return a.localeCompare(b) * d
      }

      for(let i = 0, len = criteria.length; i < len; i++) {
        const k = criteria[i].key
        const type = criteria[i].type
        const dir = criteria[i].dir === 'asc' ? 1 : criteria[i].dir === 'desc' ? -1 : 0
        

        switch(type) {
          case 'string':
            results.push(sortStr(a[k], b[k], dir))
          break

          case 'number':
            results.push(sortNum(a[k], b[k], dir))
          break

          case 'date-time':
            break

          default:
            break
        }
       
      }

      return results.reduce((sum, result) => sum || result, 0)
    })
  }

  /*
   * Lifecycle methods
   */

  useEffect(() => {
    /*
     * In case there are some missing parameters in var columns,
     * such values will not be rendered in head. To resolve this issue
     * items default props names should used instead.
     * We add also some internal fields used for internal functionality
     */
    const newColumns = {}
    Object.keys([...items].shift()).forEach(colName => {
      // add missing properties
      newColumns[colName] = Object.keys(columns).includes(colName) ? columns[colName] : { title: colName }

      // add internal fields
      newColumns[colName].sortDir = 'skip' // unordered
      newColumns[colName].filterText = ''
    })

    /*
     * Create internal columns state
     */
    hookInnerColumns(newColumns)

    hookInnerItems(items.map(item => {
      /*
       * To avoid controlled/uncontrolled warning selected prop is
       * immediatelly set to its default value
       */
      item.selected = false
      return item
    }))

    // Add scroll and resize event listeners
    const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'
    containerRef.current.addEventListener(wheelEvent, handleMouseScroll, false)
    window.addEventListener('resize', handleViewportResize, false)
    handleViewportResize()

    return () => {
      containerRef.current.removeEventListener(wheelEvent, handleMouseScroll)
      window.removeEventListener('resize', handleViewportResize)
    }
  }, [])

  useEffect(() => {
    if(items.length !== innerItems.length) {
      // 1.
      const globallyFilteredItems = globalFilterItems(items, innerColumns, globalFilterText)
      const filteredItems = filterItems(globallyFilteredItems, innerColumns)
      const sortedItems = sortItems(filteredItems, innerColumns)
      // 2.
      hookInnerItems(sortedItems.map(item => {
        /*
         * To avoid controlled/uncontrolled warning selected prop is
         * immediatelly set to its default value
         */
        item.selected = false
        return item
      }))
    }
  }, [items])

  if (!(items.length > 0)) {
    return <div className={`${s.container}`}><div>No Data</div></div>
  }

  /*
   * Implementation
   */
  return <div ref={containerRef} className={`${s.container}`} style={viewPortState}
    /*onKeyDown={handleKeyDown}*/

    // touch scrolling events

    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}

    onMouseDown={handleTouchStart}
    onMouseMove={handleTouchMove}
    onMouseUp={handleTouchEnd}
    

    onContextMenu={handleContextMenu}>

    {/* Scroll Bars */}
    {!IsTouchDevice2() ? <>
    <VScrollBar style={{
      width: viewPortState.height
    }} value={slicer} min={0} max={innerItems.length - 1} step={1} onChange={(e) => {
      setSlicer(parseInt(e.target.value))
    }}/> 

    <HScrollBar value={hSlicer} min={0} max={Object.keys(innerColumns).length - 1} step={1} onChange={(e) => {
      setHSlicer(parseInt(e.target.value))
    }} /></> : ''}

    {/* Table */}
    <table ref={tableRef} className={`${s.complexGrid}`}>
      {/* <caption>{caption}</caption> */}

      <Head {...{
        columns: PickObjectProps(innerColumns, Object.keys(innerColumns).slice(hSlicer, hSlicer + 20)),
        selected: innerItems.length > 0 ? innerItems.reduce((sum, next) => sum && next.selected, true) : false,
        emitSlect: (selected) => {
          const newItems = innerItems.map(row => {
            row.selected = selected
            return row
          })

          // 1. callback
          if (onSelect && {}.toString.call(onSelect) === '[object Function]') {
            const colName = Object.keys(innerColumns).filter(colName => innerColumns[colName]?.type === 'row-select').shift()
            onSelect(newItems.filter(row => row.selected).map(row => row[colName]))
          }

          // 2. internal
          hookInnerItems(newItems)
        },
        emitSort: (colName) => {
          let sortDir = innerColumns[colName].sortDir
          switch (sortDir) {
            case 'asc':
              sortDir = 'desc'
              break
            case 'desc':
              sortDir = 'skip'
              break
            default:
              sortDir = 'asc'
          }
          innerColumns[colName].sortDir = sortDir

          const globalFilteredItems = globalFilterItems(innerItems, innerColumns, globalFilterText)
          const filteredItems = filterItems(globalFilteredItems, innerColumns)
          const sortedItems = sortItems(filteredItems, innerColumns)

          if (onSort && {}.toString.call(onSort) === '[object Function]') {
            onSort(colName)
          }

          hookInnerItems(sortedItems)          
          hookInnerColumns(innerColumns)
        },
        emitFilter: (e) => {
          const { name, value } = e.target

          innerColumns[name].filterText = value

          const globalFilteredItems = globalFilterItems(items, innerColumns, globalFilterText)
          const filteredItems = filterItems(globalFilteredItems, innerColumns)
          const sortedItems = sortItems(filteredItems, innerColumns)

          // 1. callback
          if (onFilter && {}.toString.call(onFilter) === '[object Function]') {
            onFilter(e)
          }

          // 2. internal
          hookInnerItems(sortedItems)
          hookInnerColumns(innerColumns)
        },
        emitGlobalFilter: (e) => {
          const { value } = e.target

          const globallyFilteredItems = globalFilterItems(items, innerColumns, value)
          const filteredItems = filterItems(globallyFilteredItems, innerColumns)
          const sortedItems = sortItems(filteredItems, innerColumns)

          // 1. callback

          // 2. internal
          hookGlobalFilterText(value)
          hookInnerItems(sortedItems)
        }
      }} />

      <Body {...{
        columns: PickObjectProps(innerColumns, Object.keys(innerColumns).slice(hSlicer, hSlicer + 20)),
        items: innerItems.slice(slicer, slicer + maxRows),
        chunk: slicer,
        emitSlect: (id) => {
          for (let i = 0, len = innerItems.length; i < len; i++) {
            if (innerItems[i].id === id) {
              innerItems[i].selected = !innerItems[i].selected
              break
            }
          }

          // 1. callback
          if (onSelect && {}.toString.call(onSelect) === '[object Function]') {
            const colName = Object.keys(innerColumns).filter(colName => innerColumns[colName]?.type === 'row-select').shift()
            onSelect(innerItems.filter(row => row.selected).map(row => row[colName]))
          }

          // 2. internal
          hookInnerItems(innerItems)
        },
        emitChange: (e, id) => {
          const { name, value } = e.target

          // update internal state

          for (let i = 0, len = innerItems.length; i < len; i++) {
            if(innerItems[i].id === id) {
              innerItems[i][name] = value
              break
            }
          }

          // 1. callback update parent state
          if (onChange && {}.toString.call(onChange) === '[object Function]') {
            onChange(e, id)
          }

          // 2. internal
          hookInnerItems(innerItems)
        }
      }} />
    </table>
    <ContextMenu {...{
      isOpen: contextMenuState.isOpen,
      style: contextMenuState.style,
      onClose: () => {
        contextMenuState.isOpen = false
        setContextMenuState(contextMenuState)
      }
    }} />
  </div>
}

ComplexGrid.propTypes = {
  caption: PropTypes.string,
  columns: PropTypes.object,
  items: PropTypes.array,
  maxRows: PropTypes.number,
  onSelect: PropTypes.func,
  onSort: PropTypes.func,
  onFilter: PropTypes.func,
  onChange: PropTypes.func
}

ComplexGrid.defaultProps = {
  caption: 'MAKS-IT Complex Grid',
  columns: {},
  items: [],
  maxRows: 20,
  onSelect: null,
  onChange: null
}

export default memo(ComplexGrid)
