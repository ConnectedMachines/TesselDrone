angular.module('MadProps')

.config(function($stateProvider){
  $stateProvider
    .state('about', {
      url: '/about',
      templateUrl: '/client/about.html'
    })
})

.controller('cardController', function ($scope) {
 $scope.settings = {
   closeEl: '.close',
   overlay: {
     templateUrl: './assets/networkdiagram.html',
     scroll: false
   }
 }
});