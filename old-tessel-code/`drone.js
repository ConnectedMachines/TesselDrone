// contains code related to the drone's params and methods. 

// Control flow variables
var isServoModuleReady = false;
var isAccelModuleReady = false;
var isHovering = true;
var isLanding = false;

var drone = {
  motors: motors,
  sensors: sensors,
  preflight: preflight,
  takeoff: takeoff,
  hover: hover,
  land: land
};
