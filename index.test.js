const postcss = require('postcss')
const plugin = require('./')

function run (input, output, opts) {
  return postcss([plugin(opts)]).process(input, { from: null })
    .then(result => {
      expect(result.css).toEqual(output)
      expect(result.warnings()).toHaveLength(0)
    })
}

/**
 * Default output
 */
it('create a steps gradient with direction', () => {
  return run(
    'a{ background: linear-gradient(to right, green, steps(4, skip-none), red); }',
    'a{ background: linear-gradient(to right, hsl(120, 100%, 25.1%), hsl(120, 100%, 25.1%) 25%, hsl(42.59, 100%, 28.87%) 25%, hsl(42.59, 100%, 28.87%) 50%, hsl(21.3, 100%, 40.82%) 50%, hsl(21.3, 100%, 40.82%) 75%, hsl(0, 100%, 50%) 75%, hsl(0, 100%, 50%)); }', // eslint-disable-line max-len
    { }
  )
})
it('create a cubic bezier gradient with direction', () => {
  return run(
    'a{ background: linear-gradient(to right, black, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    'a{ background: linear-gradient(to right, hsl(0, 0%, 0%), hsla(0, 0%, 0%, 0.94505) 7.9%, hsla(0, 0%, 0%, 0.88294) 15.3%, hsla(0, 0%, 0%, 0.81522) 22.2%, hsla(0, 0%, 0%, 0.7426) 28.7%, hsla(0, 0%, 0%, 0.66692) 34.8%, hsla(0, 0%, 0%, 0.58891) 40.6%, hsla(0, 0%, 0%, 0.50925) 46.2%, hsla(0, 0%, 0%, 0.42866) 51.7%, hsla(0, 0%, 0%, 0.34817) 57.2%, hsla(0, 0%, 0%, 0.2693) 62.8%, hsla(0, 0%, 0%, 0.19309) 68.7%, hsla(0, 0%, 0%, 0.12126) 75.2%, hsla(0, 0%, 0%, 0.05882) 82.6%, hsla(0, 0%, 0%, 0.01457) 91.2%, hsla(0, 0%, 0%, 0)); }', // eslint-disable-line max-len
    { }
  )
})
it('create an ease gradient with direction', () => {
  return run(
    'a{ background: linear-gradient(to right, green, ease, red); }',
    'a{ background: linear-gradient(to right, hsl(120, 100%, 25.1%), hsl(88.79, 100%, 24.28%) 7.8%, hsl(69.81, 100%, 23.14%) 13.2%, hsl(53.43, 100%, 24.55%) 17.6%, hsl(42.52, 100%, 28.9%) 21.7%, hsl(34.96, 100%, 32.64%) 25.8%, hsl(29.1, 100%, 35.96%) 30.2%, hsl(24.26, 100%, 38.94%) 35.1%, hsl(20.14, 100%, 41.56%) 40.6%, hsl(16.47, 100%, 43.87%) 46.9%, hsl(13.13, 100%, 45.83%) 54.1%, hsl(10.07, 100%, 47.42%) 62.2%, hsl(7.23, 100%, 48.62%) 71.1%, hsl(4.6, 100%, 49.43%) 80.6%, hsl(2.16, 100%, 49.87%) 90.5%, hsl(0, 100%, 50%)); }', // eslint-disable-line max-len
    { }
  )
})
it('create an ease radial-gradient', () => {
  return run(
    'a{ background: radial-gradient(circle at top right, red, ease-in-out, blue); }',
    'a{ background: radial-gradient(circle at top right, hsl(0, 100%, 50%), hsl(353.5, 100%, 49.71%) 7.7%, hsl(347.13, 100%, 48.89%) 14.8%, hsl(341.1, 100%, 47.69%) 21%, hsl(335.24, 100%, 46.22%) 26.5%, hsl(329.48, 100%, 44.57%) 31.4%, hsl(323.63, 100%, 42.76%) 35.9%, hsl(317.56, 100%, 40.82%) 40.1%, hsl(310.92, 100%, 38.7%) 44.2%, hsl(303.81, 100%, 36.49%) 48.1%, hsl(296, 100%, 36.55%) 52%, hsl(288.73, 100%, 38.81%) 56%, hsl(282.14, 100%, 40.92%) 60.1%, hsl(276.09, 100%, 42.84%) 64.3%, hsl(270.27, 100%, 44.64%) 68.8%, hsl(264.54, 100%, 46.28%) 73.7%, hsl(258.7, 100%, 47.74%) 79.2%, hsl(252.68, 100%, 48.92%) 85.4%, hsl(246.32, 100%, 49.72%) 92.5%, hsl(240, 100%, 50%)); }', // eslint-disable-line max-len
    { }
  )
})

/**
 * Output with custom settings
 */
it('create a cubic bezier gradient with 1 alphaDecimal', () => {
  return run(
    'a{ background: linear-gradient(black, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    'a{ background: linear-gradient(hsl(0, 0%, 0%), hsla(0, 0%, 0%, 0.9) 7.9%, hsla(0, 0%, 0%, 0.9) 15.3%, hsla(0, 0%, 0%, 0.8) 22.2%, hsla(0, 0%, 0%, 0.7) 28.7%, hsla(0, 0%, 0%, 0.7) 34.8%, hsla(0, 0%, 0%, 0.6) 40.6%, hsla(0, 0%, 0%, 0.5) 46.2%, hsla(0, 0%, 0%, 0.4) 51.7%, hsla(0, 0%, 0%, 0.3) 57.2%, hsla(0, 0%, 0%, 0.3) 62.8%, hsla(0, 0%, 0%, 0.2) 68.7%, hsla(0, 0%, 0%, 0.1) 75.2%, hsla(0, 0%, 0%, 0.1) 82.6%, hsla(0, 0%, 0%, 0) 91.2%, hsla(0, 0%, 0%, 0)); }', // eslint-disable-line max-len
    { alphaDecimals: 1 }
  )
})
it('create a cubic-bezier gradient with .3 precision', () => {
  return run(
    'a{ background: linear-gradient(black, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    'a{ background: linear-gradient(hsl(0, 0%, 0%), hsla(0, 0%, 0%, 0.81205) 22.5%, hsla(0, 0%, 0%, 0.58334) 41%, hsla(0, 0%, 0%, 0.34095) 57.7%, hsla(0, 0%, 0%, 0.11251) 76.1%, hsla(0, 0%, 0%, 0)); }', // eslint-disable-line max-len
    { precision: 0.3 }
  )
})
it('create an ease gradient with hsl colorMode', () => {
  return run(
    'a{ background: linear-gradient(to right, green, ease, red); }',
    'a{ background: linear-gradient(to right, hsl(120, 100%, 25.1%), hsl(112.5, 100%, 26.67%) 7.8%, hsl(102.04, 100%, 28.82%) 13.2%, hsl(91.32, 100%, 31.18%) 17.6%, hsl(79.76, 100%, 33.33%) 21.7%, hsl(68.9, 100%, 35.69%) 25.8%, hsl(57.84, 100%, 38.04%) 30.2%, hsl(47.12, 100%, 40.2%) 35.1%, hsl(36.94, 100%, 42.35%) 40.6%, hsl(27.61, 100%, 44.31%) 46.9%, hsl(19.15, 100%, 46.08%) 54.1%, hsl(12.15, 100%, 47.45%) 62.2%, hsl(6.53, 100%, 48.63%) 71.1%, hsl(2.86, 100%, 49.41%) 80.6%, hsl(0.71, 100%, 49.8%) 90.5%, hsl(0, 100%, 50%)); }', // eslint-disable-line max-len
    { colorMode: 'hsl' }
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
