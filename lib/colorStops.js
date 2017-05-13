const Color = require('color')
const helpers = require('./helpers.js')

/**
 * Calculate the color stops based on start+stopColor in an array and easingType
 */
module.exports = (colors, coordinates, alphaDecimals) => {
  let colorStops = []
  Object.keys(coordinates).forEach((key) => {
    const ammount = coordinates[key][0]
    const percent = coordinates[key][1]
    // https://github.com/Qix-/color
    let color = Color(colors[1]).mix(Color(colors[0]), ammount)
    color = color.hsl().string()
    color = helpers.roundHslAlpha(color, alphaDecimals)
    colorStops.push(`${color} ${percent}`)
  })
  return colorStops
}
