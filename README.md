# Postcss Easing Gradients
PostCSS plugin to create smooth linear-gradients that approximate easing functions.

The syntax is `<type>-gradient([ <direction>,]? <start-color>, <stop-color>)` where
* `type` is one of the supported gradient types
* `direction` shares syntax with `linear-gradient` and is optional
* `start-color` and `stop-color` are css colors in any format

## Supported gradient types
```
ease-in-sine
ease-out-sine
ease-in-out-sine 
ease-in-quad
ease-out-quad
ease-in-out-quad
scrim
```
Note: Scrim is a custom easing inspired by Material Design text protection scrims

## Examples
```
#pcss
scrim-gradient(black, transparent)

ease-in-out-quad-gradient(to bottom left, #bada55, olive)

ease-in-sine-gradient(23deg, hsla(300, 80%, 50%, .7), rgb(120, 140, 255))
```
becomes
```
#css
linear-gradient(hsl(0, 0%, 0%) 0%, hsla(0, 0%, 0%, 0.86) 8.52%, hsla(0, 0%, 0%, 0.72) 17.53%, hsla(0, 0%, 0%, 0.58) 27.19%, hsla(0, 0%, 0%, 0.46) 36.28%, hsla(0, 0%, 0%, 0.36) 44.56%, hsla(0, 0%, 0%, 0.28) 51.97%, hsla(0, 0%, 0%, 0.21) 59.18%, hsla(0, 0%, 0%, 0.15) 66.33%, hsla(0, 0%, 0%, 0.1) 73.39%, hsla(0, 0%, 0%, 0.06) 80.36%, hsla(0, 0%, 0%, 0.03) 87.18%, hsla(0, 0%, 0%, 0.01) 93.73%, hsla(0, 0%, 0%, 0) 100%)

linear-gradient(to bottom left, hsl(74, 64%, 59%) 0%, hsl(74, 64%, 59%) 6.667%, hsl(74, 62%, 58%) 13.333%, hsl(73, 60%, 57%) 20%, hsl(72, 57%, 55%) 26.667%, hsl(71, 54%, 52%) 33.333%, hsl(70, 53%, 48%) 40%, hsl(68, 58%, 44%) 46.667%, hsl(66, 64%, 40%) 53.333%, hsl(65, 70%, 36%) 60%, hsl(63, 77%, 33%) 66.667%, hsl(62, 84%, 30%) 73.333%, hsl(61, 90%, 28%) 80%, hsl(61, 95%, 26%) 86.667%, hsl(60, 98%, 25%) 93.333%, hsl(60, 100%, 25%) 100%)

linear-gradient(23deg, hsla(300, 80%, 50%, 0.7) 0%, hsla(300, 80%, 50%, 0.7) 6.667%, hsla(299, 80%, 50%, 0.71) 13.333%, hsla(298, 80%, 51%, 0.71) 20%, hsla(297, 81%, 52%, 0.73) 26.667%, hsla(295, 81%, 54%, 0.74) 33.333%, hsla(292, 82%, 55%, 0.76) 40%, hsla(289, 82%, 57%, 0.78) 46.667%, hsla(285, 83%, 59%, 0.8) 53.333%, hsla(280, 85%, 61%, 0.82) 60%, hsla(275, 86%, 64%, 0.85) 66.667%, hsla(268, 88%, 66%, 0.88) 73.333%, hsla(261, 90%, 69%, 0.91) 80%, hsla(252, 93%, 72%, 0.94) 86.667%, hsla(242, 96%, 75%, 0.97) 93.333%, hsla(231, 100%, 74%, 1) 100%)
```

## Demo
You can try it out by running `npm install` and `gulp` in the demo folder. 

This is how the scrim-gradient looks: 

![compare](https://github.com/larsenwork/postcss-easing-gradients/blob/master/demo/compare.png?raw=true)
