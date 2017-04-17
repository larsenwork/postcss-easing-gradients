const ColorStops = require('./lib/colorStops.js')
const helpers = require('./lib/helpers.js')
const Color = require('color')
const postcss = require('postcss')
const valueParser = require('postcss-value-parser')

const defaultPrecision = 0.1
const defaultAlphaDecimals = 3
const errorPrefix = 'Error[postcss-easing-gradients]:'

/**
 * The easing gradient function is a postcss plugin which supports the in /.helpers mentioned gradient types.
 */
module.exports = postcss.plugin('easing-gradient', (opts) => {
  return function (css) {
    const options = opts || {}
    css.walkRules((rule) => {
      rule.walkDecls((decl) => {
        // If declarations value contains a supported gradient.
        if (helpers.isEasingGradient(decl.value.substring(0, decl.value.indexOf('(')))) {
          // Parse the declaration and walk through the nodes — https://github.com/TrySound/postcss-value-parser.
          const parsedValue = valueParser(decl.value)
          parsedValue.walk((node) => {
            // Only modify gradient as the declaration can contain more e.g. 'scrim-gradient(black, pink) center'.
            if (helpers.isEasingGradient(node.value)) {
              const easing = node.value
              const colors = []
              let direction = ''
              // Loop through the easing gradient params and add colors to colors array,
              for (const param of node.nodes) {
                // E.g. HSL colors gets parsed as functions so let's convert them back to words.
                if (param.type === 'function') helpers.functionToWord(param)
                // If param is a color then add to colors array.
                try {
                  Color(param.value)
                  colors.push(param.value)
                } catch (error) {
                  // Test if it's a word or space and before the first color and assume that's part of the direction.
                  // anotation e.g. 'to'+' '+'top' or '45deg'
                  if (param.type === 'word' || param.type === 'space') {
                    if (colors.length < 1) {
                      direction += param.value
                    // If a word comes after the first color it's prolly a not supported color stop location.
                    } else if (param.type === 'word') {
                      console.warn(`${errorPrefix} No support for ${param.value} (color-stop location?) in ${easing}`)
                      return
                    }
                  }
                }
              }
              // Error handling: We only support exactly two colors
              if (colors.length !== 2) {
                console.warn(`${errorPrefix} No support for ${colors.length} colors in ${node.value} — only exactly 2`)
                return
              }
              // Error handling: Don't run if the two colors are identical
              if (Color(colors[0]).hsl().string() === Color(colors[1]).hsl().string()) {
                console.warn(`${errorPrefix} Identical colors: ${colors[0]} and ${colors[1]} in ${node.value}`)
                return
              }
              // Get the color stops using our
              const colorStops = ColorStops(
                colors,
                easing,
                options.precision || defaultPrecision,
                options.alphaDecimals || defaultAlphaDecimals
              )
              // Update node
              node.type = 'word'
              direction
                ? node.value = `linear-gradient(${direction}, ${colorStops})`
                : node.value = `linear-gradient(${colorStops})`
            }
          })
          // Update our declaration value
          decl.value = parsedValue.toString()
        }
      })
    })
  }
})
