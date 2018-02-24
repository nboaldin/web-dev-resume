'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');


gulp.task('concatScripts', function() {
  gulp.src([
    'js/hamburger.js',
  ]).pipe(concat('app.js')).pipe(gulp.dest('public/js'));
});

gulp.task('minifyScripts', () => {
  gulp.src('js/app.js')
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('compileSass', () => {
  gulp.src('scss/application.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/stylesheets'));
});
