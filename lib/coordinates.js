const BezierEasing = require('bezier-easing')
const helpers = require('./helpers.js')
const hypot = require('math-hypot')
const round10 = require('round10').round10

const deltaTolerance = 0.01
const deltaAdjust = 0.001
const yIncrement = 0.001

const createStop = (x, y) => [x, `${round10(y * 100, -1)}%`]

/**
 * Get coordinates based on easing function.
 * Delta checks ensures there's roughly the same distance between coordinates.
 */
module.exports = (easing, precision) => {
  let coordinates = {}
  if (helpers.isStepsFunction(easing)) {
    const stepParams = helpers.getParenthesisInsides(easing).split(',').map(str => str.trim())
    const stepDirection = stepParams[1] ? stepParams[1] : 'end'
    const steps = Number(stepParams[0])
    if (steps >= 2) {
      let n = 0
      let key = 0
      if (stepDirection === 'end') {
        while ((n + 1) < steps) {
          coordinates[key] = createStop(n / steps, (n + 1) / steps)
          coordinates[++key] = createStop((n + 1) / steps, (n + 1) / steps)
          ++n
          ++key
        }
        coordinates[key] = createStop(n / steps, (n + 1) / steps)
      } else if (stepDirection === 'start') {
        while ((n + 1) < steps) {
          coordinates[key] = createStop((n + 1) / steps, n / steps)
          coordinates[++key] = createStop((n + 1) / steps, (n + 1) / steps)
          ++n
          ++key
        }
        coordinates[key] = createStop((n + 1) / steps, n / steps)
      } else if (stepDirection === 'both') {
        while (n < steps) {
          coordinates[key] = createStop(n / steps, (n + 1) / (steps + 1))
          coordinates[++key] = createStop((n + 1) / steps, (n + 1) / (steps + 1))
          ++n
          ++key
        }
      } else if (stepDirection === 'none') {
        while ((n + 1) < steps) {
          coordinates[key] = createStop((n + 1) / steps, n / (steps - 1))
          coordinates[++key] = createStop((n + 1) / steps, (n + 1) / (steps - 1))
          ++n
          ++key
        }
      } else {
        throw new Error(`Invalid steps function. Stepdirection ${stepDirection} is not start or end`)
      }
    } else {
      throw new Error(`Invalid steps function. Stepcount ${steps} is not at least 2`)
    }
  } else if (helpers.isEasingFunction(easing)) {
    const bezierCoordinates = helpers.getBeziers(easing)
    const bezierFunction = BezierEasing(...bezierCoordinates)
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
        x = bezierFunction(y)
        if (hypot(x - xOld, y - yOld) > delta) {
          let key = Object.keys(coordinates).length
          coordinates[key] = [x, `${round10(y * 100, -1)}%`]
          xOld = x
          yOld = y
        }
        y += yIncrement
      }
    }
  }
  return coordinates
}
