const postcss      = require('postcss');
const valueParser  = require('postcss-value-parser');
const tinyColor    = require('tinycolor2');

const supportedGradients = [
  'ease-in-sine-gradient',
  'ease-out-sine-gradient',
  'ease-in-out-sine-gradient',
  'ease-in-quad-gradient',
  'ease-out-quad-gradient',
  'ease-in-out-quad-gradient',
  'scrim-gradient'
];

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

                // If a param is a color and if so then add to colors array.
                //
                if (tinyColor(param.value).isValid()) {
                  colors.push(param.value);

                // A gradient direction is written using words and spaces
                } else if (param.type === 'word' || param.type === 'space') {
                  direction += param.value;
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
 * Calculate the color stops based on start+stopColor in an array and easingType
 */
function getColorStops(colors, easingType) {
  colors = transparentFix(colors);
  let colorStops = '';
  if (easingType === 'scrim-gradient') {
    for (let ammount in scrimMap) {
      let color = tinyColor
        .mix(colors[0], colors[1], ammount)
        .toHslString();
      colorStops += `, ${color} ${scrimMap[ammount]}`;
    }
  } else {
    for (let stopValue of stopsArray(15)) {
      let color = tinyColor
        .mix(colors[0], colors[1], 100 * ease(stopValue, easingType))
        .toHslString();
      let percent = getPercentage(stopValue);
      colorStops += `, ${color} ${percent}`;
    }
  }
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
  let transparentOfOtherColor = tinyColor(otherColor).setAlpha(0).toHslString();
  return transparentOfOtherColor;
}

/**
 * Function to generate an array with values that are linear divisions of 1
 * E.g. [0, 0.25, 0.5, 0.75, 1]
 */
function stopsArray(stopCount) {
  let array = [];
  let value = 0;
  let i = 0;
  while (i <= stopCount) {
    array.push(value);
    value += 1/stopCount;
    i += 1;
  }
  return array;
}

/**
 * Easing functions
 * https://gist.github.com/gre/1650294
 */
function ease(x, type) {
  switch (type) {
    case 'ease-in-sine-gradient':
      return -1 * Math.cos(x * (Math.PI / 2)) + 1;
      break;
    case 'ease-out-sine-gradient':
      return Math.sin(x * (Math.PI / 2));
      break;
    case 'ease-in-out-sine-gradient':
      return -0.5 * (Math.cos(Math.PI * x) - 1);
      break;
    case 'ease-in-quad-gradient':
      return x * x;
      break;
    case 'ease-out-quad-gradient':
      return x * (2 - x);
      break;
    case 'ease-in-out-quad-gradient':
      return x < .5 ? 2 * x * x : -1 + (4 - 2 * x) * x;
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

const scrimMap = {
  0: '0%',
  14: '8.52%',
  28: '17.53%',
  42: '27.19%',
  54: '36.28%',
  64: '44.56%',
  72: '51.97%',
  79: '59.18%',
  85: '66.33%',
  90: '73.39%',
  94: '80.36%',
  97: '87.18%',
  99: '93.73%',
  100: '100%'
}
