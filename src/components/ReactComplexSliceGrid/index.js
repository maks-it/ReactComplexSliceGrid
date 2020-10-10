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

import React, { useEffect, useState, useLayoutEffect, useRef, memo, cloneElement } from 'react'
import PropTypes from 'prop-types'

// Table components
import Head from './Head'
import Body from './Body'
import { HScrollBar, VScrollBar } from './ScrollBars'
import ContextMenu from './ContextMenu'

// Components
import ContentEditable from '../ContentEditable'

// Hooks
import { useLongPress } from '../../hooks'

// Functions
import { DeepCopy, DeepMerge } from '../../functions/Deep'
import CanUseDOM from '../../functions/CanUseDOM'
import PickObjectProps from '../../functions/PickObjectProps'
import { OffsetIndex } from '../../functions/Arrays'
import { IsTouchDevice2 } from '../../functions/TouchLib'

// CSS Modulses Server Side Prerendering
const s = CanUseDOM() ? require('./scss/style.module.scss') : require('./scss/style.module.scss.json')

const ComplexGrid = (props) => {
  const { caption, items, maxRows, columns, onSelect, onSort, onFilter, onChange } = props

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

  // context menu state
  const [contextMenuState, _setContextMenuState] = useState({})
  const contectMenuStateRef = useState(contextMenuState)
  const setContextMenuState = (data) => {
    contectMenuStateRef.current = data
    _setContextMenuState(data)
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

  const containerRef = useRef(null)
  const tableRef = useRef(null)

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
        const newInnerColumns = DeepCopy(innerColumns)
        newInnerColumns[touchState.sizeBoxProps.name].__style = {
          width: newVal
        }

        hookInnerColumns(newInnerColumns)
      } else {
        if (touchState.sizeBoxProps.row >= 0) {
          const newInnerItems = DeepCopy(innerItems)
          newInnerItems[touchState.sizeBoxProps.row].__style = {
            height: newVal
          }
  
          hookInnerItems(newInnerItems)
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
      OffsetIndex(from, to, columns).map(colName => newInnerColumns[colName] = DeepCopy(innerColumns[colName]))
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
    window.addEventListener('resize', handleViewportResize, false)
    handleViewportResize()

    return () => {
      containerRef.current.removeEventListener(wheelEvent, handleMouseScroll)
      window.removeEventListener('resize', handleViewportResize)
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

  return <div ref={containerRef} className={`${s.container}`} style={viewPortState}


    /*onKeyDown={handleKeyDown}*/

    // touch scrolling events
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}

    onMouseDown={handleTouchStart}
    onMouseMove={handleTouchMove}
    onMouseUp={handleTouchEnd}

    /*onContextMenu={handleContextMenu}*/>

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


    {/* Global filter */}
    <ContentEditable {...{
      className: [s.editable],
      name: "globalSearch",
      value: "",
      onChange: (e) => {
        const { value } = e.target

          const newItems = []
          for(let i = 0, len = items.length; i < len; i++) {
            let found = false
            Object.keys(items[i]).forEach(colName => {
              if(items[i][colName] && items[i][colName].toString().includes(value)) {
                found = true
              }
            })

            if(found) newItems.push(items[i])
          }

          hookInnerItems(newItems)
      }
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
        },
        emitSort: (colName) => {

          const newItems = DeepCopy(innerItems)
          hookInnerItems(newItems.sort((a, b) => {
            
            const newInnerColumns = DeepCopy(innerColumns)
            Object.keys(newInnerColumns).forEach(item => {
              newInnerColumns[item].sortMode = 0
            })

            // http://www.javascriptkit.com/javatutors/arraysort2.shtml
            const evaluate = (a, b, order = 'asc') => {
              a = a[colName]?.toString().toLowerCase()
              b = b[colName]?.toString().toLowerCase()

              if(order === 'asc') {
                if (a < b) //sort string ascending
                  return 1 
                if (a > b)
                    return -1
                return 0 //default return value (no sorting)
              } else {
                if (a < b) //sort string ascending
                  return -1 
                if (a > b)
                    return 1
                return 0 //default return value (no sorting)
              }
            }
            
            switch(innerColumns[colName].sortMode) {
              case 1:
                newInnerColumns[colName].sortMode = 2
                hookInnerColumns(newInnerColumns)
                return evaluate(a, b, 'asc')

              case 2:
                newInnerColumns[colName].sortMode = 1
                hookInnerColumns(newInnerColumns)
                return evaluate(a, b, 'desc')

              default:
                newInnerColumns[colName].sortMode = 1
                hookInnerColumns(newInnerColumns)
                return evaluate(a, b, 'desc')
            }
          }))

          if (onSort && {}.toString.call(onSort) === '[object Function]') {
            onSort(colName)
          }
        },
        emitFilter: (e) => {
          const { name, value } = e.target

          const newInnerColumns = DeepCopy(innerColumns)
          newInnerColumns[name].filterText = value

          hookInnerItems(() => {
            const newItems = []
        
            for(let i = 0, len = items.length; i < len; i++) {
              const found = []
              Object.keys(newInnerColumns).forEach(colName => {
                const filterText = newInnerColumns[colName].filterText
                
                if (filterText && filterText !== "") {
                  
                  if (items[i][colName]?.toString().includes(filterText)) {
                    found.push(true)
                  } else {
                    found.push(false)
                  }
                } else {
                  found.push(true)
                }
              })
      
              if(found.reduce((sum, next) => sum && next, true)) {
                newItems.push(items[i])
              }
            }
        
            return newItems
          })

          hookInnerColumns(newInnerColumns)

          if (onFilter && {}.toString.call(onFilter) === '[object Function]') {
            onFilter()
          }
        }
        
      }} />

      <Body {...{
        columns: PickObjectProps(innerColumns, Object.keys(innerColumns).slice(hSlicer, hSlicer + 20)),
        items: innerItems.slice(slicer, slicer + maxRows),
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
    <ContextMenu {...{
      isOpen: contextMenuState.isOpen,
      style: contextMenuState.style,
      onClose: () => {
        const newState = DeepCopy(contextMenuState)
        newState.isOpen = false
        setContextMenuState(newState)
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
