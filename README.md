# Postcss Easing Gradients
PostCSS plugin to create smooth linear-gradients that approximate easing functions.

The syntax is `<type>-gradient([ <direction>,]? <start-color>, <stop-color>)` where
* `type` is `ease-in-sine, ease-out-sine, ease-in-out-sine, ease-in-quad, ease-out-quad, ease-in-out-quad, scrim` 
* `direction` shares syntax with `linear-gradient` and is optional
* `start-color` and `stop-color` are css colors in any format

Note: Scrim is a custom easing inspired by Material Design text protection scrims

## Examples
```
#pcss
.a { background-image: scrim-gradient(black, transparent); }
.b { background-image: ease-in-out-quad-gradient(to bottom left, pink, purple); }
```
becomes
```
#css
.a { background-image: linear-gradient(hsl(0, 0%, 0%) 0%, hsla(0, 0%, 0%, 0.86) 8.52%, hsla(0, 0%, 0%, 0.72) 17.53%, hsla(0, 0%, 0%, 0.58) 27.19%, hsla(0, 0%, 0%, 0.46) 36.28%, hsla(0, 0%, 0%, 0.36) 44.56%, hsla(0, 0%, 0%, 0.28) 51.97%, hsla(0, 0%, 0%, 0.21) 59.18%, hsla(0, 0%, 0%, 0.15) 66.33%, hsla(0, 0%, 0%, 0.1) 73.39%, hsla(0, 0%, 0%, 0.06) 80.36%, hsla(0, 0%, 0%, 0.03) 87.18%, hsla(0, 0%, 0%, 0.01) 93.73%, hsla(0, 0%, 0%, 0) 100%); }
.b { background-image: linear-gradient(to bottom left, hsl(350, 100%, 88%) 0%, hsl(349, 97%, 87%) 6.667%, hsl(346, 88%, 85%) 13.333%, hsl(342, 77%, 83%) 20%, hsl(337, 67%, 79%) 26.667%, hsl(331, 58%, 74%) 33.333%, hsl(325, 51%, 68%) 40%, hsl(319, 45%, 60%) 46.667%, hsl(314, 41%, 52%) 53.333%, hsl(309, 47%, 45%) 60%, hsl(306, 57%, 39%) 66.667%, hsl(304, 68%, 34%) 73.333%, hsl(302, 80%, 30%) 80%, hsl(301, 90%, 27%) 86.667%, hsl(300, 97%, 26%) 93.333%, hsl(300, 100%, 25%) 100%); }
```

## Demo
You can try it out by running `npm install` and `gulp` in the demo folder. 

This is how the scrim-gradient looks: 

![compare](https://github.com/larsenwork/postcss-easing-gradients/blob/master/demo/compare.png?raw=true)
