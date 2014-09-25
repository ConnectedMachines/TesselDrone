'use strict'

angular.module('MadProps')
  .config(function($stateProvider){
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '../client/vizualizer.html'
      })
  });