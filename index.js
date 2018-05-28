const easingCoordinates = require('easing-coordinates')
const postcss = require('postcss')
const valueParser = require('postcss-value-parser')
const getColorStops = require('./lib/colorStops.js')
const helpers = require('./lib/helpers.js')

/**
 * The easing gradient function is a postcss plugin which supports the in /.helpers mentioned gradient types.
 */
module.exports = postcss.plugin('easing-gradient', (options = {}) => {
  if (!options.stops) {
    options.stops = 13
  }
  return function(css) {
    css.walkRules(rule => {
      rule.walkDecls(decl => {
        // If declaration value contains a -gradient.
        if (decl.value.includes('-gradient')) {
          // Parse the declaration and walk through the nodes - https://github.com/TrySound/postcss-value-parser.
          const parsedValue = valueParser(decl.value)
          parsedValue.walk(node => {
            // Only modify gradient as the value can contain more e.g. 'linear-gradient(black, pink) center'.
            if (node.value === 'linear-gradient' || node.value === 'radial-gradient') {
              // Get a sensible array of gradient parameters where e.g. a function is split into multiple array items
              const gradientParams = valueParser
                .stringify(helpers.divToSemiColon(node.nodes))
                .split(';')
                .map(str => str.trim())

              gradientParams.forEach((param, i) => {
                if (helpers.isTimingFunction(param)) {
                  try {
                    const colors = [gradientParams[i - 1], gradientParams[i + 1]]
                    const coordinates = easingCoordinates.easingCoordinates(
                      param,
                      options.stops - 1
                    )
                    const colorStops = getColorStops(
                      colors,
                      coordinates,
                      options.alphaDecimals,
                      options.colorMode
                    )
                    // Update node
                    node.type = 'word'
                    // Assume if it has 4 params it's because the first one is the direction
                    if (gradientParams.length === 4) {
                      node.value = `${node.value}(${gradientParams[0]}, ${colorStops.join(', ')})`
                    } else {
                      node.value = `${node.value}(${colorStops.join(', ')})`
                    }
                    // Update our declaration value
                    decl.value = parsedValue.toString()
                  } catch (error) {
                    console.log(helpers.errorMsg(decl.value))
                  }
                }
              })
            }
          })
        }
      })
    })
  }
})
