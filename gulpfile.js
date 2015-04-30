var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('scripts:fix', function() {
    gulp.src('src/**/*.js')
        .pipe($.fixmyjs())
        .pipe(gulp.dest('src/'))
});
