const RotateXYByAngle = (pos, angle) => {
  if (angle === 0) return pos
  const angleInRadians = (Math.PI / 180) * angle
  const x = pos[0] * Math.cos(angleInRadians) + pos[1] * Math.sin(angleInRadians)
  const y = pos[1] * Math.cos(angleInRadians) - pos[0] * Math.sin(angleInRadians)
  return [x, y]
}

export default RotateXYByAngle
