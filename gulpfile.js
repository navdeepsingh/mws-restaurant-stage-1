/* File: gulpfile.js */

// grab our gulp packages
const gulp = require('gulp'),
      csso = require('gulp-csso')
      uglify = require('gulp-uglify-es').default;

gulp.task('build-css', function() {
  return gulp.src('source/css/*.css')
    .pipe(csso())
    .pipe(gulp.dest('public/css'));
});

gulp.task('build-js', function () {
  return gulp.src('source/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('watch', function() {
  gulp.watch('source/css/*.css', ['build-css']);
  gulp.watch('source/js/*.js', ['build-js']);
});

// create a default task and just log a message
gulp.task('default', ['watch']);
