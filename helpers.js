/**
 * Require constants
 */
const Color         = require('color');
const round10       = require('round10').round10;
const easeInSine    = require('eases/sine-in');
const easeOutSine   = require('eases/sine-out');
const easeInOutSine = require('eases/sine-in-out');
const easeInQuad    = require('eases/quad-in');
const easeOutQuad   = require('eases/quad-out');
const easeInOutQuad = require('eases/quad-in-out');

/**
 * Other constants
 */
const decimalPrecision = 3;
const scrimCoordinates = {
  0.00: '0%',
  0.14: '8.52%',
  0.28: '17.53%',
  0.42: '27.19%',
  0.54: '36.28%',
  0.64: '44.56%',
  0.72: '51.97%',
  0.79: '59.18%',
  0.85: '66.33%',
  0.90: '73.39%',
  0.94: '80.36%',
  0.97: '87.18%',
  0.99: '93.73%'
}

/**
 * Calculate the color stops based on start+stopColor in an array and easingType
 */
exports.getColorStops = function(colors, easingType) {
  colors = transparentFix(colors);
  let gradientCoordinates = getCoordinates(easingType);
  let colorStops = '';
  for (let ammount in gradientCoordinates) {
    let color = Color(colors[1]).mix(Color(colors[0]), ammount);
    color = roundHslHueAlpha(color.hsl().string());
    colorStops += `, ${color} ${gradientCoordinates[ammount]}`;
  }
  colorStops += `, ${colors[1]} 100%`;
  return colorStops;
};

/**
 * If a color is transparent then convert it to a transparent of the sibling
 */
function transparentFix(colors) {
  return colors.map((color, i) => color === 'transparent'
    ? Color(colors[Math.abs(i - 1)]).alpha(0).hsl().string()
    : color
  );
};

/**
 * Get coordinates based on easing function.
 * Delta checks ensures there's roughly the same distance between coordinates.
 */
function getCoordinates(easingFunction) {
  if (easingFunction === 'scrim-gradient') return scrimCoordinates;

  const yIncrements = 0.001;
  const deltaTolerance = 0.01;
  const deltaAdjust = 0.001;

  let delta = 0.1;
  let coordinates = {};
  let x = 0;
  let y = 0;
  let xOld = 0;
  let yOld = 0;
  let firstTime = true;

  while (firstTime || !isFarEnough(1, 1, xOld, yOld, delta - deltaTolerance)) {
    if (firstTime) {
      firstTime = false;
    } else {
      x = 0;
      y = 0;
      xOld = 0;
      yOld = 0;
      delta = delta - deltaAdjust;
      coordinates = {};
    }
    while (y <= 1) {
      coordinates[0] = 0;
      x = ease(y, easingFunction);
      if (isFarEnough(x, y, xOld, yOld, delta)) {
        coordinates[x] = getPercentage(y);
        xOld = x;
        yOld = y;
      }
      y += yIncrements;
    }
  }
  return coordinates;
};

/**
 * Easing functions switcheroo
 */
function ease(x, type) {
  switch (type) {
    case 'ease-in-sine-gradient':
      return easeInSine(x);
      break;
    case 'ease-out-sine-gradient':
      return easeOutSine(x);
      break;
    case 'ease-in-out-sine-gradient':
      return easeInOutSine(x);
      break;
    case 'ease-in-quad-gradient':
      return easeInQuad(x);
      break;
    case 'ease-out-quad-gradient':
      return easeOutQuad(x);
      break;
    case 'ease-in-out-quad-gradient':
      return easeInOutQuad(x);
      break;
    default:
      console.log(`Sorry, easing gradient does not support ${type}.`);
  }
};

/**
 * Convert decimal number to percentage string
 */
function getPercentage (num) {
  return parseFloat((num * 100).toFixed(decimalPrecision)) + '%';
};

/**
 * Test if new coordinate is far enough away from old coordinate
 */
function isFarEnough(x, y, xOld, yOld, delta) {
  return Math.sqrt((x - xOld) ** 2 + (y - yOld) ** 2) > delta;
};

/**
 * Round hue and alpha in hsl colors to decimalPrecision
 */
function roundHslHueAlpha(color) {
  let prefix = color.substring(0, color.indexOf('('));
  let values = color
    .substring(color.indexOf('(') + 1, color.indexOf(')'))
    .split(',')
    .map(string => string.indexOf('%') === -1
      ? round10(Number(string), -decimalPrecision)
      : string.trim()
    );
  return `${prefix}(${values.join(', ')})`;
};
