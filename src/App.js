import React, { useEffect, useMemo, useState } from 'react'
import './App.css'

import { makeData } from './hooks'
import ComplexGrid from './components/ReactComplexSliceGrid'

import './scss/style.scss'

function App() {

  const [items, setItems] = useState(useMemo(() => makeData(100), []))
  const [selectedItems, setSelectedItems] = useState([])

  // console.log([...items].shift())

  const handleDelete = () => {
    setItems(items.filter(row => !selectedItems.includes(row.id)))
  }

  const handleChange = (e, id) => {
    const { name, value } = e.target
    const newItems = [...items]
    for (let i = 0, len = newItems.length; i < len; i++) {
      const item = newItems[i]

      if(item.id === id) {
        item[name] = value
      }
    }

    setItems(newItems)
  }

  useEffect(() => {
    // https://medium.com/@sruthisreemenon/avoid-ui-distortions-during-keyboard-display-for-a-mobile-friendly-webpage-86eb99590a13

    // When web page is loaded on android device.
    // let viewport = document.querySelector('meta[name=viewport]')
    // viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0')

    /*
    // When keyboard is visible on screen.
    document.documentElement.style.setProperty('overflow', 'auto')
    const metaViewport = document.querySelector('meta[name=viewport]')
    metaViewport.setAttribute('content', 'height=' + initialHeight + 'px, width=device-width, initial-scale=1.0')
    */

    
    /*
    // When screen orientation Changes.
    window.innerHeight < initialHeight
    document.documentElement.style.setProperty(‘overflow’, ‘auto’)
    viewport.setAttribute(‘content’, ‘height=’ + Security.initialHeight + ‘px, width=device-width, initial-scale=1.0’)
     */
  }, [])

return <div>

    <div className="content">
          <h1>Lorem Ipsum</h1>
          <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</h5>

          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint
            occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat.</p>
    </div>


    <div className="content" style={{ height: '400px' }}>
    
      {/*<h1>MAKS-IT React Complex/Slice Grid (CSGrid)</h1>*/}
      <ComplexGrid {...{
        items: items,
        columns: {
          id: { dataType: 'row-select' },
          firstName: { title: 'First Name', dataType: 'string' },
          lastName: { title: 'Last Name', dataType: 'string' },
          age: { title: 'Age', dataType: 'number' },
          visits: { title: 'Visits', dataType: 'number' },
          progress: { title: 'Progress', dataType: 'number' },
          sum: { title: 'Sum', dataType: 'formula'},
          status: { title: 'Status', dataType: 'string' },
          subRows: { title: 'Sub Rows' }
        },
        onSelect: (ids) => {
          console.log(`selecting: ${ids}`)
          
          setSelectedItems(ids)
        },
        onChange: (e, id) => {
          const { name, value } = e.target
          console.log(`changing: ${id} => {${name}: ${value}}`)

          handleChange(e, id)
        },
        onSort: (colName) => {
          console.log(`sorting: ${colName}`)
        },
        onFilter: (e) => {
          const { name, value } = e.target
          console.log(`filtering: ${name}: ${value}`)
        },
        onGlobalFilter: (e) => {
          const { name, value } = e.target
          console.log(`global filtering: ${name}: ${value}`)
        }
      }} />

      {/*<button onClick={handleDelete}>Delete</button>*/}
    </div>

    <div className="content">
        <h1>Lorem Ipsum</h1>
        <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</h5>

        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat.</p>
    </div>
      

  </div>

}

export default App;
