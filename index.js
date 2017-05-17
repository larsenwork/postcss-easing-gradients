const postcss = require('postcss')
const valueParser = require('postcss-value-parser')

const getColorStops = require('./lib/colorStops.js')
const getCoordinates = require('./lib/coordinates.js')
const helpers = require('./lib/helpers.js')

const defaultPrecision = 0.1
const defaultAlphaDecimals = 3

/**
 * The easing gradient function is a postcss plugin which supports the in /.helpers mentioned gradient types.
 */
module.exports = postcss.plugin('easing-gradient', (opts) => {
  return function (css) {
    const options = opts || {}
    css.walkRules((rule) => {
      rule.walkDecls((decl) => {
        // If declaration value contains a linear-gradient.
        if (decl.value.includes('linear-gradient')) {
          // Parse the declaration and walk through the nodes — https://github.com/TrySound/postcss-value-parser.
          const parsedValue = valueParser(decl.value)
          parsedValue.walk((node) => {
            // Only modify gradient as the value can contain more e.g. 'linear-gradient(black, pink) center'.
            if (node.value === 'linear-gradient') {
              // Get a sensible array of gradient parameters where e.g. a function is split into multiple array items
              node.nodes = helpers.divToSemiColon(node.nodes)
              let gradientParams = valueParser.stringify(node.nodes).split(';').map(str => str.trim())
              // Loop and do magic whenever we encounter a timing function
              gradientParams = gradientParams.map((param, i) => {
                if (helpers.isTimingFunction(param)) {
                  try {
                    const colors = [gradientParams[i - 1], gradientParams[i + 1]]
                    const coordinates = getCoordinates(param, options.precision || defaultPrecision)
                    const colorStops = getColorStops(colors, coordinates, options.alphaDecimals || defaultAlphaDecimals)
                    param = colorStops.join(', ')
                  } catch (error) {
                    console.log(`While looking at ${param} we got an error. Check the color before or after it.`)
                  }
                }
                return param
              })
              // Filter out empty params (because linear returns an empty array of color stops)
              gradientParams = gradientParams.filter(param => param !== '')

              // Update node
              node.type = 'word'
              node.value = `linear-gradient(${gradientParams.join(', ')})`
            }
          })
          // Update our declaration value
          decl.value = parsedValue.toString()
        }
      })
    })
  }
})
