const OffsetIndex = (from, to, arr = []) => {
  if (from < to) {
    const start = arr.slice(0, from)
    const between = arr.slice(from + 1, to + 1)
    const end = arr.slice(to + 1)
    return [...start, ...between, arr[from], ...end]
  }
  if (from > to) {
    const start = arr.slice(0, to)
    const between = arr.slice(to, from)
    const end = arr.slice(from + 1)
    return [...start, arr[from], ...between, ...end]
  }
  return arr
}

export default OffsetIndex
