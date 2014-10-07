var tessel = require('tessel');
var wifi = require('wifi-cc3000');
var ws = require("nodejs-websocket");
var accel = require("mainControl.js").acceleromter;
var accelData = require("mainControl.js").accelData;


// ###############################
// WEBSOCKET SETUP
// ###############################

//This must match the web socket port on the server side
var webSocketPort = 8000
var connectToServer = function () {
  var connection = ws.connect('ws://TesselDrone.azurewebsites.net:' + webSocketPort, function () {
    tesselConnected = true;
    console.log('Connected to Tessel');
  });
  connection.on("text", function (str) {
    // This will basicly be our control switch
    if (str === 'land') {
      console.log("Received " + str);
    } else if (str === 'takeOff') {
      console.log("Received " + str);
      // This is temp code and will need to be rewritten such that 
      // when the connectionection closes this on data is removed
    } else if (str === 'preflight') {
      console.log("Received " + str);
      accel.on('data', function (xyz) {
        console.log(xyz);
        accelData.x = xyz[0];
        accelData.y = xyz[1];
        accelData.z = xyz[2];
        var data = {
          attitude: {
            pitch: accelData.x,
            roll: accelData.y,
            yaw: accelData.z
          },
          motorThrottles: {
            motor1: 0,
            motor2: 0,
            motor3: 0,
            motor4: 0
          }
        };
        connection.sendText(JSON.stringify(data));
      });
    } else {
      console.log("Invalid Command: ", str);
    }
  });
};
// ###############################
// WIFI SETUP
// ###############################

var network = 'Hack Reactor';
var pass = 'awesomebullets';
var security = 'wpa2';

// Connect to the wifi network
var connect = function () {
  wifi.connect({
    security: security,
    ssid: network,
    password: pass,
    timeout: 30 // In seconds
  });
};

// Check if the wifi chip is busy (currently trying to connect), if not, try to connect
var tryConnect = function () {
  if (!wifi.isBusy()) {
    connect();
  } else {
    // For the first few seconds of program bootup, you'll always 
    // see the wifi chip as being 'busy'
    console.log('is busy, trying again');
    setTimeout(function () {
      tryConnect();
    }, 1000);
  }
};

wifi.on('connect', function (err, data) {
  // Start the server up
  console.log('connect emitted', err, data);
  connectToServer();
});

wifi.on('disconnect', function (err, data) {
  // Wifi dropped, want to call connect() again?
  // Also immediate stop to all motors
  console.log('disconnect emitted', err, data);
  console.log('Attempting reconnection');
  tryConnect();
});

wifi.on('timeout', function (err) {
  // Tried to connect but couldn't, retry
  console.log('timeout emitted', err);
  tryConnect();
});

wifi.on('error', function (err) {
  // Result make sure that motors are shutoff!
  // Reset the wifi chip
  console.log('error emitted', err);
  console.log('Restarting Wifi');
  wifi.disable(function () {
    console.log('Wifi Disabled');
    wifi.enable(function () {
      console.log('Wifi Enabled \nRestarting Complete \n Attempting Reconnection');
      tryConnect();
    });
  });
});

// ###############################
// START THE SERVER
// ###############################

tryConnect();

