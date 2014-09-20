angular.module('MadProps')
  .directive('dronestatus', ['d3Service', '$window', function(d3Service, $window){
    return {
      restrict: 'EA',
      // scope: {},
      link: function(scope, element, attrs){
        d3Service.d3().then(function(d3){
          // create the svg element inside the container
          scope.propellerData = [
            {
              id: 0,
              pos: [200,50],
              radius: 40,
              color: 'Green'
            },
            {
              id: 1,
              pos: [50,200],
              radius: 40,
              color: 'Green'
            },
            {
              id: 2,
              pos: [350,200],
              radius: 40,
              color: 'Green'
            },
            {
              id: 3,
              pos: [200,350],
              radius: 40,
              color: 'Green'
            }
          ];

          var armData = [
            {
              pos: [190,50],
              dim: [20,300],
              color: 'Black'
            },
            {
              pos: [50,190],
              dim: [300,20],
              color: 'Black'
            }
          ];

          var svg = d3.select(element[0])
            .append('svg')
            .style('width', '400px')
            .style('height', '400px');

          var arms = svg.selectAll('rect')
            .data(armData)
            .enter()
            .append('rect')
            .attr('x', function(d){ return d.pos[0] })
            .attr('y', function(d){ return d.pos[1] })
            .attr('width', function(d){ return d.dim[0] })
            .attr('height', function(d){ return d.dim[1] })
            .attr('fill', function(d){ return d.color });

          scope.renderPropellers = function(){
            var propellers = svg.selectAll('circle');
            if(!propellers[0].length){
              svg.selectAll('circle')
                .data(scope.propellerData)
                .enter()
                .append('circle')
                .attr('cx', function(d){ return d.pos[0] })
                .attr('cy', function(d){ return d.pos[1] })
                .attr('r', function(d){ return d.radius })
                .style('fill', function(d){ return d.color });
            }else{
              svg.selectAll('circle')
                .data(scope.propellerData)
                .transition()
                .duration(500)
                .style('fill', function(d){ return d.color });
            }
          }
          scope.renderPropellers();

          // flag to trigger data manipulation in the controller
          scope.visualizationIsLoaded = true;
        });
      }
    }
  }]);