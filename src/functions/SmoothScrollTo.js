export function SmoothScrollTo (pos, time) {
  if (typeof pos !== 'number') {
    pos = parseFloat(pos)
  }

  if (isNaN(pos)) {
    console.warn('Position must be a number or a numeric String.')
    throw new Error('Position must be a number')
  }

  if (pos < 0 || time < 0) {
    return
  }

  const currentPos = window.scrollY

  var start = null
  // time = time || 500;

  window.requestAnimationFrame(function step (currentTime) {
    start = !start ? currentTime : start

    var progress

    if (currentPos < pos) {
      progress = currentTime - start
      window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos)

      if (progress < time) {
        window.requestAnimationFrame(step)
      } else {
        window.scrollTo(0, pos)
      }
    } else {
      progress = currentTime - start
      window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time))

      if (progress < time) {
        window.requestAnimationFrame(step)
      } else {
        window.scrollTo(0, pos)
      }
    }
  })
}
