const Color = require('color')
const round10 = require('round10').round10

const supportedGradients = [
  'ease-in-sine-gradient',
  'ease-out-sine-gradient',
  'ease-in-out-sine-gradient',
  'ease-in-quad-gradient',
  'ease-out-quad-gradient',
  'ease-in-out-quad-gradient',
  'scrim-gradient'
]

/**
 * Test if a string matches one of the supported gradients
 */
exports.isEasingGradient = (str) => new RegExp(supportedGradients.join('|')).test(str)

/**
 * Convert a function object to a word object
 */
exports.functionToWord = (obj) => {
  const object = obj
  const array = []
  for (const node of object.nodes) {
    if (node.type === 'word') array.push(node.value)
  }
  object.value = `${obj.value}(${array.join()})`
  object.type = 'word'
  return object
}

/**
 * If a color is transparent then convert it to a transparent of the sibling
 */
exports.transparentFix = (colors) => colors.map((color, i) => {
  return color === 'transparent'
    ? Color(colors[Math.abs(i - 1)]).alpha(0).hsl().string()
    : color
})

/**
 * Round alpha in hsl colors to alphaDecimals
 */
exports.roundHslAlpha = (color, alphaDecimals) => {
  const prefix = color.substring(0, color.indexOf('('))
  const values = color
    .substring(color.indexOf('(') + 1, color.indexOf(')'))
    .split(',')
    .map(string => string.indexOf('%') === -1
      ? round10(Number(string), -alphaDecimals)
      : string.trim()
    )
  return `${prefix}(${values.join(', ')})`
}
