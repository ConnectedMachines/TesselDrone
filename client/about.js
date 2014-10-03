angular.module('MadProps')

.config(function($stateProvider){
  $stateProvider
    .state('about', {
      url: '/about',
      templateUrl: '/client/about.html'
    })
})