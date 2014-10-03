'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var coveralls = require('gulp-coveralls');

gulp.task('default', ['lint', 'test', 'css']);

gulp.task('lint', function(){
  return gulp.src('*.js')
    .pipe(jshint())
    // Use a stylish lint report.
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['karma', 'coveralls']);
gulp.task('karma', function (done) {
  karma.start({
    // Import Karma with settings from karma.conf.js.
    configFile: __dirname + '/karma.conf.js',
    // Make Karma exit after tests finish.
  }, done);
});
gulp.task('coveralls', function(){
  // Send results of istanbul's test coverage to coveralls.io.
  gulp.src('test/coverage/**/lcov.info')
    .pipe(coveralls());
});

// CSS from Stylus.js (minified & concated too!).
gulp.task('css', function(){
  gulp.src(['**/*.styl', '!node_modules/**'])
    .pipe(stylus())
    .pipe(concat('app.cat.css'))
    .pipe(minifyCSS())
    .pipe(rename('app.min.cat.css'))
    .pipe(gulp.dest('dist'));
});

// Runs Tessel code.
gulp.task('tessel', function(){
  return gulp.src([
      'tessel/irisMotorTest.js'])
    .pipe(shell([
      'tessel run <%= file.path %>'
      ], {cwd:'tessel'}));
});
// Check out how this uses paths: 
// https://github.com/sun-zheng-an/gulp-shell/blob/master/gulpfile.js
