const Color = require('color')
const round10 = require('round10').round10

// https://developer.mozilla.org/docs/Web/CSS/single-transition-timing-function
const shorthandMap = {
  'ease': [0.25, 0.10, 0.25, 1.00],
  'ease-in': [0.42, 0.00, 1.00, 1.00],
  'ease-out': [0.00, 0.00, 0.58, 1.00],
  'ease-in-out': [0.42, 0.00, 0.58, 1.00]
}
const linearFunction = 'linear'
const stepsFunction = 'steps'
const cubicFunction = 'cubic-bezier'
const easeShorthands = Object.keys(shorthandMap)
const easingFunctions = [...easeShorthands, cubicFunction]
const timingFunctions = [...easingFunctions, stepsFunction, linearFunction]

/**
* Get before a parenthesis
*/
const hasParenthesis = (str) => str.indexOf('(') !== -1
const getBeforeParenthesisMaybe = (str) => hasParenthesis(str) ? str.substring(0, str.indexOf('(')) : str

/**
* Test if a string matches a css steps function
*/
exports.isStepsFunction = (str) => getBeforeParenthesisMaybe(str) === stepsFunction

/**
 * Test if a string matches a css easing function
 */
exports.isEasingFunction = (str) => easingFunctions.includes(getBeforeParenthesisMaybe(str))

/**
 * Test if a string matches a css timing function
 */
exports.isTimingFunction = (str) => timingFunctions.includes(getBeforeParenthesisMaybe(str))

/**
 * Get insides of a parenthesis
 */
const getParenthesisInsides = (str) => str.match(/\((.*)\)/).pop()
exports.getParenthesisInsides = getParenthesisInsides

/**
 * Get bezier coordinates as an array
 */
exports.getBeziersFromShorthand = (str) => {
  if (easeShorthands.includes(str)) {
    return shorthandMap[str]
  } else {
    return getParenthesisInsides(str).split(',')
  }
}

/**
 * If a color is transparent then convert it to a hsl-transparent of the paired color
 */
exports.transparentFix = (colors) => colors.map((color, i) => {
  return color === 'transparent'
    ? Color(colors[Math.abs(i - 1)]).alpha(0).hsl().string()
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
      ? round10(Number(string), -alphaDecimals)
      : string.trim()
    )
  color = `${prefix}(${values.join(', ')})`
  return color
}
