export function MergeArrayByPropVal (arr1, arr2, propIndex) {
  const tmp = []

  // loop all slave array items
  for (let i = 0; i < arr2.length; i++) {
    const key2 = Object.keys(arr2[i])[propIndex]
    const val2 = arr2[i][key2]

    let updated = false
    // loop all main array items
    for (let j = 0; j < arr1.length; j++) {
      const key1 = Object.keys(arr1[j])[propIndex]
      const val1 = arr1[j][key1]

      // update array items if key and value are same
      if (key2 === key1 && val2 === val1) {
        arr1[j] = arr2[i]
        updated = true
      }
    }

    // if wasn't able to find, push item to temp array
    if (!updated) {
      tmp.push(arr2[i])
    }
  }

  return arr1.concat(tmp)
}
