const browserSync    = require('browser-sync').create();
const gulp           = require('gulp');
const gulpPostcss    = require('gulp-postcss');
const gulpRename     = require('gulp-rename');
const easingGradient = require('postcss-easing-gradients');

const paths = {
  base: './',
  styles: {
    src: './css/*.pcss',
    dest: './css'
  },
  html: {
    src: './*.html'
  }
};

function serve(done) {
  browserSync.init({
    server: { baseDir: paths.base },
    open: false
  });
  done();
};

function reload(done) {
  browserSync.reload();
  done();
};

function watch() {
  gulp.watch(paths.styles.src, gulp.series(css, reload));
  gulp.watch(paths.html.src).on('change', browserSync.reload);
};

function css() {
  return gulp
    .src(paths.styles.src)
    .pipe(gulpPostcss([easingGradient]))
    .pipe(gulpRename({extname: '.css'}))
    .pipe(gulp.dest(paths.styles.dest));
};

gulp.task('default', gulp.series(css, serve, watch));

gulp.task('style', gulp.series(css));
