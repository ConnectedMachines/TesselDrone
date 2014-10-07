angular.module('MadProps', ['ngAnimate', 'ngMaterial', 'ui.router', 'THREE', 'd3', 'btford.socket-io'])

  .config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider
  })

  .controller('AppController', function(){
    
  })

  .factory('socket', function (socketFactory) {
    var socket = socketFactory();
    socket.forward('droneData');
    return socket;
  });

