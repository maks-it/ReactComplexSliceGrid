// maybe improve to accept both array or object
const ElementIndex = (array, attr) => {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i] === attr) {
      return i
    }
  }
  return -1
}

export default ElementIndex
