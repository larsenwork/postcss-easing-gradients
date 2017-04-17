'use strict'

const postcss = require('postcss')
const plugin = require('./')

function run (input, output, opts) {
  return postcss([ plugin(opts) ]).process(input)
    .then(result => {
      expect(result.css).toEqual(output)
      expect(result.warnings().length).toBe(0)
    })
}

it('creates a scrim gradient', () => {
  return run(
    'a{background-image: scrim-gradient(black, transparent);}',
    'a{background-image: linear-gradient(hsl(0, 0%, 0%) 0%, hsla(0, 0%, 0%, 0.738) 19%, hsla(0, 0%, 0%, 0.541) 34%, hsla(0, 0%, 0%, 0.382) 47%, hsla(0, 0%, 0%, 0.278) 56.5%, hsla(0, 0%, 0%, 0.194) 65%, hsla(0, 0%, 0%, 0.126) 73%, hsla(0, 0%, 0%, 0.075) 80.2%, hsla(0, 0%, 0%, 0.042) 86.1%, hsla(0, 0%, 0%, 0.021) 91%, hsla(0, 0%, 0%, 0.008) 95.2%, hsla(0, 0%, 0%, 0.002) 98.2%, hsla(0, 0%, 0%, 0) 100%);}', // eslint-disable-line max-len
    { }
  )
})
