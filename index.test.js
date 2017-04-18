const postcss = require('postcss')
const plugin = require('./')

function run (input, output, opts) {
  return postcss([ plugin(opts) ]).process(input)
    .then(result => {
      expect(result.css).toEqual(output)
      expect(result.warnings().length).toBe(0)
    })
}

/**
 * Default output
 */
it('create a scrim gradient', () => {
  return run(
    'a{ background: scrim-gradient(black, transparent); }',
    'a{ background: linear-gradient(hsl(0, 0%, 0%) 0%, hsla(0, 0%, 0%, 0.738) 19%, hsla(0, 0%, 0%, 0.541) 34%, hsla(0, 0%, 0%, 0.382) 47%, hsla(0, 0%, 0%, 0.278) 56.5%, hsla(0, 0%, 0%, 0.194) 65%, hsla(0, 0%, 0%, 0.126) 73%, hsla(0, 0%, 0%, 0.075) 80.2%, hsla(0, 0%, 0%, 0.042) 86.1%, hsla(0, 0%, 0%, 0.021) 91%, hsla(0, 0%, 0%, 0.008) 95.2%, hsla(0, 0%, 0%, 0.002) 98.2%, hsla(0, 0%, 0%, 0) 100%); }', // eslint-disable-line max-len
    { }
  )
})
it('create an easing gradient with direction', () => {
  return run(
    'a{ background: ease-in-out-quad-gradient(to bottom left, #bada55, olive); }',
    'a{ background: linear-gradient(to bottom left, hsl(74.4, 64.3%, 59.4%) 0%, hsl(74.2, 63.2%, 58.8%) 9.7%, hsl(73.5, 60.7%, 57.1%) 18.3%, hsl(72.6, 57.5%, 54.9%) 25.7%, hsl(71.5, 54.2%, 52.3%) 32.2%, hsl(70.4, 52.1%, 49.6%) 37.9%, hsl(69.2, 55.1%, 46.7%) 43.1%, hsl(67.9, 58.7%, 43.7%) 47.9%, hsl(66.7, 62.8%, 40.6%) 52.4%, hsl(65.4, 67.6%, 37.7%) 57.2%, hsl(64.2, 72.9%, 34.8%) 62.4%, hsl(63, 79%, 32%) 68.2%, hsl(61.9, 85.5%, 29.5%) 74.7%, hsl(60.9, 92.3%, 27.3%) 82.2%, hsl(60.2, 97.8%, 25.7%) 90.9%, hsl(60, 100%, 25.1%) 100%); }', // eslint-disable-line max-len
    { }
  )
})

/**
 * Output with custom settings
 */
it('create a scrim gradient with 1 alphaDecimal', () => {
  return run(
    'a{ background: scrim-gradient(to right, black, transparent); }',
    'a{ background: linear-gradient(to right, hsl(0, 0%, 0%) 0%, hsla(0, 0%, 0%, 0.7) 19%, hsla(0, 0%, 0%, 0.5) 34%, hsla(0, 0%, 0%, 0.4) 47%, hsla(0, 0%, 0%, 0.3) 56.5%, hsla(0, 0%, 0%, 0.2) 65%, hsla(0, 0%, 0%, 0.1) 73%, hsla(0, 0%, 0%, 0.1) 80.2%, hsla(0, 0%, 0%, 0) 86.1%, hsla(0, 0%, 0%, 0) 91%, hsla(0, 0%, 0%, 0) 95.2%, hsla(0, 0%, 0%, 0) 98.2%, hsla(0, 0%, 0%, 0) 100%); }', // eslint-disable-line max-len
    { alphaDecimals: 1 }
  )
})
it('create a scrim gradient with .5 precision', () => {
  return run(
    'a{ background: ease-in-out-quad-gradient(black, transparent); }',
    'a{ background: linear-gradient(hsl(0, 0%, 0%) 0%, hsla(0, 0%, 0%, 0.707) 38.3%, hsla(0, 0%, 0%, 0.287) 62.1%, hsla(0, 0%, 0%, 0) 100%); }', // eslint-disable-line max-len
    { precision: 0.5 }
  )
})

/**
 * Ignore incorrect/unsuported input
 */
it('ignore unsuported gradients', () => {
  return run(
    'a{ background: ease-in-out-cubic-gradient(black, transparent); }',
    'a{ background: ease-in-out-cubic-gradient(black, transparent); }',
    { }
  )
})
it('ignore gradients with color stop locations set', () => {
  return run(
    'a{ background: scrim-gradient(black 20%, transparent); }',
    'a{ background: scrim-gradient(black 20%, transparent); }',
    { }
  )
})
it('ignore gradients with 3 color stops', () => {
  return run(
    'a{ background: scrim-gradient(black, white, transparent); }',
    'a{ background: scrim-gradient(black, white, transparent); }',
    { }
  )
})
it('ignore gradients with identical colors', () => {
  return run(
    'a{ background: scrim-gradient(black, #000); }',
    'a{ background: scrim-gradient(black, #000); }',
    { }
  )
})
