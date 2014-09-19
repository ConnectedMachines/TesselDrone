angular.module('MadProps')
  .directive('dronestatus', ['d3Service', function(d3Service){
    return {
      restrict: 'EA',
      scope: {},
      link: function(scope, element, attrs){
        d3Service.d3().then(function(d3){
          // create the svg element inside the container
          var svg = d3.select(element[0])
            .append('svg')
            .style('width', '100%');

          // browser onresize event
          window.onresize = function(){
            scope.$apply();
          };

          // watch for resize event
          scope.$watch(function(){
            return angular.element($window)[0].innerWidht;
          }, function(){
            scope.render(scope.data);
          });

          scope.render = function(data){
            // remove all previous items before render
            svg.selectAll('*').remove();

          };
        });
      }
    }
  }]);