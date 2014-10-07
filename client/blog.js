angular.module('MadProps')

.config(function($stateProvider){
  $stateProvider
    .state('blog', {
      url: '/blog',
      templateUrl: 'blog.html'
    })
})