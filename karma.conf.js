'use strict';

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    singleRun: true,
    files: [
      'app.js',
      '*.spec.js',
      './tessel/*.spec.js',
    ],
    browsers: [
      'PhantomJS'
    ],
    plugins: [
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
