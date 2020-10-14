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
        id: { dataType: 'row-select' },
        firstName: { title: 'First Name', dataType: 'string' },
        lastName: { title: 'Last Name', dataType: 'string' },
        age: { title: 'Age', dataType: 'number' },
        visits: { title: 'Visits', dataType: 'number' },
        progress: { title: 'Progress', dataType: 'number' },
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

}

export default App;
