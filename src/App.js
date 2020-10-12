import React, { useMemo, useState } from 'react'
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

return <div style={{/*padding: '0px 100px'*/}}>
    {/*<h1>MAKS-IT React Complex/Slice Grid (CSGrid)</h1>*/}
    <ComplexGrid {...{
      items: items,
      columns: {
        id: { type: 'row-select' },
        firstName: { title: 'First Name', type: 'string' },
        lastName: { title: 'Last Name', type: 'string' },
        age: { title: 'Age', type: 'number' },
        visits: { title: 'Visits', type: 'number' },
        progress: { title: 'Progress', type: 'number' },
        status: { title: 'Status', type: 'string' },
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
    
  

    <button onClick={handleDelete}>Delete</button>
  </div>

}

export default App;
