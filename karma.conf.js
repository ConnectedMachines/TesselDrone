'use strict';

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    singleRun: true,
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'client/d3Angular.js',
      'client/app.js',
      'client/*.js',
      'client/*.spec.js'
    ],

    exclude: [
      'node_modules',
      'client/threejs_added.js'
    ],
    browsers: [
      'PhantomJS'
    ],
    plugins: [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-spec-reporter',
      'karma-coverage'
    ],
    reporters: ['spec', 'coverage'],
    preprocessors: { 'client/!(*spec).js': 'coverage' },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
      subdir: '.' // Output the results into ./coverage/
    }
  });
};
