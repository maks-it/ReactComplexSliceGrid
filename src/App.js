import React, { useMemo, useState } from 'react'
import './App.css'

import { makeData } from './hooks'
import ComplexGrid from './components/ReactComplexSliceGrid'

function App() {

  const [items, setItems] = useState(useMemo(() => makeData(1000), []))
  const [selectedItems, setSelectedItems] = useState([])

  console.log([...items].shift())

  const handleDelete = () => {
    setItems(items.filter(row => !selectedItems.includes(row.id)))
  }

  const handleChange = (e, row) => {
    const { name, value } = e.target
    const newItems = [...items]

    newItems[row][name] = value

    setItems(newItems)
  }

  return <><ComplexGrid {...{
    items: items,
    columns: {
      id: { type: 'row-select' },
      firstName: { title: 'First Name', type: 'editable' },
      lastName: { title: 'Last Name', type: 'editable' },
      age: { title: 'Age', type: 'editable' },
      visits: { title: 'Visits' },
      progress: { title: 'Progress' },
      status: { title: 'Status' },
      subRows: { title: 'Sub Rows' }
    },
    onSelect: (ids) => {
      console.log(ids)
      setSelectedItems(ids)
    },
    onChange: (e, row) => {
      const { name, value } = e.target
      console.log(`row: ${row} => {${name}: ${value}}`)
    }
  }} />

  <button onClick={handleDelete}>Delete</button>
</>
}

export default App;
