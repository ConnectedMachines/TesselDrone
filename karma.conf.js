'use strict';

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    singleRun: true,
    files: [
      'bower_components/angular/angular.js',
      'client/d3Angular.js',
      'client/app.js',
      '**/**.spec.js'
    ],

    exclude: [
      'node_modules'
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
    preprocessors: { '!(*spec).js': 'coverage' },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
      subdir: '.' // Output the results into ./coverage/
    }
  });
};
