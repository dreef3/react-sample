var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('jscs', function() {
    gulp.src('src/**/*.{js,jsx}')
        .pipe($.jscs({fix: true, esnext: true}))
        .pipe(gulp.dest('src/'))
});
