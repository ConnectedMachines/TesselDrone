'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('default', ['lint', 'test', 'css']);

gulp.task('lint', function(){
  return gulp.src('*.js')
    .pipe(jshint())
    // Use a stylish lint report.
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', function (done) {
  karma.start({
    // Import Karma with settings from karma.conf.js.
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

// CSS from Stylus.js (minified & concated too!).
gulp.task('css', function(){
  gulp.src(['**/*.styl', '!node_modules/**'])
    .pipe(stylus())
    .pipe(concat('app.cat.css'))
    .pipe(minifyCSS())
    .pipe(rename('app.min.cat.css'))
    .pipe(gulp.dest('dist'))
});
