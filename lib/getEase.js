const easeInSine = require('eases/sine-in')
const easeOutSine = require('eases/sine-out')
const easeInOutSine = require('eases/sine-in-out')
const easeInQuad = require('eases/quad-in')
const easeOutQuad = require('eases/quad-out')
const easeInOutQuad = require('eases/quad-in-out')

/**
 * Easing functions switcheroo
 */
module.exports = (x, type) => {
  switch (type) {
    case 'ease-in-sine-gradient':
      return easeInSine(x)
    case 'ease-out-sine-gradient':
      return easeOutSine(x)
    case 'ease-in-out-sine-gradient':
      return easeInOutSine(x)
    case 'ease-in-quad-gradient':
      return easeInQuad(x)
    case 'ease-out-quad-gradient':
      return easeOutQuad(x)
    case 'ease-in-out-quad-gradient':
      return easeInOutQuad(x)
    default:
      console.warn(`Sorry, easing gradient does not support ${type}.`)
      return null
  }
}
