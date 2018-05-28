const chroma = require('chroma-js')

// https://developer.mozilla.org/docs/Web/CSS/single-transition-timing-function
const stepsFunction = 'steps'
const cubicFunction = 'cubic-bezier'
const easeShorthands = ['ease', 'ease-in', 'ease-out', 'ease-in-out']
const timingFunctions = [...easeShorthands, cubicFunction, stepsFunction]

/**
 * Test if a string has a parenthesis
 * @param {String} str A text string
 * @returns {Boolean} If a string has a "("
 */
const hasParenthesis = str => str.indexOf('(') !== -1

/**
 * Get substring before first parenthesis in a string
 * @param {String} str A text string
 * @returns {String} The substring if the provided string has a parenthesis. Otherwise the string.
 */
const getBeforeParenthesisMaybe = str =>
  hasParenthesis(str) ? str.substring(0, str.indexOf('(')) : str

/**
 * Test if a string matches a css timing function
 * @param {String} str A text string
 * @returns {Boolean} If the string is a timing function
 */
exports.isTimingFunction = str => timingFunctions.includes(getBeforeParenthesisMaybe(str))

/**
 * Get insides of a parenthesis
 * @param {String} str A text string
 * @returns {String} The substring within the parenthesis
 * Note: It's also used in this file so declared first and exported after
 */
const getParenthesisInsides = str => str.match(/\((.*)\)/).pop()
exports.getParenthesisInsides = getParenthesisInsides

/**
 * If a color is transparent then convert it to a hsl-transparent of the paired color
 * @param {Array} colors An array with two colors
 * @returns {Object} A color as chroma object
 */
exports.transparentFix = colors =>
  colors.map((color, i) => {
    return color === 'transparent'
      ? chroma(colors[Math.abs(i - 1)])
          .alpha(0)
          .css('hsl')
      : color
  })

/**
 * Change value to ';' on child objects of type 'div'
 * @param {Array.<Object>} obj An array of objects
 * @returns {Array.<Object>} An array of objects
 */
exports.divToSemiColon = obj => {
  obj.map(childObj => {
    if (childObj.type === 'div') {
      childObj.value = ';'
    }
    return childObj
  })
  return obj
}

/**
 * Round alpha in hsl colors to alphaDecimals
 * @param {String} color As an hsl value
 * @param {Number} alphaDecimals An integer specifying max number of deicamals
 * @returns {String} A alpha value rounded version of the hsl color string
 */
exports.roundHslAlpha = (color, alphaDecimals) => {
  const prefix = getBeforeParenthesisMaybe(color)
  const values = getParenthesisInsides(color)
    .split(',')
    .map(
      string =>
        string.indexOf('%') === -1 ? +Number(string).toFixed(alphaDecimals) : string.trim()
    )
  color = `${prefix}(${values.join(', ')})`
  return color
}

/**
 * Wrap a string telling the user we couldn't parse it
 * @param {String} input A string
 * @returns {String} The full error message wrapped around the string
 */
exports.errorMsg = input => {
  return `Couldn't parse:
${input}
Check the syntax to see if it's correct/supported.`
}
