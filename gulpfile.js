'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var jshint = require('gulp-jshint');

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('lint', function(){
  return gulp.src('*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});