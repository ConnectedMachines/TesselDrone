'use strict';

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      '**.spec.js'
    ],

    exclude: [
      'node_modules'
    ],

    browsers: [
      'PhantomJS'
    ],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-spec-reporter'
    ],

    reporters: ['spec']
  });
};