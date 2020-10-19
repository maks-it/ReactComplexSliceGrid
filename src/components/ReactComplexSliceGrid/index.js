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

import React, { useEffect, useState, useRef, memo, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

// Table components
import Head from './Head'
import Body from './Body'
import { HScrollBar, VScrollBar } from './ScrollBars'
import ContextMenu from './ContextMenu'


// Functions
import {
  FilterItems,GlobalFilterItems,
  SortItems,
  FocusTabIndex, OffsetArrayIndex,
  DeepCopy,
  CanUseDOM,
  PickObjectProps
} from './functions'

// CSS Modulses Server Side Prerendering
const s = CanUseDOM() ? require('./scss/style.module.scss') : require('./scss/style.module.scss.json')

const ComplexGrid = (props) => {
  const { caption, items, maxRows, maxCols, columns, onSelect, onSort, onFilter, onGlobalFilter, onChange } = props

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
  const [vSlicer, _setVSlicer] = useState(0)
  const vSlicerRef = useRef(vSlicer)
  const setVSlicer = (data) => {
    vSlicerRef.current = data
    _setVSlicer(data)
  }

  // horizontal range slider value (horizontal scroll bar replacement)
  const [hSlicer, _setHSlicer] = useState(0)
  const hSlicerRef = useRef(hSlicer)
  const setHSlicer = (data) => {
    hSlicerRef.current = data
    _setHSlicer(data)
  }

  // tabindex state
  const [tabIndexState, _setTabIndexState] = useState(null)
  const tabIndexStateRef = useRef(tabIndexState)
  const setTabIndexState = (data) => {
    tabIndexStateRef.current = data
    _setTabIndexState(data)
  }
 
  // tabindex error count state
  const [tabIndexErrorCount, _setTabIndexErrorCount] = useState(0)
  const tabIndexErrorCountRef = useRef(tabIndexErrorCount)
  const setTabIndexErrorCount = (data) => {
    tabIndexErrorCountRef.current = data
    _setTabIndexErrorCount(data)
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
    const { key, target } = e

    /*
    if (['ArrowDown'].includes(key)) {
      e.preventDefault()
      const max = innerItemsRef.current.length - 1
      setSlicer(vSlicerRef.current + 1 > max ? max : vSlicerRef.current + 1)
    }

    if (['ArrowUp'].includes(key)) {
      e.preventDefault()
      setSlicer(vSlicerRef.current - 1 < 0 ? 0 : vSlicerRef.current - 1)
    }

    if (['ArrowRight'].includes(key)) {
      e.preventDefault()
      const max = innerColumnsRef.current.length - 1
      setHSlicer(hSlicerRef.current + 1 > max ? max : hSlicerRef.current + 1)
    }

    if (['ArrowLeft'].includes(key)) {
      e.preventDefault()
      setHSlicer(hSlicerRef.current - 1 < 0 ? 0 : hSlicerRef.current - 1)
    }
    */

    if(['Tab'].includes(key)) {
      e.preventDefault()

      const tabIndex  = +(target.getAttribute('tabindex')) + 1

      setTabIndexState({
        tabIndex: tabIndex,
        trigger: tabIndexState ? !tabIndexState.trigger : true,

         // workaround for jumping scroll when focusing checkbox on a new line
        x: window.scrollX,
        y: window.scrollY
      })
      

      
    }
  }

  // Mouse wheel scrolling
  const handleMouseScroll = (e) => {
    e.preventDefault()

    // https://deepmikoto.com/coding/1--javascript-detect-mouse-wheel-direction
    // e.wheelDelta (most cases) and e.detail (firefox cases)
    const delta = e.wheelDelta ? e.wheelDelta / 120 : e.detail ? -e.detail / 2 : 0

    setVSlicer(vSlicerRef.current - delta < 0 ? 0
      : vSlicerRef.current - delta < innerItemsRef.current.length
      ? vSlicerRef.current - delta : innerItemsRef.current.length - 1 )
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
    const inputType = target.getAttribute('type')

    const newState = {
      startPosX: e.touches ? e.touches[0].screenX : e.screenX,
      startPosY: e.touches ? e.touches[0].screenY : e.screenY,
      startTime: new Date()
    }

    if (inputType) {
      newState.touchAction = inputType
      console.log(`Complex Grid: start touch ${inputType}`)
    }

    if (['colSwap', 'rowSwap'].includes(inputType)) {
      newState.sizeBoxProps = {
        row: parseInt(target.getAttribute('row')),
        name: target.getAttribute('name')
      }
    } else if (['colResizer', 'rowResizer'].includes(inputType)) {
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
        const rect = containerRef.current.getBoundingClientRect()
        if(rect.right - 50 > mouseX) {
          innerColumns[touchState.sizeBoxProps.name].__style = {
            width: newVal
          }
  
          hookInnerColumns(innerColumns)
        }


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
      
      setVSlicer(vSlicerRef.current - deltaY < 0 ? 0
        : vSlicerRef.current - deltaY < innerItemsRef.current.length
        ? vSlicerRef.current - deltaY : innerItemsRef.current.length - 1)
      
      setHSlicer(hSlicerRef.current - deltaX < 0 ? 0
        : hSlicerRef.current - deltaX < Object.keys(innerColumnsRef.current).length
        ? hSlicerRef.current - deltaX : Object.keys(innerColumnsRef.current).length - 1)
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
      OffsetArrayIndex(from, to, columns).map(colName => newInnerColumns[colName] = innerColumns[colName])
      hookInnerColumns(newInnerColumns)
    }

    if (['rowSwap'].includes(touchState.touchAction)) {
      const from = touchState.sizeBoxProps.row
      const to = parseInt(target.getAttribute('row'))
      console.log(`from: ${from} to: ${to}`)

      hookInnerItems(OffsetArrayIndex(from, to, innerItems))
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

    //const tableOverflow = tableRect - containerRect
    //console.log(tableOverflow)

    const containerWidth = containerRef.current.offsetWidth
    console.log(containerWidth)
    const tableWidth = tableRef.current.scrollWidth
    console.log(tableWidth)

    setViewPortState({
      width: `${parentNode.offsetWidth}px`,
      height: `${parentNode.offsetHeight}px`,
      tableOverflow:  containerWidth - tableWidth < 0 ? Math.abs(containerWidth - tableWidth) + 50 : 0
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

    return () => {
      containerRef.current.removeEventListener(wheelEvent, handleMouseScroll)
      window.removeEventListener('resize', handleViewportResize)
    }
  }, [])

  useEffect(() => {
    if(items.length !== innerItems.length) {
      // 1.
      const globallyFilteredItems = GlobalFilterItems(items, innerColumns, globalFilterText)
      const filteredItems = FilterItems(globallyFilteredItems, innerColumns)
      const sortedItems = SortItems(filteredItems, innerColumns)
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

  /*
   * Custom cells tab lifecycle methods
   */
  useEffect(() => {
    if (tabIndexState) {
      // 1. CELLS TAB
      const tabIndex = tabIndexState.tabIndex

      if (tabIndex < innerItems.length * Object.keys(innerColumns).length) {
        if (FocusTabIndex(containerRef.current, tabIndex)) {
          // element is found without slicing the table, so tabIndexState isn't necessary anymore
          setTabIndexState(null)
        } else {
         /*
          * element isn't available in DOM or viewport, we move the table by changing hSlice state (+1 or +2)
          * and trigg useEffect(() => {}, [hSlice]) as consequence, where we will try to search tabIndex again
          * NOTE: we must have tabIndexState !== null to enter this method
          */
         setHSlicer(hSlicer + 1)
        }
      }
    }
  }, [tabIndexState])

  useEffect(() => {
    if (tabIndexState) {
      // 2. CELLS TAB
      const tabIndex = tabIndexState?.tabIndex

      if (tabIndex < innerItems.length * Object.keys(innerColumns).length) {

        if (FocusTabIndex(containerRef.current, tabIndex)) {
          setTabIndexState(null)
          setTabIndexErrorCount(0)
        } else {

          switch(tabIndexErrorCount) {
            case 1:
              setHSlicer(0) // second pass on same state will be ignored
            break

            case 2:
             /*
              * element isn't available in DOM, we move the table by changing vSlice state (+1) to perform Line Feed
              * and trig useEffect(() => [vSlice]) as consequence, where we will trig Carriage Return
              * which will cause this method to run once agin
              * NOTE: we must have tabIndexState !== null to enter this method
              */
              setVSlicer(vSlicer + 1) // on the second consequtive error go to new line, bypass other events
            break

            default: 
              setHSlicer(hSlicer + 1)
            break
          }

          setTabIndexErrorCount(tabIndexErrorCount + 1)
        }
      }
    }

  }, [hSlicer])

  useEffect(() => {
    if (tabIndexState) {
      // 3. CELLS TAB
      const tabIndex = tabIndexState?.tabIndex

      if (tabIndex < innerItems.length * Object.keys(innerColumns).length) {
        FocusTabIndex(containerRef.current, tabIndex)
      }

      // workaround for jumping scroll when focusing checkbox on a new line
      window.scrollTo(tabIndexState.x, tabIndexState.y);

      setTabIndexState(null)
      setTabIndexErrorCount(0)
    }
  }, [vSlicer])


  useLayoutEffect(() => {
    console.log('dddd')
    handleViewportResize()
  }, [innerItems, touchState])

  if (!(items.length > 0)) {
    return <div className={`${s.container}`}><div>No Data</div></div>
  }

  /*
   * Implementation
   */
  return <div {...{
    ref: containerRef,
    className: s.container,
    style: viewPortState,

    onKeyDown: handleKeyDown,

    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,

    onMouseDown: handleTouchStart,
    onMouseMove: handleTouchMove,
    onMouseUp: handleTouchEnd,

    /* onContextMenu: handleContextMenu*/
  }}>

    {/* Scroll Bars */}
    <VScrollBar style={{
      width: viewPortState.height
    }} value={vSlicer} min={0} max={innerItems.length - 1} step={1} onChange={(e) => {
      setVSlicer(parseInt(e.target.value))
    }}/> 

    <HScrollBar value={hSlicer} min={0} max={Object.keys(innerColumns).length - 1} step={1} onChange={(e) => {
      setHSlicer(parseInt(e.target.value))
    }} />

    {/* Table */}
    <table ref={tableRef} className={`${s.complexGrid}`}>
      {/* <caption>{caption}</caption> */}

      <Head {...{
        globalFilterText: globalFilterText,
        columns: PickObjectProps(innerColumns, Object.keys(innerColumns).slice(hSlicer, hSlicer + maxCols)),
        selected: innerItems.length > 0 ? innerItems.reduce((sum, next) => sum && next.selected, true) : false,
        tableOverflow: viewPortState.tableOverflow,
        emitSlect: (selected) => {
          const newItems = innerItems.map(row => {
            row.selected = selected
            return row
          })

          // 1. callback
          if (onSelect && {}.toString.call(onSelect) === '[object Function]') {
            const colName = Object.keys(innerColumns).filter(colName => innerColumns[colName]?.dataType === 'row-select').shift()
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

          const globalFilteredItems = GlobalFilterItems(innerItems, innerColumns, globalFilterText)
          const filteredItems = FilterItems(globalFilteredItems, innerColumns)
          const sortedItems = SortItems(filteredItems, innerColumns)

          if (onSort && {}.toString.call(onSort) === '[object Function]') {
            onSort(colName)
          }

          hookInnerItems(sortedItems)          
          hookInnerColumns(innerColumns)
        },
        emitFilter: (e) => {
          const { name, value } = e.target

          innerColumns[name].filterText = value

          const globalFilteredItems = GlobalFilterItems(items, innerColumns, globalFilterText)
          const filteredItems = FilterItems(globalFilteredItems, innerColumns)
          const sortedItems = SortItems(filteredItems, innerColumns)

          // 1. callback
          if (onFilter && {}.toString.call(onFilter) === '[object Function]') {
            onFilter(e)
          }

          // 2. internal
          hookInnerItems(sortedItems)
          hookInnerColumns(innerColumns)
          // setSlicer(0)
        },
        emitGlobalFilter: (e) => {
          const { value } = e.target

          const globallyFilteredItems = GlobalFilterItems(items, innerColumns, value)
          const filteredItems = FilterItems(globallyFilteredItems, innerColumns)
          const sortedItems = SortItems(filteredItems, innerColumns)

          // 1. callback
          if (onGlobalFilter && {}.toString.call(onGlobalFilter) === '[object Function]') {
            onGlobalFilter(e)
          }
          // 2. internal
          hookGlobalFilterText(value)
          hookInnerItems(sortedItems)
          // setSlicer(0)
        }
      }} />

      <Body {...{
        columns: innerColumns, //PickObjectProps(innerColumns, Object.keys(innerColumns).slice(hSlicer, hSlicer + 20)),
        items: innerItems, //innerItems.slice(vSlicer, vSlicer + maxRows),
        vSlicer: vSlicer,
        hSlicer: hSlicer,
        maxCols: maxCols,
        maxRows: maxRows,
        
        emitSlect: (id) => {
          for (let i = 0, len = innerItems.length; i < len; i++) {
            if (innerItems[i].id === id) {
              innerItems[i].selected = !innerItems[i].selected
              break
            }
          }

          // 1. callback
          if (onSelect && {}.toString.call(onSelect) === '[object Function]') {
            const colName = Object.keys(innerColumns).filter(colName => innerColumns[colName]?.dataType === 'row-select').shift()
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
  maxCols: PropTypes.number,
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
  maxCols: 20,
  onSelect: null,
  onChange: null
}

export default memo(ComplexGrid)
