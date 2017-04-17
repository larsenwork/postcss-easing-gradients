const Easings = require('./easings')
const camelCase = require('camelcase')
const hypot = require('math-hypot')
const round10 = require('round10').round10

const deltaTolerance = 0.01
const deltaAdjust = 0.001
const yIncrement = 0.001
const easings = new Easings()

/**
 * Get coordinates based on easing function.
 * Delta checks ensures there's roughly the same distance between coordinates.
 */
module.exports = (easingFunction, precision) => {
  const easing = camelCase(easingFunction)
  if (easing === 'scrimGradient') return easings[easing]()

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
      coordinates[0] = '0%'
      x = easings[easing](y)
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
