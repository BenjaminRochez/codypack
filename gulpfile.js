var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var autoprefixer = require ('gulp-autoprefixer');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');


gulp.task('serve', ['sass', 'compress'], function() {
  browserSync.init({
    proxy: "localhost"
  });
  gulp.watch("scss/**/*.scss", ['sass']);
  gulp.watch("js/dev/**/*.js", ['compress']);
  gulp.watch("*.php").on('change', browserSync.reload);
});


gulp.task('sass', function() {
  return gulp.src("scss/**/*.scss")
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', function(err) {
    notify({
      title: 'Wow a css bug'
    }).write(err.line + ': ' + err.message);
    return this.emit('end');
  }))
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(autoprefixer({browsers: ["ie >= 9", "ie_mob >= 10", "ff >= 30", "chrome >= 34", "safari >= 7",  "opera >= 23", "ios >= 7", "android >= 4.4", "bb >= 10"],cascade: false}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(""))
  .pipe(browserSync.stream());
});

gulp.task('compress', function () {
  return gulp.src(['js/dev/first/*.js', 'js/dev/modules/*.js', 'js/dev/app/*.js'])
    .pipe(concat('final.js'))
    .pipe(uglify().on('error', function(err) {
      notify({
        title: 'Wow a js bug'
      }).write(err.line + ': ' + err.message);
      return this.emit('end');
    }))
    .pipe(gulp.dest('js/'));
});


gulp.task('default', ['serve']);
