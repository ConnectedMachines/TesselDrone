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
          var camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
          var renderer = new THREE.WebGLRenderer();
          renderer.setSize(width, height);
          context.appendChild(renderer.domElement);

          // create colored background skybox                                 edit this to change color: 0x######
          scene.add( new THREE.Mesh(new THREE.BoxGeometry(200,200,200), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BackSide})) );
          // create ambient skylight
          scene.add( new THREE.HemisphereLight(0xffffff,0xffffff,0.45));
          var light = new THREE.PointLight(0xffffff, 0.75, 200);
          light.position.set(0,100,0);
          scene.add(light);

          // move camera towards screen to [0,0,100]
          camera.position.z = 150;

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
              if(options.name){
                model.name = options.name;
              }

              context.add(model);
              if(callback){
                callback();
              }
            });
            loader.load(options.pathURL);
          }

          {/************ 3D Workspace upper edge ******************/
            var bodyColor = new THREE.MeshLambertMaterial({color: 0xD000E8});
            var propellerColor = new THREE.MeshLambertMaterial({color: 0x2E3833});
            var motorColor = new THREE.MeshLambertMaterial({color: 0x8EAD9E});

            var drone = new THREE.Object3D();
            scope.engine1 = null;
            scope.engine2 = null;
            scope.engine3 = null;
            scope.engine4 = null;

            {// load all assets async
              var _frameLoaded = false;
              var _engineTemplateL_motorLoaded = false;
              var _engineTemplateL_propLoaded = false;
              var _engineTemplateR_motorLoaded = false;
              var _engineTemplateR_propLoaded = false;
              
              var loadProgress = {};

              Object.defineProperty(loadProgress, 'frame', {
                enumerable: true,
                get: function(){
                  return _frameLoaded;
                },
                set: function(value){
                  _frameLoaded = value;
                  if(checkProgress()){
                    loadComplete();
                  }
                }
              });

              Object.defineProperty(loadProgress, 'engineTemplateL_motor', {
                enumerable: true,
                get: function(){
                  return _engineTemplateL_motorLoaded;
                },
                set: function(value){
                  _engineTemplateL_motorLoaded = value;
                  if(checkProgress()){
                    loadComplete();
                  }
                }
              });

              Object.defineProperty(loadProgress, 'engineTemplateL_prop', {
                enumerable: true,
                get: function(){
                  return _engineTemplateL_propLoaded;
                },
                set: function(value){
                  _engineTemplateL_propLoaded = value;
                  if(checkProgress()){
                    loadComplete();
                  }
                }
              });

              Object.defineProperty(loadProgress, 'engineTemplateR_motor', {
                enumerable: true,
                get: function(){
                  return _engineTemplateR_motorLoaded;
                },
                set: function(value){
                  _engineTemplateR_motorLoaded = value;
                  if(checkProgress()){
                    loadComplete();
                  }
                }
              });

              Object.defineProperty(loadProgress, 'engineTemplateR_prop', {
                enumerable: true,
                get: function(){
                  return _engineTemplateR_propLoaded;
                },
                set: function(value){
                  _engineTemplateR_propLoaded = value;
                  if(checkProgress()){
                    loadComplete();
                  }
                }
              });

              var checkProgress = function(){
                for(var key in loadProgress){
                  if(!loadProgress[key]){
                    return false;
                  }
                }
                return true;
              };
            }

            // to be run once all assets loaded
            var loadComplete = function(){
              console.log('success!!!');

              scope.engine1 = engineTemplate_L.clone();
              scope.engine1.position.set(-40,5,-40);
              scope.engine1.throttle = 0;
              _wrapper.add(scope.engine1);

              scope.engine2 = engineTemplate_L.clone();
              scope.engine2.position.set(40,5,40);
              scope.engine2.throttle = 0;
              _wrapper.add(scope.engine2);

              scope.engine3 = engineTemplate_R.clone();
              scope.engine3.position.set(-40,5,40);
              scope.engine3.throttle = 0;
              _wrapper.add(scope.engine3);

              scope.engine4 = engineTemplate_R.clone();
              scope.engine4.position.set(40,5,-40);
              scope.engine4.throttle = 0;
              _wrapper.add(scope.engine4);

              _wrapper.rotation.y = THREE.Math.degToRad(-45);
              drone.add(_wrapper);
              drone.position.setY(-20);

              scene.add(drone);
              scope.threeVisualizerIsLoaded = true;
            };

            var _wrapper = new THREE.Object3D();
                // load frame
                assetLoader(_wrapper, {
                  material: bodyColor,
                  pathURL: 'assets/diy_mini_quad_v3_one_piece.stl',
                  scale: 0.5,
                  position: [0,0,0],
                  rotation: [
                    THREE.Math.degToRad(90),// x
                    THREE.Math.degToRad(0), // y
                    THREE.Math.degToRad(0)  // z
                  ]
                }, function(){
                  loadProgress.frame = true;
                });

                // create template engine with left prop
                var engineTemplate_L = new THREE.Object3D();
                    // load motor
                    assetLoader(engineTemplate_L, {
                      material: motorColor,
                      pathURL: 'assets/N5065_Motor.stl',
                      scale: 3,
                      position: [0,0,0],
                      rotation: [
                        THREE.Math.degToRad(90),// x
                        THREE.Math.degToRad(0), // y
                        THREE.Math.degToRad(0)  // z
                      ]
                    }, function(){
                      loadProgress.engineTemplateL_motor = true;
                    });

                    // load left prop
                    assetLoader(engineTemplate_L, {
                      name: 'propeller',
                      material: propellerColor,
                      pathURL: 'assets/prop_left.stl',
                      scale: 0.4,
                      position: [0,13.5,0],
                      rotation: [
                        THREE.Math.degToRad(90),// x
                        THREE.Math.degToRad(0), // y
                        THREE.Math.degToRad(0)  // z
                      ]
                    }, function(){
                      loadProgress.engineTemplateL_prop = true;
                    });

                // create template engine with right prop
                var engineTemplate_R = new THREE.Object3D();
                    // load motor
                    assetLoader(engineTemplate_R, {
                      material: motorColor,
                      pathURL: 'assets/N5065_Motor.stl',
                      scale: 3,
                      position: [0,0,0],
                      rotation: [
                        THREE.Math.degToRad(90),// x
                        THREE.Math.degToRad(0), // y
                        THREE.Math.degToRad(0)  // z
                      ]
                    }, function(){
                      loadProgress.engineTemplateR_motor = true;
                    });

                    // load right prop
                    assetLoader(engineTemplate_R, {
                      name: 'propeller',
                      material: propellerColor,
                      pathURL: 'assets/prop_right.stl',
                      scale: 0.4,
                      position: [0,13.5,0],
                      rotation: [
                        THREE.Math.degToRad(90),// x
                        THREE.Math.degToRad(0), // y
                        THREE.Math.degToRad(0)  // z
                      ]
                    }, function(){
                      loadProgress.engineTemplateR_prop = true;
                    });
            
          }/************ 3D Workspace lower edge ******************/

          var prop1 = null;
          var prop2 = null;
          var prop3 = null;
          var prop4 = null;

          // the render loop
          var render = function () {
            requestAnimationFrame(render);

            //set attitude of drone
            if(drone){ //&& scope.attitude){
              // console.log('!!!!!')
              drone.rotation.x += 0.01 //THREE.Math.degToRad(scope.attitude.pitch);
              drone.rotation.y += 0.001 //THREE.Math.degToRad(scope.attitude.yaw);
              drone.rotation.z -= 0.005 //THREE.Math.degToRad(scope.attitude.roll);
            }

            // rotate each engine's propeller
            if(scope.engine1){
              if(!prop1){
                scope.engine1.children.forEach(function(mesh){
                  if(mesh.name === 'propeller'){
                    prop1 = mesh;
                  }
                });
              }else{
                prop1.rotation.z -= scope.engine1.throttle/10;
              }
            }
            if(scope.engine2){
              if(!prop2){
                scope.engine2.children.forEach(function(mesh){
                  if(mesh.name === 'propeller'){
                    prop2 = mesh;
                  }
                });
              }else{
                prop2.rotation.z -= scope.engine2.throttle/10;
              }
            }
            if(scope.engine3){
              if(!prop3){
                scope.engine3.children.forEach(function(mesh){
                  if(mesh.name === 'propeller'){
                    prop3 = mesh;
                  }
                });
              }else{
                prop3.rotation.z += scope.engine3.throttle/10;
              }
            }
            if(scope.engine4){
              if(!prop4){
                scope.engine4.children.forEach(function(mesh){
                  if(mesh.name === 'propeller'){
                    prop4 = mesh;
                  }
                });
              }else{
                prop4.rotation.z += scope.engine4.throttle/10;
              }
            }

            renderer.render(scene, camera);
          };
          // kickoff render loop
          render();
          console.log(context);
        });
      }
    }
  }]);
