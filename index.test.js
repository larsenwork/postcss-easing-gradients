const postcss = require('postcss')
const plugin = require('./')

function run(input, output, opts) {
  return postcss([plugin(opts)])
    .process(input, { from: null })
    .then(result => {
      expect(result.css).toEqual(output)
      expect(result.warnings()).toHaveLength(0)
    })
}

/* eslint-disable max-len */

/**
 * Default output
 */
it('create a steps gradient with direction', () => {
  return run(
    'a{ background: linear-gradient(to right, green, steps(4, skip-none), red); }',
    'a{ background: linear-gradient(to right, hsl(120, 100%, 25.1%), hsl(120, 100%, 25.1%) 25%, hsl(42.59, 100%, 28.87%) 25%, hsl(42.59, 100%, 28.87%) 50%, hsl(21.3, 100%, 40.82%) 50%, hsl(21.3, 100%, 40.82%) 75%, hsl(0, 100%, 50%) 75%, hsl(0, 100%, 50%)); }',
    {}
  )
})
it('create a cubic bezier gradient with direction', () => {
  return run(
    'a{ background: linear-gradient(to right, black, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    'a{ background: linear-gradient(to right, hsl(0, 0%, 0%), hsla(0, 0%, 0%, 0.9173) 11.36%, hsla(0, 0%, 0%, 0.82176) 21.57%, hsla(0, 0%, 0%, 0.71719) 30.81%, hsla(0, 0%, 0%, 0.60741) 39.26%, hsla(0, 0%, 0%, 0.49624) 47.09%, hsla(0, 0%, 0%, 0.3875) 54.5%, hsla(0, 0%, 0%, 0.28501) 61.66%, hsla(0, 0%, 0%, 0.19259) 68.74%, hsla(0, 0%, 0%, 0.11406) 75.94%, hsla(0, 0%, 0%, 0.05324) 83.43%, hsla(0, 0%, 0%, 0.01395) 91.39%, hsla(0, 0%, 0%, 0)); }',
    {}
  )
})
it('create an ease gradient with direction', () => {
  return run(
    'a{ background: linear-gradient(to right, green, ease, red); }',
    'a{ background: linear-gradient(to right, hsl(120, 100%, 25.1%), hsl(95.38, 100%, 24.58%) 5.79%, hsl(78.24, 100%, 23.69%) 10.88%, hsl(60.53, 100%, 22.47%) 15.63%, hsl(45.6, 100%, 27.55%) 20.37%, hsl(35.49, 100%, 32.35%) 25.46%, hsl(27.94, 100%, 36.66%) 31.25%, hsl(21.9, 100%, 40.44%) 38.08%, hsl(16.79, 100%, 43.67%) 46.3%, hsl(12.26, 100%, 46.31%) 56.25%, hsl(8.08, 100%, 48.29%) 68.29%, hsl(4.05, 100%, 49.55%) 82.75%, hsl(0, 100%, 50%)); }',
    {}
  )
})
it('create an ease radial-gradient', () => {
  return run(
    'a{ background: radial-gradient(circle at top right, red, ease-in-out, blue); }',
    'a{ background: radial-gradient(circle at top right, hsl(0, 100%, 50%), hsl(351.5, 100%, 49.51%) 9.99%, hsl(343.03, 100%, 48.11%) 19.07%, hsl(334.18, 100%, 45.93%) 27.44%, hsl(324.5, 100%, 43.03%) 35.26%, hsl(313.41, 100%, 39.49%) 42.72%, hsl(300, 100%, 35.36%) 50%, hsl(286.59, 100%, 39.49%) 57.28%, hsl(275.5, 100%, 43.03%) 64.74%, hsl(265.82, 100%, 45.93%) 72.56%, hsl(256.97, 100%, 48.11%) 80.93%, hsl(248.5, 100%, 49.51%) 90.01%, hsl(240, 100%, 50%)); }',
    {}
  )
})

/**
 * Output with custom settings
 */
it('create a cubic bezier gradient with 1 alphaDecimal', () => {
  return run(
    'a{ background: linear-gradient(black, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    'a{ background: linear-gradient(hsl(0, 0%, 0%), hsla(0, 0%, 0%, 0.9) 11.36%, hsla(0, 0%, 0%, 0.8) 21.57%, hsla(0, 0%, 0%, 0.7) 30.81%, hsla(0, 0%, 0%, 0.6) 39.26%, hsla(0, 0%, 0%, 0.5) 47.09%, hsla(0, 0%, 0%, 0.4) 54.5%, hsla(0, 0%, 0%, 0.3) 61.66%, hsla(0, 0%, 0%, 0.2) 68.74%, hsla(0, 0%, 0%, 0.1) 75.94%, hsla(0, 0%, 0%, 0.1) 83.43%, hsla(0, 0%, 0%, 0) 91.39%, hsla(0, 0%, 0%, 0)); }',
    { alphaDecimals: 1 }
  )
})
it('create a cubic-bezier gradient with 5 stops', () => {
  return run(
    'a{ background: linear-gradient(black, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    'a{ background: linear-gradient(hsl(0, 0%, 0%), hsla(0, 0%, 0%, 0.71719) 30.81%, hsla(0, 0%, 0%, 0.3875) 54.5%, hsla(0, 0%, 0%, 0.11406) 75.94%, hsla(0, 0%, 0%, 0)); }',
    { stops: 5 }
  )
})
it('create an ease gradient with hsl colorMode', () => {
  return run(
    'a{ background: linear-gradient(to right, green, ease, red); }',
    'a{ background: linear-gradient(to right, hsl(120, 100%, 25.1%), hsl(115.04, 100%, 26.08%) 5.79%, hsl(106.9, 100%, 27.84%) 10.88%, hsl(96.08, 100%, 30%) 15.63%, hsl(83.71, 100%, 32.75%) 20.37%, hsl(69.61, 100%, 35.49%) 25.46%, hsl(55.71, 100%, 38.43%) 31.25%, hsl(41.52, 100%, 41.37%) 38.08%, hsl(28.53, 100%, 44.12%) 46.3%, hsl(16.96, 100%, 46.47%) 56.25%, hsl(8.05, 100%, 48.24%) 68.29%, hsl(2.13, 100%, 49.61%) 82.75%, hsl(0, 100%, 50%)); }',
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
    {}
  )
})
it('ignore gradients with color stop locations set', () => {
  return run(
    'a{ background: linear-gradient(black 20px, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    'a{ background: linear-gradient(black 20px, cubic-bezier(0.48, 0.30, 0.64, 1.00), transparent); }',
    {}
  )
})

/**
 * Fallback to linear gradient when incorrect transition functions
 */
it('ignore gradients with incorrect transition function syntax set', () => {
  return run(
    'a{ background: linear-gradient(black, cubic-bezier(0.48, 0.30, 0.64), transparent); }',
    'a{ background: linear-gradient(black, cubic-bezier(0.48, 0.30, 0.64), transparent); }',
    {}
  )
})
