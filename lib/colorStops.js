const chroma = require('chroma-js')
const helpers = require('./helpers.js')

/**
 * Calculate the color stops based on start+stopColor in an array and easingType
 */
module.exports = (colors, coordinates, alphaDecimals = 5) => {
  let colorStops = []
  colors = helpers.transparentFix(colors)
  coordinates.forEach(coordinate => {
    const ammount = coordinate.y
    const percent = coordinate.x * 100
    let color = chroma.mix(colors[0], colors[1], ammount).css('hsl')
    color = helpers.roundHslAlpha(color, alphaDecimals)
    if (Number(coordinate.x) !== 0 && Number(coordinate.x) !== 1) {
      colorStops.push(`${color} ${+percent.toFixed(2)}%`)
    } else {
      colorStops.push(color)
    }
  })
  return colorStops
}
