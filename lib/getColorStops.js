const Color = require('color')
const getCoordinates = require('./getCoordinates.js')
const helpers = require('./helpers.js')

/**
 * Calculate the color stops based on start+stopColor in an array and easingType
 */
module.exports = (colors, easingType, delta, alphaDecimals) => {
  const fixedColors = helpers.transparentFix(colors)
  const gradientCoordinates = getCoordinates(easingType, delta)
  let colorStops = ''
  Object.keys(gradientCoordinates).forEach((ammount) => {
    // https://github.com/Qix-/color
    let color = Color(fixedColors[1]).mix(Color(fixedColors[0]), ammount)
    color = color.hsl().string()
    color = helpers.roundHslAlpha(color, alphaDecimals)
    colorStops += `${color} ${gradientCoordinates[ammount]}, `
  })
  colorStops += `${colors[1]} 100%`
  return colorStops
}
