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
it('create a steps gradient with direction', () => {
  return run(
    'a{ background: linear-gradient(to right, green, steps(4, skip-none), red); }',
    'a{ background: linear-gradient(to right, hsl(120, 100%, 25.1%) 0%, hsl(120, 100%, 25.1%) 25%, hsl(60.23, 100%, 16.73%) 25%, hsl(60.23, 100%, 16.73%) 50%, hsl(15.06, 100%, 33.33%) 50%, hsl(15.06, 100%, 33.33%) 75%, hsl(0, 100%, 50%) 75%, hsl(0, 100%, 50%) 100%); }', // eslint-disable-line max-len
    { }
  )
})
it('create a cubic bezier gradient with direction', () => {
  return run(
    'a{ background: linear-gradient(to right, black, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    'a{ background: linear-gradient(to right, hsl(0, 0%, 0%) 0%, hsla(0, 0%, 0%, 0.94505) 7.9%, hsla(0, 0%, 0%, 0.88294) 15.3%, hsla(0, 0%, 0%, 0.81522) 22.2%, hsla(0, 0%, 0%, 0.7426) 28.7%, hsla(0, 0%, 0%, 0.66692) 34.8%, hsla(0, 0%, 0%, 0.58891) 40.6%, hsla(0, 0%, 0%, 0.50925) 46.2%, hsla(0, 0%, 0%, 0.42866) 51.7%, hsla(0, 0%, 0%, 0.34817) 57.2%, hsla(0, 0%, 0%, 0.2693) 62.8%, hsla(0, 0%, 0%, 0.19309) 68.7%, hsla(0, 0%, 0%, 0.12126) 75.2%, hsla(0, 0%, 0%, 0.05882) 82.6%, hsla(0, 0%, 0%, 0.01457) 91.2%, hsla(0, 0%, 0%, 0) 100%); }', // eslint-disable-line max-len
    { }
  )
})
it('create an ease gradient with direction', () => {
  return run(
    'a{ background: linear-gradient(to right, green, ease, red); }',
    'a{ background: linear-gradient(to right, hsl(120, 100%, 25.1%) 0%, hsl(111.85, 100%, 23.5%) 7.8%, hsl(98.92, 100%, 21.34%) 13.2%, hsl(82.02, 100%, 19.05%) 17.6%, hsl(60.02, 100%, 16.71%) 21.7%, hsl(40.57, 100%, 21.3%) 25.8%, hsl(28.11, 100%, 25.86%) 30.2%, hsl(19.54, 100%, 30.32%) 35.1%, hsl(13.47, 100%, 34.55%) 40.6%, hsl(9.01, 100%, 38.49%) 46.9%, hsl(5.73, 100%, 42.01%) 54.1%, hsl(3.36, 100%, 44.98%) 62.2%, hsl(1.74, 100%, 47.28%) 71.1%, hsl(0.7, 100%, 48.86%) 80.6%, hsl(0.15, 100%, 49.74%) 90.5%, hsl(0, 100%, 50%) 100%); }', // eslint-disable-line max-len
    { }
  )
})

/**
 * Output with custom settings
 */
it('create a cubic bezier gradient with 1 alphaDecimal', () => {
  return run(
    'a{ background: linear-gradient(black, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    'a{ background: linear-gradient(hsl(0, 0%, 0%) 0%, hsla(0, 0%, 0%, 0.9) 7.9%, hsla(0, 0%, 0%, 0.9) 15.3%, hsla(0, 0%, 0%, 0.8) 22.2%, hsla(0, 0%, 0%, 0.7) 28.7%, hsla(0, 0%, 0%, 0.7) 34.8%, hsla(0, 0%, 0%, 0.6) 40.6%, hsla(0, 0%, 0%, 0.5) 46.2%, hsla(0, 0%, 0%, 0.4) 51.7%, hsla(0, 0%, 0%, 0.3) 57.2%, hsla(0, 0%, 0%, 0.3) 62.8%, hsla(0, 0%, 0%, 0.2) 68.7%, hsla(0, 0%, 0%, 0.1) 75.2%, hsla(0, 0%, 0%, 0.1) 82.6%, hsla(0, 0%, 0%, 0) 91.2%, hsla(0, 0%, 0%, 0) 100%); }', // eslint-disable-line max-len
    { alphaDecimals: 1 }
  )
})
it('create a cubic-bezier gradient with .3 precision', () => {
  return run(
    'a{ background: linear-gradient(black, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    'a{ background: linear-gradient(hsl(0, 0%, 0%) 0%, hsla(0, 0%, 0%, 0.81205) 22.5%, hsla(0, 0%, 0%, 0.58334) 41%, hsla(0, 0%, 0%, 0.34095) 57.7%, hsla(0, 0%, 0%, 0.11251) 76.1%, hsla(0, 0%, 0%, 0) 100%); }', // eslint-disable-line max-len
    { precision: 0.3 }
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
    'a{ background: linear-gradient(black, cubic-bezier(0.48, 0.30, 0.64), transparent); }',
    { }
  )
})
