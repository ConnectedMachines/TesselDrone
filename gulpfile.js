'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var jshint = require('gulp-jshint');

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
