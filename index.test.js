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
it('create an steps gradient with direction', () => {
  return run(
    'a{ background: linear-gradient(to right, green, steps(4, none), red); }',
    'a{ background: linear-gradient(to right, green, hsl(80.2, 100%, 18.8%) 0%, hsl(80.2, 100%, 18.8%) 33.3%, hsl(30.1, 100%, 25%) 33.3%, hsl(30.1, 100%, 25%) 66.7%, hsl(10, 100%, 37.5%) 66.7%, hsl(10, 100%, 37.5%) 100%, red); }', // eslint-disable-line max-len
    { }
  )
})
it('create an cubic bezier gradient with direction', () => {
  return run(
    'a{ background: linear-gradient(to right, black, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    'a{ background: linear-gradient(to right, black, hsla(0, 0%, 0%, 0.945) 7.9%, hsla(0, 0%, 0%, 0.883) 15.3%, hsla(0, 0%, 0%, 0.815) 22.2%, hsla(0, 0%, 0%, 0.743) 28.7%, hsla(0, 0%, 0%, 0.667) 34.8%, hsla(0, 0%, 0%, 0.589) 40.6%, hsla(0, 0%, 0%, 0.509) 46.2%, hsla(0, 0%, 0%, 0.429) 51.7%, hsla(0, 0%, 0%, 0.348) 57.2%, hsla(0, 0%, 0%, 0.269) 62.8%, hsla(0, 0%, 0%, 0.193) 68.7%, hsla(0, 0%, 0%, 0.121) 75.2%, hsla(0, 0%, 0%, 0.059) 82.6%, hsla(0, 0%, 0%, 0.015) 91.2%, transparent); }', // eslint-disable-line max-len
    { }
  )
})
it('create an ease gradient with direction', () => {
  return run(
    'a{ background: linear-gradient(to right, green, ease, red); }',
    'a{ background: linear-gradient(to right, green, hsl(111.8, 100%, 23.5%) 7.8%, hsl(98.9, 100%, 21.3%) 13.2%, hsl(82, 100%, 19%) 17.6%, hsl(60, 100%, 16.7%) 21.7%, hsl(40.6, 100%, 21.3%) 25.8%, hsl(28.1, 100%, 25.9%) 30.2%, hsl(19.5, 100%, 30.3%) 35.1%, hsl(13.5, 100%, 34.6%) 40.6%, hsl(9, 100%, 38.5%) 46.9%, hsl(5.7, 100%, 42%) 54.1%, hsl(3.4, 100%, 45%) 62.2%, hsl(1.7, 100%, 47.3%) 71.1%, hsl(0.7, 100%, 48.9%) 80.6%, hsl(0.2, 100%, 49.7%) 90.5%, red); }', // eslint-disable-line max-len
    { }
  )
})

/**
 * Output with custom settings
 */
it('create a cubic bezier gradient with 1 alphaDecimal', () => {
  return run(
    'a{ background: linear-gradient(black, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    'a{ background: linear-gradient(black, hsla(0, 0%, 0%, 0.9) 7.9%, hsla(0, 0%, 0%, 0.9) 15.3%, hsla(0, 0%, 0%, 0.8) 22.2%, hsla(0, 0%, 0%, 0.7) 28.7%, hsla(0, 0%, 0%, 0.7) 34.8%, hsla(0, 0%, 0%, 0.6) 40.6%, hsla(0, 0%, 0%, 0.5) 46.2%, hsla(0, 0%, 0%, 0.4) 51.7%, hsla(0, 0%, 0%, 0.3) 57.2%, hsla(0, 0%, 0%, 0.3) 62.8%, hsla(0, 0%, 0%, 0.2) 68.7%, hsla(0, 0%, 0%, 0.1) 75.2%, hsla(0, 0%, 0%, 0.1) 82.6%, hsla(0, 0%, 0%, 0) 91.2%, transparent); }', // eslint-disable-line max-len
    { alphaDecimals: 1 }
  )
})
it('create a scrim gradient with .5 precision', () => {
  return run(
    'a{ background: linear-gradient(black, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    'a{ background: linear-gradient(black, hsla(0, 0%, 0%, 0.67) 34.6%, hsla(0, 0%, 0%, 0.278) 62.2%, transparent); }', // eslint-disable-line max-len
    { precision: 0.5 }
  )
})

/**
 * Ignore incorrect/unsuported input
 */
it('ignore unsuported gradients', () => {
  return run(
    'a{ background: linear-gradient(black, funky-ease, transparent); }',
    'a{ background: linear-gradient(black, funky-ease, transparent); }',
    { }
  )
})
it('ignore gradients with color stop locations set', () => {
  return run(
    'a{ background: linear-gradient(black 20px, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    'a{ background: linear-gradient(black 20px, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    { }
  )
})

/**
 * Fallback to linear gradient when incorrect transition functions
 */
it('ignore gradients with incorrect transition function syntax set', () => {
  return run(
    'a{ background: linear-gradient(black, cubic-bezier(0.48, 0.30, 0.64), transparent); }',
    'a{ background: linear-gradient(black, transparent); }',
    { }
  )
})
