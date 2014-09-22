angular.module('MadProps')
  .directive('dronemodel', ['threeService', '$window', function(threeService, $window){
    return {
      restrict: 'EA',
      link: function(scope, element, attrs){
        threeService.THREE().then(function(THREE){
          /************************************************************
          THREEjs setup 
          ************************************************************/
          var context = document.getElementsByTagName('dronemodel')[0];
          var width = height = 500;
          var scene = new THREE.Scene();
          var camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1500);
          var renderer = new THREE.WebGLRenderer();
          renderer.setSize(width, height);
          context.appendChild(renderer.domElement);

          // create colored background skybox                                 edit this to change color: 0x######
          //scene.add( new THREE.Mesh(new THREE.BoxGeometry(20,20,20), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BackSide})) );
          // create ambient skylight
          scene.add( new THREE.HemisphereLight(0xffffff,0xffffff,0.25));
          var light = new THREE.PointLight(0xffffff, 0.75, 100);
          light.position.set(0,100,0);
          scene.add(light);

          // move camera towards screen to [0,0,100]
          camera.position.z = 100;

          /******************************************************
          loader

          example options:
            {
              material: 
              pathURL: './assets/N5065_Motor.stl',
              scale: 1,
              position: [x,y,z],
              rotation: [x,y,z]
            }

          ******************************************************/
          var assetLoader = function(context, options){
            var loader = new THREE.STLLoader();
            loader.addEventListener('load', function(event){
              var geometry = event.content;
              var model = new THREE.Mesh(geometry, options.material);
              
              if(options.position){
                model.position.fromArray(options.position);
              }
              if(options.rotation){
                model.rotation.fromArray(options.rotation);
              }
              if(options.scale){
                model.scale.fromArray([options.scale,options.scale,options.scale]);
              }

              context.add(model);
            });
            loader.load(options.pathURL);
          }

          // the render loop
          var render = function () {
            requestAnimationFrame(render);

            renderer.render(scene, camera);
          };
          // kickoff render loop
          render();
          console.log(context);
        });
      }
    }
  }]);
