var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('scripts', function(){
    return gulp.src([
      'public/javascript/jquery.min.js',
      'public/javascript/angular.js',
      'public/javascript/angular-autocomplete.js',
      'public/javascript/angular-datepicker.js',
      'public/javascript/angular-moment.min.js',
      'public/javascript/angular-router.min.js',
      'public/javascript/angular-tooltips.js',
      'public/javascript/moment.min.js',
      'public/javascript/controller.js',
      'public/javascript/global.js'
    ])
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist'));
});
