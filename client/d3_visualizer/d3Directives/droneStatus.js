angular.module('MadProps')
  .directive('dronestatus', ['$window', function($window){
    return {
      restrict: 'EA',
      link: function(scope, element, attrs){
          // declare vars
          var svg, arms, propOutline, board;
          var propellerData, armData, propOutlineData, prop1_outlineArrowsPathData, prop2_outlineArrowsPathData, prop3_outlineArrowsPathData, prop4_outlineArrowsPathData, boardPathData;

          // create the svg element inside the container
          var context = {
            width: $window.innerWidth/2 - 200,// these values are the same for a reason
            height: $window.innerWidth/2 - 200// NOT an error. They were given different names to make forming the data easier
          }

          var prop1_isActive = false;
          var prop2_isActive = false;
          var prop3_isActive = false;
          var prop4_isActive = false;

          var windowResize = function(){
            $window.addEventListener('resize', function(){
              context.width = $window.innerWidth/2 - 200;
              context.height = $window.innerWidth/2 - 200;

              init();
            }, false);            
          }
          windowResize();
          init();

          function init(){
            propellerData = [
              {
                id: 0,
                pos: [context.width*(1/2),context.height*(1/8)],
                radius: 40,
                color: '#707070'
              },
              {
                id: 1,
                pos: [context.width*(1/8),context.height*(1/2)],
                radius: 40,
                color: '#707070'
              },
              {
                id: 2,
                pos: [context.width*(7/8),context.height*(1/2)],
                radius: 40,
                color: '#707070'
              },
              {
                id: 3,
                pos: [context.width*(1/2),context.height*(7/8)],
                radius: 40,
                color: '#707070'
              }
            ];

            armData = [
              {
                pos: [context.width*(1/2)-10,context.height*(1/8)],
                dim: [20,context.height*(3/4)],
                color: 'Black'
              },
              {
                pos: [context.width*(1/8),context.height*(1/2)-10],
                dim: [context.width*(3/4),20],
                color: 'Black'
              }
            ];

            propOutlineData = [
              {
                id: 0,
                pos: [context.width*(1/2),context.height*(1/8)],
                radius: 50,
                color: 'Black'
              },
              {
                id: 1,
                pos: [context.width*(1/8),context.height*(1/2)],
                radius: 50,
                color: 'Black'
              },
              {
                id: 2,
                pos: [context.width*(7/8),context.height*(1/2)],
                radius: 50,
                color: 'Black'
              },
              {
                id: 3,
                pos: [context.width*(1/2),context.height*(7/8)],
                radius: 50,
                color: 'Black'
              }
            ];

            prop1_outlineArrowsPathData = [
              // clockwise arrows
              {
                origin: ''+context.width*(1/2)+' '+context.height*(1/8),
                rotation: 0,
                points: ''+(context.width*(1/2)+30)+','+(context.height*(1/8)-10)+' '+(context.width*(1/2)+60)+','+(context.height*(1/8)-10)+' '+(context.width*(1/2)+45)+','+(context.height*(1/8)+10),
                strokeColor: 'Black',
                strokeWidth: 4,
                color: '#4285f4'
              },
              {
                origin: ''+context.width*(1/2)+' '+context.height*(1/8),
                rotation: 0,
                points: ''+(context.width*(1/2)-30)+','+(context.height*(1/8)+10)+' '+(context.width*(1/2)-60)+','+(context.height*(1/8)+10)+' '+(context.width*(1/2)-45)+','+(context.height*(1/8)-10),
                strokeColor: 'Black',
                strokeWidth: 4,
                color: '#4285f4'
              }
            ];

            prop2_outlineArrowsPathData = [
              // counterclockwise arrows
              {
                origin: ''+context.width*(1/8)+' '+context.height*(1/2),
                rotation: 0,
                points: ''+(context.width*(1/8)-10)+','+(context.height*(1/2)+30)+' '+(context.width*(1/8)-10)+','+(context.height*(1/2)+60)+' '+(context.width*(1/8)+10)+','+(context.height*(1/2)+45),
                strokeColor: 'Black',
                strokeWidth: 4,
                color: '#4285f4'
              },
              {
                origin: ''+context.width*(1/8)+' '+context.height*(1/2),
                rotation: 0,
                points: ''+(context.width*(1/8)+10)+','+(context.height*(1/2)-30)+' '+(context.width*(1/8)+10)+','+(context.height*(1/2)-60)+' '+(context.width*(1/8)-10)+','+(context.height*(1/2)-45),
                strokeColor: 'Black',
                strokeWidth: 4,
                color: '#4285f4'
              }
            ];

            prop3_outlineArrowsPathData = [
              // clockwise arrows
              {
                origin: ''+context.width*(1/2)+' '+context.height*(7/8),
                rotation: 0,
                points: ''+(context.width*(1/2)+30)+','+(context.height*(7/8)-10)+' '+(context.width*(1/2)+60)+','+(context.height*(7/8)-10)+' '+(context.width*(1/2)+45)+','+(context.height*(7/8)+10),
                strokeColor: 'Black',
                strokeWidth: 4,
                color: '#4285f4'
              },
              {
                origin: ''+context.width*(1/2)+' '+context.height*(7/8),
                rotation: 0,
                points: ''+(context.width*(1/2)-30)+','+(context.height*(7/8)+10)+' '+(context.width*(1/2)-60)+','+(context.height*(7/8)+10)+' '+(context.width*(1/2)-45)+','+(context.height*(7/8)-10),
                strokeColor: 'Black',
                strokeWidth: 4,
                color: '#4285f4'
              }
            ];

            prop4_outlineArrowsPathData = [
              // counterclockwise arrows
              {
                origin: ''+context.width*(7/8)+' '+context.height*(1/2),
                rotation: 0,
                points: ''+(context.width*(7/8)-10)+','+(context.height*(1/2)+30)+' '+(context.width*(7/8)-10)+','+(context.height*(1/2)+60)+' '+(context.width*(7/8)+10)+','+(context.height*(1/2)+45),
                strokeColor: 'Black',
                strokeWidth: 4,
                color: '#4285f4'
              },
              {
                origin: ''+context.width*(7/8)+' '+context.height*(1/2),
                rotation: 0,
                points: ''+(context.width*(7/8)+10)+','+(context.height*(1/2)-30)+' '+(context.width*(7/8)+10)+','+(context.height*(1/2)-60)+' '+(context.width*(7/8)-10)+','+(context.height*(1/2)-45),
                strokeColor: 'Black',
                strokeWidth: 4,
                color: '#4285f4'
              }
            ];

            boardPathData = [
              {
                points: ''+(context.width*(1/2))+','+(context.height*(3/8))+' '+(context.width*(1/2)-30)+','+(context.height*(1/2)-30)+' '+(context.width*(1/2)-30)+','+(context.height*(1/2)+30)+' '+(context.width*(1/2)+30)+','+(context.height*(1/2)+30)+' '+(context.width*(1/2)+30)+','+(context.height*(1/2)-30),
                strokeColor: 'Black',
                strokeWidth: 1,
                color: 'Black'
              }
            ];

            d3.select('svg').remove();
            
            svg = d3.select(element[0])
              .append('svg')
              .style('width', ''+context.width+'px')
              .style('height', ''+context.height+'px');

            arms = svg.selectAll('rect')
              .data(armData)
              .enter()
              .append('rect')
              .attr('x', function(d){ return d.pos[0] })
              .attr('y', function(d){ return d.pos[1] })
              .attr('width', function(d){ return d.dim[0] })
              .attr('height', function(d){ return d.dim[1] })
              .attr('fill', function(d){ return d.color });

            propOutline = svg.selectAll('.outline')
              .data(propOutlineData)
              .enter()
              .append('circle')
              .classed('outline', true)
              .attr('cx', function(d){ return d.pos[0] })
              .attr('cy', function(d){ return d.pos[1] })
              .attr('r', function(d){ return d.radius })
              .style('fill', function(d){ return d.color });

            board = svg.selectAll('.board')
              .data(boardPathData)
              .enter()
              .append('polygon')
              .attr('points', function(d){ return d.points })
              .attr('stroke', function(d){ return d.strokeColor })
              .attr('stroke-width', function(d){ return d.strokeWidth })
              .attr('fill', function(d){ return d.color });

            renderPropellers();
            renderArrows();
          }

          function renderPropellers(){
            var propellers = svg.selectAll('.propellers');

            if(!propellers[0].length){
              propellers
                .data(propellerData)
                .enter()
                .append('circle')
                .classed('propellers', true)
                .attr('cx', function(d){ return d.pos[0] })
                .attr('cy', function(d){ return d.pos[1] })
                .attr('r', function(d){ return d.radius })
                .style('fill', function(d){ return d.color });

            }else{
              propellers
                .data(propellerData)
                .transition()
                .style('fill', function(d){ return d.color });

            }
          }

          function renderArrows(){
            var prop1_outlineArrows = svg.selectAll('.prop1_arrows');
            var prop2_outlineArrows = svg.selectAll('.prop2_arrows');
            var prop3_outlineArrows = svg.selectAll('.prop3_arrows');
            var prop4_outlineArrows = svg.selectAll('.prop4_arrows');

            if(!prop1_outlineArrows[0].length){
              prop1_outlineArrows
                .data(prop1_outlineArrowsPathData)
                .enter()
                .append('polygon')
                .classed('prop1_arrows', true)
                .attr('points', function(d){ return d.points })
                .attr('stroke', function(d){ return d.strokeColor })
                .attr('stroke-width', function(d){ return d.strokeWidth })
                .attr('fill', function(d){ return d.color })
                .style('transform-origin', function(d){ return d.origin })
                .style('transform', function(d){ return 'rotate('+d.rotation+'deg)'});

              prop2_outlineArrows
                .data(prop2_outlineArrowsPathData)
                .enter()
                .append('polygon')
                .classed('prop2_arrows', true)
                .attr('points', function(d){ return d.points })
                .attr('stroke', function(d){ return d.strokeColor })
                .attr('stroke-width', function(d){ return d.strokeWidth })
                .attr('fill', function(d){ return d.color })
                .style('transform-origin', function(d){ return d.origin })
                .style('transform', function(d){ return 'rotate('+d.rotation+'deg)'});

              prop3_outlineArrows
                .data(prop3_outlineArrowsPathData)
                .enter()
                .append('polygon')
                .classed('prop3_arrows', true)
                .attr('points', function(d){ return d.points })
                .attr('stroke', function(d){ return d.strokeColor })
                .attr('stroke-width', function(d){ return d.strokeWidth })
                .attr('fill', function(d){ return d.color })
                .style('transform-origin', function(d){ return d.origin })
                .style('transform', function(d){ return 'rotate('+d.rotation+'deg)'});

              prop4_outlineArrows
                .data(prop4_outlineArrowsPathData)
                .enter()
                .append('polygon')
                .classed('prop4_arrows', true)
                .attr('points', function(d){ return d.points })
                .attr('stroke', function(d){ return d.strokeColor })
                .attr('stroke-width', function(d){ return d.strokeWidth })
                .attr('fill', function(d){ return d.color })
                .style('transform-origin', function(d){ return d.origin })
                .style('transform', function(d){ return 'rotate('+d.rotation+'deg)'});

            }else{
              prop1_outlineArrows
                .data(prop1_outlineArrowsPathData)
                .transition()
                .style('transform', function(d){ return 'rotate('+d.rotation+'deg)'});

              prop2_outlineArrows
                .data(prop2_outlineArrowsPathData)
                .transition()
                .style('transform', function(d){ return 'rotate('+d.rotation+'deg)'});

              prop3_outlineArrows
                .data(prop3_outlineArrowsPathData)
                .transition()
                .style('transform', function(d){ return 'rotate('+d.rotation+'deg)'});

              prop4_outlineArrows
                .data(prop4_outlineArrowsPathData)
                .transition()
                .style('transform', function(d){ return 'rotate('+d.rotation+'deg)'});

            }
          }

          var renderLoop = function(){
            if(document.getElementsByTagName('dronestatus').length){
              requestAnimationFrame(renderLoop);
            }

            // rotate outline arrows
            if(prop1_isActive){
              if(prop1_outlineArrowsPathData[0].rotation < 356){
                prop1_outlineArrowsPathData[0].rotation += 4;
                prop1_outlineArrowsPathData[1].rotation += 4;
              }else{
                prop1_outlineArrowsPathData[0].rotation = 0;
                prop1_outlineArrowsPathData[1].rotation = 0;
              }
            }
            if(prop2_isActive){
              if(prop2_outlineArrowsPathData[0].rotation > -356){
                prop2_outlineArrowsPathData[0].rotation -= 4;
                prop2_outlineArrowsPathData[1].rotation -= 4;
              }else{
                prop2_outlineArrowsPathData[0].rotation = 0;
                prop2_outlineArrowsPathData[1].rotation = 0;
              }
            }
            if(prop3_isActive){
              if(prop3_outlineArrowsPathData[0].rotation < 356){
                prop3_outlineArrowsPathData[0].rotation += 4;
                prop3_outlineArrowsPathData[1].rotation += 4;
              }else{
                prop3_outlineArrowsPathData[0].rotation = 0;
                prop3_outlineArrowsPathData[1].rotation = 0;
              }
            }
            if(prop4_isActive){
              if(prop4_outlineArrowsPathData[0].rotation > -356){
                prop4_outlineArrowsPathData[0].rotation -= 4;
                prop4_outlineArrowsPathData[1].rotation -= 4;
              }else{
                prop4_outlineArrowsPathData[0].rotation = 0;
                prop4_outlineArrowsPathData[1].rotation = 0;
              }
            }
            renderArrows();
          }
          renderLoop();

          // flag to trigger data manipulation in the controller
          scope.d3VisualizerIsLoaded = true;
          scope.renderEngine1 = function(hexColor, active){
            propellerData[0].color = hexColor;
            prop1_isActive = active;
            renderPropellers();
          };
          scope.renderEngine2 = function(hexColor, active){
            propellerData[1].color = hexColor;
            prop2_isActive = active;
            renderPropellers();
          };
          scope.renderEngine3 = function(hexColor, active){
            propellerData[2].color = hexColor;
            prop3_isActive = active;
            renderPropellers();
          };
          scope.renderEngine4 = function(hexColor, active){
            propellerData[3].color = hexColor;
            prop4_isActive = active;
            renderPropellers();
          };
      }
    }
  }]);
