/**
 * Require constants
 */
const Color = require('color');
const helpers = require('./helpers.js');
const postcss = require('postcss');
const valueParser = require('postcss-value-parser');

/**
 * Other constants
 */
const defaultPrecision = 0.1;
const defaultAlphaDecimals = 3;
const errorPrefix = 'Error[postcss-easing-gradients]:';

/**
 * The easing gradient function is a postcss plugin which supports the above
 * mentioned gradient types.
 */
// TODO: Make eslint happy
/* eslint-disable prefer-arrow-callback */
module.exports = postcss.plugin('easing-gradient', function easingGradient(opts) {
/* eslint-enable prefer-arrow-callback */
  return function cssLoop(css) {
    const options = opts || {};
    css.walkRules((rule) => {
      rule.walkDecls((decl) => {
        // If declarations value contains a supported gradient.
        if (helpers.isEasingGradient(decl.value)) {
          // Parse the declaration and walk through the nodes.
          // https://github.com/TrySound/postcss-value-parser
          const parsedValue = valueParser(decl.value);
          parsedValue.walk((node) => {
            // Only do something to our gradient as the declaration can
            // contain more e.g. 'scrim-gradient(black, pink) center'
            if (helpers.isEasingGradient(node.value)) {
              const colors = [];
              let direction = '';
              // Loop through the easing gradient params and add colors to
              // colors array
              // TODO: Make eslint happy
              /* eslint-disable no-restricted-syntax */
              for (const param of node.nodes) {
                // E.g. HSL colors gets parsed as functions so let's convert
                // them back to words.
                if (param.type === 'function') helpers.functionToWord(param);
                // If param is a color then add to colors array.
                try {
                  Color(param.value);
                  colors.push(param.value);
                } catch (error) {
                  // Test if it's a word or space and before the first color
                  // and assume that's part of the direction anotation e.g.
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
              /* eslint-enable no-restricted-syntax */
              // Error handling: We only support exactly two colors
              if (colors.length !== 2) {
                let errorMsg = `${errorPrefix} ${node.value} has `;
                errorMsg += `${colors.length} valid colors — but only `;
                errorMsg += 'supports exactly 2';
                console.log(errorMsg);
                return;
              }
              // Error handling: Don't run if the two colors are identical
              if (helpers.isSameColor(colors[0], colors[1])) {
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
              if (direction) {
                node.value = `linear-gradient(${direction}, ${colorStops})`;
              } else {
                node.value = `linear-gradient(${colorStops})`;
              }
            }
          });
          // Update our declaration value
          decl.value = parsedValue.toString();
        }
      });
    });
  };
});
