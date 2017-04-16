const getEase = require('./getEase.js')
const hypot = require('math-hypot')
const round10 = require('round10').round10

const scrimCoordinates = {
  0.000: '0%',
  0.262: '19%',
  0.459: '34%',
  0.618: '47%',
  0.722: '56.5%',
  0.806: '65%',
  0.874: '73%',
  0.925: '80.2%',
  0.958: '86.1%',
  0.979: '91%',
  0.992: '95.2%',
  0.998: '98.2%'
}

/**
 * Get coordinates based on easing function.
 * Delta checks ensures there's roughly the same distance between coordinates.
 */
module.exports = (easingFunction, precision) => {
  if (easingFunction === 'scrim-gradient') return scrimCoordinates

  const yIncrement = 0.001
  const deltaTolerance = 0.01
  const deltaAdjust = 0.001

  let coordinates = {}
  let x = 0
  let y = 0
  let xOld = 0
  let yOld = 0
  let firstTime = true
  let delta = precision

  // After first time test if distance last coordinate added in inner loop (xOld, yOld) to (1, 1) is within tolerance
  while (firstTime || !(hypot(1 - xOld, 1 - yOld) > delta - deltaTolerance)) {
    if (firstTime) {
      firstTime = false
    } else {
      // Reset values
      x = 0
      y = 0
      xOld = 0
      yOld = 0
      coordinates = {}
      // Decrease delta by deltaAdjust
      delta -= deltaAdjust
    }
    // Loop and add coordinates every time it's far enough away from the previous one
    while (y <= 1) {
      coordinates[0] = 0
      x = getEase(y, easingFunction)
      if (hypot(x - xOld, y - yOld) > delta) {
        coordinates[x] = `${round10(y * 100, -1)}%`
        xOld = x
        yOld = y
      }
      y += yIncrement
    }
  }
  return coordinates
}
