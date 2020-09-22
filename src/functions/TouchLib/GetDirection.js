export const LEFT = 'Left'
export const RIGHT = 'Right'
export const UP = 'Up'
export const DOWN = 'Down'

const GetDirection = (deltaX, deltaY) => {
  const absX = Math.abs(deltaX)
  const absY = Math.abs(deltaY)

  if (absX > absY) {
    if (deltaX > 0) {
      return LEFT
    }
    return RIGHT
  } else if (deltaY > 0) {
    return UP
  }
  return DOWN
}

export default GetDirection
