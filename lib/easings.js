const easeInSine = require('eases/sine-in')
const easeOutSine = require('eases/sine-out')
const easeInOutSine = require('eases/sine-in-out')
const easeInQuad = require('eases/quad-in')
const easeOutQuad = require('eases/quad-out')
const easeInOutQuad = require('eases/quad-in-out')

const scrimCoordinates = {
  0.000: '0%',
  0.262: '19%',
  0.459: '34%',
  0.618: '47%',
  0.722: '56.5%',
  0.806: '65%',
  0.874: '73%',
  0.925: '80.2%',
  0.958: '86.1%',
  0.979: '91%',
  0.992: '95.2%',
  0.998: '98.2%'
}

module.exports = class Easings {
  easeInSineGradient (number) {
    easeInSine(number)
  }
  easeOutSineGradient (number) {
    easeOutSine(number)
  }
  easeInOutSineGradient (number) {
    easeInOutSine(number)
  }
  easeInQuadGradient (number) {
    easeInQuad(number)
  }
  easeOutQuadGradient (number) {
    easeOutQuad(number)
  }
  easeInOutQuadGradient (number) {
    easeInOutQuad(number)
  }
  scrimGradient () {
    return scrimCoordinates
  }
}
