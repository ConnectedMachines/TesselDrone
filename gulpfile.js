'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');
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

// *********
// * TESTS *
// *********
gulp.task('test', ['karma', 'mocha', 'coveralls'])

gulp.task('karma', function (done) {
  karma.start({
    // Import Karma with settings from karma.conf.js.
    configFile: __dirname + '/karma.conf.js'
    // Make Karma exit after tests finish.
  }, done);
});

// Test Tessel code with Mocha!
gulp.task('mocha', function(){
    return gulp.src('', {read:false})
    .pipe(shell('../node_modules/.bin/istanbul cover ../node_modules/.bin/_mocha --dir ../coverage/tessel --report json -- -u exports -R spec'
      , {cwd:'tessel'}));
});

gulp.task('coveralls', ['mocha', 'karma'], function(){ // Note: mocha and karma are dependency tasks.
  // Send results of istanbul's test coverage to coveralls.io.
  return gulp.src('', {read: false}) // You have to give it a file, but you don't have to read it.
    .pipe(shell('node_modules/.bin/istanbul report --lcov')) // generate lcov report from istanbul json
    .pipe(shell('cat coverage/lcov.info | node_modules/.bin/coveralls'));
});
// *************
// * END TESTS *
// *************

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
