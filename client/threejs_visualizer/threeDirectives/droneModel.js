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
          var assetLoader = function(context, options, callback){
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
              if(callback){
                callback();
              }
            });
            loader.load(options.pathURL);
          }

          {/************ 3D Workspace upper edge ******************/
            var matteBlue = new THREE.MeshLambertMaterial({color: 0x0000ff});
            var matteRed = new THREE.MeshLambertMaterial({color: 0xff0000});
            var matteGreen = new THREE.MeshLambertMaterial({color: 0x00ff00});

            var loadComplete = false;
            var drone = new THREE.Object3D();
                // load frame
                assetLoader(drone, {
                  material: matteBlue,
                  pathURL: 'assets/diy_mini_quad_v3_one_piece.stl',
                  scale: 0.5,
                  position: [0,0,0],
                  rotation: [
                    THREE.Math.degToRad(90),// x
                    THREE.Math.degToRad(0), // y
                    THREE.Math.degToRad(0)  // z
                  ]
                });

                // create template engine with left prop
                var engineTemplate_L = new THREE.Object3D();
                    // load motor
                    assetLoader(engineTemplate_L, {
                      material: matteGreen,
                      pathURL: 'assets/N5065_Motor.stl',
                      scale: 3,
                      position: [0,0,0],
                      rotation: [
                        THREE.Math.degToRad(90),// x
                        THREE.Math.degToRad(0), // y
                        THREE.Math.degToRad(0)  // z
                      ]
                    });

                    // load left prop
                    assetLoader(engineTemplate_L, {
                      material: matteRed,
                      pathURL: 'assets/prop_left.stl',
                      scale: 0.5,
                      position: [0,13.5,0],
                      rotation: [
                        THREE.Math.degToRad(90),// x
                        THREE.Math.degToRad(0), // y
                        THREE.Math.degToRad(0)  // z
                      ]
                    });

                // create template engine with right prop
                var engineTemplate_R = new THREE.Object3D();
                    // load motor
                    assetLoader(engineTemplate_R, {
                      material: matteGreen,
                      pathURL: 'assets/N5065_Motor.stl',
                      scale: 3,
                      position: [0,0,0],
                      rotation: [
                        THREE.Math.degToRad(90),// x
                        THREE.Math.degToRad(0), // y
                        THREE.Math.degToRad(0)  // z
                      ]
                    });

                    // load right prop
                    assetLoader(engineTemplate_R, {
                      material: matteRed,
                      pathURL: 'assets/prop_right.stl',
                      scale: 0.5,
                      position: [0,13.5,0],
                      rotation: [
                        THREE.Math.degToRad(90),// x
                        THREE.Math.degToRad(0), // y
                        THREE.Math.degToRad(0)  // z
                      ]
                    });

            
          }/************ 3D Workspace lower edge ******************/

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
