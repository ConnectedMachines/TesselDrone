angular.module('MadProps', ['ngAnimate', 'ngMaterial', 'ui.router'])

  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $urlRouterProvider
      // .otherwise('/');
    // $locationProvider.html5Mode(true); 

  })

  .controller('AppController', function(){
    
  })