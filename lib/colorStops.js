const Coordinates = require('./coordinates.js')
const helpers = require('./helpers.js')
const Color = require('color')

/**
 * Calculate the color stops based on start+stopColor in an array and easingType
 */
module.exports = (colors, easingType, delta, alphaDecimals) => {
  const fixedColors = helpers.transparentFix(colors)
  const coordinates = Coordinates(easingType, delta)
  let colorStops = []
  Object.keys(coordinates).sort().forEach((ammount) => {
    // https://github.com/Qix-/color
    let color = Color(fixedColors[1]).mix(Color(fixedColors[0]), ammount)
    color = color.hsl().string()
    color = helpers.roundHslAlpha(color, alphaDecimals)
    const colorStop = `${color} ${coordinates[ammount]}`
    colorStops.push(colorStop)
  })
  return colorStops.join(', ')
}
