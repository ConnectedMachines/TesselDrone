angular.module('MadProps', ['ngAnimate', 'ngMaterial', 'ui.router', 'THREE', 'd3', 'btford.socket-io', 'ngMorph'])

  .config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.when('', '/');
  })

  .controller('AppController', function(){
    
  })

  .factory('socket', function (socketFactory) {
    var socket = socketFactory();
    socket.forward('droneData');
    return socket;
  });

