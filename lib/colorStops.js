const chroma = require('chroma-js')
const helpers = require('./helpers.js')

/**
 * Calculate the color stops based on start+stopColor in an array and easingType
 * @param {array} colors Two colors in an array
 * @param {array} coordinates An array of coordinates (object with x and y keys)
 * @param {number} alphaDecimals How many decimals should be on the returned color values
 * @param {string} colorMode Color space used for color interpolation http://gka.github.io/chroma.js/#chroma-mix
 * @returns {array} An array of colorstops (a string with color and position)
 */
module.exports = (colors, coordinates, alphaDecimals = 5, colorMode = 'lrgb') => {
  const colorStops = []
  colors = helpers.transparentFix(colors)
  coordinates.forEach(coordinate => {
    const ammount = coordinate.y
    const percent = coordinate.x * 100
    let color = chroma.mix(colors[0], colors[1], ammount, colorMode).css('hsl')
    color = helpers.roundHslAlpha(color, alphaDecimals)
    if (Number(coordinate.x) !== 0 && Number(coordinate.x) !== 1) {
      colorStops.push(`${color} ${+percent.toFixed(2)}%`)
    } else {
      colorStops.push(color)
    }
  })
  return colorStops
}
