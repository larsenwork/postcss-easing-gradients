const chroma = require('chroma-js')

// https://developer.mozilla.org/docs/Web/CSS/single-transition-timing-function
const stepsFunction = 'steps'
const cubicFunction = 'cubic-bezier'
const easeShorthands = ['ease', 'ease-in', 'ease-out', 'ease-in-out']
const timingFunctions = [...easeShorthands, cubicFunction, stepsFunction]

/**
* Get before a parenthesis
*/
const hasParenthesis = (str) => str.indexOf('(') !== -1
const getBeforeParenthesisMaybe = (str) => hasParenthesis(str) ? str.substring(0, str.indexOf('(')) : str

/**
 * Test if a string matches a css timing function
 */
exports.isTimingFunction = (str) => timingFunctions.includes(getBeforeParenthesisMaybe(str))

/**
 * Get insides of a parenthesis
 * Also used in this file so declared first and exported after
 */
const getParenthesisInsides = (str) => str.match(/\((.*)\)/).pop()
exports.getParenthesisInsides = getParenthesisInsides

/**
 * If a color is transparent then convert it to a hsl-transparent of the paired color
 */
exports.transparentFix = (colors) => colors.map((color, i) => {
  return color === 'transparent'
    ? chroma(colors[Math.abs(i - 1)]).alpha(0).css('hsl')
    : color
})

/**
 * Change value to ';' on child objects of type 'div'
 */
exports.divToSemiColon = (obj) => {
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
 */
exports.roundHslAlpha = (color, alphaDecimals) => {
  const prefix = getBeforeParenthesisMaybe(color)
  const values = getParenthesisInsides(color)
    .split(',')
    .map(string => string.indexOf('%') === -1
      ? +Number(string).toFixed(alphaDecimals)
      : string.trim()
  )
  color = `${prefix}(${values.join(', ')})`
  return color
}

/**
 * Return an error message
 */
exports.errorMsg = (input) => {
  return `Couldn't parse:
${input}
Check the syntax to see if it's correct/supported.`
}
