'use strict';

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    singleRun: true,
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-morph/dist/angular-morph.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-material/angular-material.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-socket-io/socket.js',
      'bower_components/angular-socket-io/mock/socket-io.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'client/d3Angular.js',
      'client/app.js',
      'client/*.js',
      'client/drone_control/*.js'
    ],

    // port: 3000,

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
    preprocessors: { 
      'client/!(*spec).js': 'coverage',
      'client/drone_control/!(*spec).js': 'coverage'
     },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
      subdir: '.' // Output the results into ./coverage/
    }
  });
};
