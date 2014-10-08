var accel = require("./mainControl.js").accel;
var accelData = require("./mainControl.js").accelData;
var startPreflight = require('./preflight.js').startPreflight;
var readyToLaunch = require('./launch.js').readyToLaunch;
var land = require('./land.js').land
var tessel = require('tessel');
var wifi = require('wifi-cc3000');
var ws = require("nodejs-websocket");


// ###############################
// WEBSOCKET SETUP
// ###############################

//This must match the web socket port on the server side
var webSocketPort = 3000
var connectToServer = function () {
  if (!tesselConnected) {
    console.log('Inside connect to server')
    var connection = ws.connect('ws://tesseldrone.cloudapp.net:3000', function() {
      // When we connect to the server, send some catchy text
      tesselConnected = true;
      console.log('Connected to Web Server');
    });
    connection.on("text", function (text) {
      console.log("Echoed back from server:", text);
      // This will basicly be our control switch
      if (text === 'land') {
        console.log("Received " + text);
        land();
      } else if (text === 'takeOff') {
        console.log("Received " + text);
        readyToLaunch();
        // This is temp code and will need to be rewritten such that 
        // when the connectionection closes this on data is removed
      } else if (text === 'preflight') {
        console.log("Received " + text);
        accel.on('data', function (xyz) {
          console.log(xyz);
          var data = {
            attitude: {
              pitch: xyz[0],
              roll: xyz[1],
              yaw: xyz[2]
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
        startPreflight();
      } else {
        console.log("Invalid Command: ", str);
      }
    });
  }
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
  if(!wifi.isConnected()){
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

