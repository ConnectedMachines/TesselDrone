angular.module('MadProps')
  .directive('dronemodel', ['$window', function(threeService, $window){
    return {
      restrict: 'EA',
      link: function(scope, element, attrs){
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

          var currPitch = 0;
          var currYaw = 0;
          var currRoll = 0;

          var pitchArr = [];
          var yawArr = [];
          var rollArr = [];

          // Because the engines are built from two separate models, sometimes the load time of one component will
          // be faster than the other making their index in the child array of their parent inconsistant. To fix this 
          // issue we determine which model is the propeller at runtime.

          // References to the engines
          var engine1 = null;
          var engine2 = null;
          var engine3 = null;
          var engine4 = null;

          // References to the propellers to be set once the server recieves first throttle data
          var prop1 = null;
          var prop2 = null;
          var prop3 = null;
          var prop4 = null;
          
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
        
          // to be run once all assets loaded
          var loadComplete = function(){
            engine1 = engineTemplate_L.clone();
            engine1.position.set(-40,5,-40);
            _wrapper.add(engine1);

            engine2 = engineTemplate_L.clone();
            engine2.position.set(40,5,40);
            _wrapper.add(engine2);

            engine3 = engineTemplate_R.clone();
            engine3.position.set(-40,5,40);
            _wrapper.add(engine3);

            engine4 = engineTemplate_R.clone();
            engine4.position.set(40,5,-40);
            _wrapper.add(engine4);

            _wrapper.rotation.y = THREE.Math.degToRad(-45);
            drone.add(_wrapper);
            drone.position.setY(-20);

            scene.add(drone);
            scope.threeVisualizerIsLoaded = true;
          };
        }/************ 3D Workspace lower edge ******************/

        // helper functions for easing between attitude changes

        var _inOutQuad = function(t, b, c, d){
          t /= d/2;
          if(t < 1){
            return c/2*t*t + b;
          }
          t--;
          return -c/2 * (t*(t-2) - 1) + b;
        };

        var _inOutLinear = function (t, b, c, d) {
          return c*t/d + b;
        };

        var easeMovement = function(b, c, d){
          var results = [];
          for(var t = 0; t < d; t++){
            results.push(_inOutLinear(t, b, c, d));
          }
          results.shift();
          results.push(c);
          return results
        };

        // the render loop
        var render = function () {
          if(document.getElementsByTagName('dronemodel').length){
            requestAnimationFrame(render);
          }

          //set attitude of drone
          if(drone && scope.attitude){
            var newPitch = Math.round(scope.attitude.pitch*(180/Math.PI));
            var newRoll = Math.round(scope.attitude.roll*(180/Math.PI));

            // check for diff in attitude
            if(newPitch !== currPitch){
              pitchArr = easeMovement(currPitch, newPitch, 25);
              currPitch = newPitch;
            }
            if(newRoll !== currRoll){
              rollArr = easeMovement(currRoll, newRoll, 25);
              currRoll = newRoll;
            }

            // apply attitude adjustments if available
            if(pitchArr.length){
              drone.rotation.x = pitchArr.shift()*(Math.PI/180);
            }
            if(rollArr.length){
              drone.rotation.z = rollArr.shift()*(Math.PI/180);
            }
          }

          // rotate each engine's propeller
          if(drone && scope.throttle){
            if(engine1){
              if(!prop1){// checks if propeller needs to be referenced
                engine1.children.forEach(function(mesh){
                  if(mesh.name === 'propeller'){
                    prop1 = mesh;// associates the THREEjs mesh with a prop variable for later referencing
                  }
                });
              }else{// propeller has already be assigned to a variable and is ready to be manipulated
                prop1.rotation.z -= scope.throttle.e1;
              }
            }
            if(engine2){
              if(!prop2){// checks if propeller needs to be referenced
                engine2.children.forEach(function(mesh){
                  if(mesh.name === 'propeller'){
                    prop2 = mesh;// associates the THREEjs mesh with a prop variable for later referencing
                  }
                });
              }else{// propeller has already be assigned to a variable and is ready to be manipulated
                prop2.rotation.z -= scope.throttle.e2;
              }
            }
            if(engine3){
              if(!prop3){// checks if propeller needs to be referenced
                engine3.children.forEach(function(mesh){
                  if(mesh.name === 'propeller'){
                    prop3 = mesh;// associates the THREEjs mesh with a prop variable for later referencing
                  }
                });
              }else{// propeller has already be assigned to a variable and is ready to be manipulated
                prop3.rotation.z += scope.throttle.e3;
              }
            }
            if(engine4){
              if(!prop4){// checks if propeller needs to be referenced
                engine4.children.forEach(function(mesh){
                  if(mesh.name === 'propeller'){
                    prop4 = mesh;// associates the THREEjs mesh with a prop variable for later referencing
                  }
                });
              }else{// propeller has already be assigned to a variable and is ready to be manipulated
                prop4.rotation.z += scope.throttle.e4;
              }
            }
          }

          renderer.render(scene, camera);
        };
        // kickoff render loop
        render();
      }
    }
  }]);
