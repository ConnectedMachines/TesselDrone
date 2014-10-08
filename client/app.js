angular.module('MadProps', ['ngAnimate', 'ngMaterial', 'ui.router', 'btford.socket-io', 'ngMorph'])

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

