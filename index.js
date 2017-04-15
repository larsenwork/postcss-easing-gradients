/**
 * Require constants
 */
const Color       = require('color');
const helpers     = require('./helpers.js');
const postcss     = require('postcss');
const valueParser = require('postcss-value-parser');

/**
 * Other constants
 */
const defaultPrecision = 0.1;
const defaultAlphaDecimals = 3;
const errorPrefix = 'Error[postcss-easing-gradients]:';
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
module.exports =
postcss.plugin('easing-gradient', function easingGradient(options) {
  return function (css) {
    options = options || {};

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

              // Loop through the easing gradient params and add colors to
              // colors array
              for (let param of node.nodes) {

                // E.g. HSL colors gets parsed as functions so let's convert
                // them back to words.
                if (param.type === 'function') functionToWord(param);

                // If param is a color then add to colors array.
                try {
                  Color(param.value) && colors.push(param.value);
                }

                // If param isn't a color
                catch(error) {

                  // Test if it's a word or space and before the first color
                  // and assume that's part of the direction anotation e.g.
                  // 'to'+' '+'top' or '45deg'
                  if (param.type === 'word' || param.type === 'space') {
                    if (colors.length < 1) {
                      direction += param.value;

                    // But if it happens after the first color then it's prolly
                    // a color stop and not something we support
                    } else if (param.type !== 'space') {
                      let errorMsg = `${errorPrefix} Sorry, I don't support `;
                      errorMsg += `${param.value} (color-stop location?) in `;
                      errorMsg += node.value;
                      console.log(errorMsg);
                      return;
                    }
                  }
                }
              }

              // Error handling: We only support exactly two colors
              if (colors.length !== 2) {
                let errorMsg = `${errorPrefix} ${node.value} has `;
                errorMsg += `${colors.length} valid colors — but only `;
                errorMsg += `supports exactly 2`;
                console.log(errorMsg);
                return;
              }

              // Error handling: Don't run if the two colors are identical
              if (isSameColor(colors[0], colors[1])) {
                let errorMsg = `${errorPrefix} ${colors[0]} and ${colors[1]} `;
                errorMsg += `in ${node.value} appear to be identical`;
                console.log(errorMsg);
                return;
              }

              // Get the color stops using our new
              const colorStops = helpers.getColorStops(
                colors,
                node.value,
                options.precision || defaultPrecision,
                options.alphaDecimals || defaultAlphaDecimals
              );

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
};

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
};

/**
 * Test if two colors are identical
 */
function isSameColor(colorA, colorB) {
  return Color(colorA).hsl().string() === Color(colorB).hsl().string();
};
