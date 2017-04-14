const postcss        = require('postcss');
const valueParser    = require('postcss-value-parser');
const Color          = require('color');
const round10        = require('round10').round10;
// Easing functions
const easeInSine     = require('eases/sine-in');
const easeOutSine    = require('eases/sine-out');
const easeInOutSine  = require('eases/sine-in-out');
const easeInQuad     = require('eases/quad-in');
const easeOutQuad    = require('eases/quad-out');
const easeInOutQuad  = require('eases/quad-in-out');

const supportedGradients = [
  'ease-in-sine-gradient',
  'ease-out-sine-gradient',
  'ease-in-out-sine-gradient',
  'ease-in-quad-gradient',
  'ease-out-quad-gradient',
  'ease-in-out-quad-gradient',
  'scrim-gradient'
];

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
 * The easing gradient function is a postcss plugin which supports the above
 * mentioned gradient types.
 */
module.exports = postcss.plugin('easing-gradient', function easingGradient() {
  return function (css) {
    css.walkRules(function (rule) {
      rule.walkDecls(function (decl, i) {

        // If declarations value contains a supported gradient.
        if (isEasingGradient(decl.value)) {

          // Parse the declaration and walk through the nodes.
          // https://github.com/TrySound/postcss-value-parser
          const parsedValue = valueParser(decl.value);
          parsedValue.walk(function (node) {

            // Only do something to our gradient as the declaration can
            // contain more e.g. 'scrim-gradient(black, pink) center'
            if (isEasingGradient(node.value)) {
              let colors = [];
              let direction = '';

              // Loop through the easing gradient params
              for (let param of node.nodes) {

                // E.g. HSL colors gets parsed as functions so let's convert
                // them back to words.
                if (param.type === 'function') functionToWord(param);

                // If a param is a color and then add to colors array.
                try {
                  Color(param.value) && colors.push(param.value);
                }
                catch(error) {
                  // Test if it's a word or space and assume that's part of the
                  // direction anotation — e.g. 'to'+' '+'top' or '45deg'
                  if (param.type === 'word' || param.type === 'space') {
                    direction += param.value;
                  }
                }
              }

              // Get the color stops using our new
              const colorStops = getColorStops(colors, node.value);

              // Update node
              node.type = 'word';
              node.value = `linear-gradient(${direction}${colorStops})`;

              // Clean up if there is no direction
              node.value = node.value.replace('gradient(, ', 'gradient(');
            }
          })

          // Update our declaration value
          decl.value = parsedValue.toString();
        }
      });
    });
  }
});

/**
 * Check if a string matches one of the supported gradients
 */
function isEasingGradient (str) {
  return new RegExp(supportedGradients.join('|')).test(str);
}

/**
 * Convert a function object to a word object
 */
function functionToWord(obj) {
  let array = [];
  for (let objNode of obj.nodes) {
    if (objNode.type === 'word') {
      array.push(objNode.value);
    }
  }
  obj.value = `${obj.value}(${array.join()})`;
  obj.type = 'word';
  return obj;
}

/**
 * Mix colors
 */
function mixColors(colorA, colorB, ammount) {
  return Color(colorA).mix(Color(colorB), ammount).hsl().string();
}

/**
 * Round hue and alpha in hsl colors to 3 decimals
 */
function roundHueAlpha(color) {
  let prefix = color.substring(0, color.indexOf('('));
  let values = color
    .substring(color.indexOf('(') + 1, color.indexOf(')'))
    .split(',')
    .map(string => string.indexOf('%') === -1
      ? round10(Number(string), -3)
      : string.trim()
    );
  return `${prefix}(${values.join(', ')})`;
}

/**
 * Calculate the color stops based on start+stopColor in an array and easingType
 */
function getColorStops(colors, easingType) {
  colors = transparentFix(colors);
  let gradientCoordinates = getCoordinates(easingType);
  let colorStops = '';
  for (let ammount in gradientCoordinates) {
    let color = mixColors(colors[1], colors[0], ammount);
    color = roundHueAlpha(color);
    colorStops += `, ${color} ${gradientCoordinates[ammount]}`;
  }
  colorStops += `, ${roundHueAlpha(colors[1])} 100%`;
  return colorStops;
};

/**
 * If a color is transparent then convert it to a transparent of the sibling
 */
function transparentFix(colors) {
  return colors.map(color => color === 'transparent'
    ? transparentToAlpha(colors, color)
    : color
  );
}

/**
 * Convert a color to sibling with alpha 0
 */
function transparentToAlpha(colors, color) {
  let otherColor = colors[Math.abs(colors.indexOf(color) - 1)];
  let transparentOfOtherColor = Color(otherColor).alpha(0).hsl().string();
  return transparentOfOtherColor;
}

/**
 * Get coordinates based on easing function.
 * The delta checks ensures there's roughly the same distance between each
 * coordinate.
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

  while (firstTime || !isDelta(1, 1, xOld, yOld, delta - deltaTolerance)) {
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
      if (isDelta(x, y, xOld, yOld, delta)) {
        coordinates[x] = getPercentage(y);
        xOld = x;
        yOld = y;
      }
      y += yIncrements;
    }
  }
  return coordinates;
}

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
}

/**
 * Convert decimal number to percentage string
 */
function getPercentage (num) {
  return parseFloat((num * 100).toFixed(3)) + '%';
}

/**
 * Test is new coordinate is far enough away from old coordinate
 */
function isDelta(x, y, xOld, yOld, delta) {
  return Math.sqrt((x - xOld) ** 2 + (y - yOld) ** 2) > delta;
}
