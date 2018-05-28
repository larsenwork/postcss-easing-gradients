# PostCSS Easing Gradients

[![NPM Version][npm-img]][npm]
[![NPM Monthly Downloads][dm-img]][npm]
[![Build Status][ci-img]][ci]
[![Dependency status][dpd-img]][dpd]
<br>
[![MIT License][mit-img]][mit]
[![Code Style: Prettier][prt-img]][prt]
[![Follow Larsenwork on Twitter][twt-img]][twt]

[PostCSS](https://github.com/postcss/postcss) plugin to create smooth linear-gradients that approximate easing functions.
Visual examples and online editor on [larsenwork.com/easing-gradients](https://larsenwork.com/easing-gradients/)

> The [syntax](#syntax) has changed substantially in `^v.2.0.0`

## Code Examples

```css
.cubic-bezier {
  background: linear-gradient(to bottom, black, cubic-bezier(0.48, 0.3, 0.64, 1), transparent);
  /* => */
  background: linear-gradient(
    to bottom,
    hsl(0, 0%, 0%),
    hsla(0, 0%, 0%, 0.94505) 7.9%,
    hsla(0, 0%, 0%, 0.88294) 15.3%,
    hsla(0, 0%, 0%, 0.81522) 22.2%,
    hsla(0, 0%, 0%, 0.7426) 28.7%,
    hsla(0, 0%, 0%, 0.66692) 34.8%,
    hsla(0, 0%, 0%, 0.58891) 40.6%,
    hsla(0, 0%, 0%, 0.50925) 46.2%,
    hsla(0, 0%, 0%, 0.42866) 51.7%,
    hsla(0, 0%, 0%, 0.34817) 57.2%,
    hsla(0, 0%, 0%, 0.2693) 62.8%,
    hsla(0, 0%, 0%, 0.19309) 68.7%,
    hsla(0, 0%, 0%, 0.12126) 75.2%,
    hsla(0, 0%, 0%, 0.05882) 82.6%,
    hsla(0, 0%, 0%, 0.01457) 91.2%,
    hsla(0, 0%, 0%, 0)
  );
}

.ease {
  background: linear-gradient(green, ease, red);
  /* => */
  background: linear-gradient(
    hsl(120, 100%, 25.1%),
    hsl(88.79, 100%, 24.28%) 7.8%,
    hsl(69.81, 100%, 23.14%) 13.2%,
    hsl(53.43, 100%, 24.55%) 17.6%,
    hsl(42.52, 100%, 28.9%) 21.7%,
    hsl(34.96, 100%, 32.64%) 25.8%,
    hsl(29.1, 100%, 35.96%) 30.2%,
    hsl(24.26, 100%, 38.94%) 35.1%,
    hsl(20.14, 100%, 41.56%) 40.6%,
    hsl(16.47, 100%, 43.87%) 46.9%,
    hsl(13.13, 100%, 45.83%) 54.1%,
    hsl(10.07, 100%, 47.42%) 62.2%,
    hsl(7.23, 100%, 48.62%) 71.1%,
    hsl(4.6, 100%, 49.43%) 80.6%,
    hsl(2.16, 100%, 49.87%) 90.5%,
    hsl(0, 100%, 50%)
  );
}

.steps {
  background: linear-gradient(to right, green, steps(4, skip-none), red);
  /* => */
  background: linear-gradient(
    to right,
    hsl(120, 100%, 25.1%),
    hsl(120, 100%, 25.1%) 25%,
    hsl(42.59, 100%, 28.87%) 25%,
    hsl(42.59, 100%, 28.87%) 50%,
    hsl(21.3, 100%, 40.82%) 50%,
    hsl(21.3, 100%, 40.82%) 75%,
    hsl(0, 100%, 50%) 75%,
    hsl(0, 100%, 50%)
  );
}

.radial {
  background: radial-gradient(circle at top right, red, ease-in-out, blue);
  /* => */
  background: radial-gradient(
    circle at top right,
    hsl(0, 100%, 50%),
    hsl(353.5, 100%, 49.71%) 7.7%,
    hsl(347.13, 100%, 48.89%) 14.8%,
    hsl(341.1, 100%, 47.69%) 21%,
    hsl(335.24, 100%, 46.22%) 26.5%,
    hsl(329.48, 100%, 44.57%) 31.4%,
    hsl(323.63, 100%, 42.76%) 35.9%,
    hsl(317.56, 100%, 40.82%) 40.1%,
    hsl(310.92, 100%, 38.7%) 44.2%,
    hsl(303.81, 100%, 36.49%) 48.1%,
    hsl(296, 100%, 36.55%) 52%,
    hsl(288.73, 100%, 38.81%) 56%,
    hsl(282.14, 100%, 40.92%) 60.1%,
    hsl(276.09, 100%, 42.84%) 64.3%,
    hsl(270.27, 100%, 44.64%) 68.8%,
    hsl(264.54, 100%, 46.28%) 73.7%,
    hsl(258.7, 100%, 47.74%) 79.2%,
    hsl(252.68, 100%, 48.92%) 85.4%,
    hsl(246.32, 100%, 49.72%) 92.5%,
    hsl(240, 100%, 50%)
  );
}
```

<br>

## Syntax

Currently a subset of the [full syntax](https://github.com/w3c/csswg-drafts/issues/1332#issuecomment-299990698) is supported:

```xml
linear-gradient(
  [ <direction>,]?
  <color>,
  <animation-timing-function>,
  <color>
)
```

The steps syntax is also being figured out and currently [this](https://github.com/w3c/csswg-drafts/issues/1680#issuecomment-361550637) is supported.

<br>

## Usage

```js
postcss([require('postcss-easing-gradients')])
```

See [PostCSS Usage](https://github.com/postcss/postcss#usage) docs for examples for your environment.

<br>

## Options

### colorStops: 15

is the default. A lower number creates a more "low poly" gradient with less code but a higher risk of banding.

### alphaDecimals: 5

is the default. A lower number can result in banding.

### colorMode: 'lrgb'

is the default color space used for interpolation and is closest to what most browsers use. Other options are `'rgb', 'hsl', 'lab' and 'lch'` as per [chromajs documentation](http://gka.github.io/chroma.js/#chroma-mix)

[ci-img]: https://img.shields.io/travis/larsenwork/postcss-easing-gradients.svg?branch=master&longCache=true&style=flat-square
[ci]: https://travis-ci.org/larsenwork/postcss-easing-gradients
[npm-img]: https://img.shields.io/npm/v/postcss-easing-gradients.svg?longCache=true&style=flat-square
[npm]: https://www.npmjs.com/package/postcss-easing-gradients
[dm-img]: https://img.shields.io/npm/dm/postcss-easing-gradients.svg?longCache=true&style=flat-square
[dpd-img]: https://img.shields.io/david/larsenwork/postcss-easing-gradients.svg?longCache=true&style=flat-square
[dpd]: https://david-dm.org/larsenwork/postcss-easing-gradients
[prt-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?longCache=true&style=flat-square
[prt]: https://github.com/prettier/prettier
[mit-img]: https://img.shields.io/github/license/larsenwork/postcss-easing-gradients.svg?longCache=true&style=flat-square
[mit]: https://github.com/larsenwork/postcss-easing-gradients/blob/master/LICENSE
[twt-img]: https://img.shields.io/twitter/follow/larsenwork.svg?label=follow+larsenwork&longCache=true&style=flat-square
[twt]: https://twitter.com/larsenwork
