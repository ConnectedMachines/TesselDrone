var tessel = require('tessel');
<<<<<<< HEAD
var port = 8000;
var host = '10.8.31.216';

//Flight Control Functions
var takeOff = require('./preflight.js').armAndTakeOff;
var land = require('./land.js').land;

// TODO consider as additional balancing measure.
// var checkMotorsArentTooFarApart = function(motor){}

  var throttleUp = function(motorNumber){
    var proposedMotorThrottle = motors[motorNumber].throttle+minThrottleIncrement;
    if(proposedMotorThrottle <= motorMaxThrottle){
      // var timeMotorThrottleChangeIssued = new Date().getTime();
      servo.move(motorNumber, userSetMaxThrottle
        // , function(err){
        // var timeMotorThrottleChangeCompleted = new Date().getTime();
        // var timeToIssueThrottleChange =timeMotorThrottleChangeCompleted-timeMotorThrottleChangeIssued;
        // if(err){console.log(timeToIssueThrottleChange,motorNumber,err);}
        // else{
        //   if(true){console.log(motorNumber+' ^ '+proposedMotorThrottle, timeToIssueThrottleChange);}
        //   motors[motorNumber].throttle = proposedMotorThrottle;
        // }
      // }
      );
    }
  };

  var throttleDown = function(motorNumber){
    var proposedMotorThrottle = motors[motorNumber].throttle-minThrottleIncrement;
    if(proposedMotorThrottle >= 0){
      var timeMotorThrottleChangeIssued = new Date().getTime(); //nanoseconds
      servo.move(motorNumber, 0
      //   , function(err){
      //   var timeMotorThrottleChangeCompleted = new Date().getTime();
      //   var timeToIssueThrottleChange =timeMotorThrottleChangeCompleted-timeMotorThrottleChangeIssued;
      //   if(err){console.log(timeToIssueThrottleChange,motorNumber,err);}
      //   else{
      //     if(true){console.log(motorNumber+' v '+proposedMotorThrottle, timeToIssueThrottleChange);}
      //     motors[motorNumber].throttle = proposedMotorThrottle;
      //   }
      // }
      );
    }
  };
=======
var wifi = require('wifi-cc3000');
var ws = require("nodejs-websocket");
var accel = require("mainControl.js").acceleromter;
var accelData = require("mainControl.js").accelData;


// ###############################
// SERVER SETUP
// ###############################

var startServer = function () {
  var port = 8000;
  var server = ws.createServer(function (conn) {
    console.log("New connection");
    conn.on("text", function (str) {
      // This will basicly be our control switch
      if (str === 'land') {
        console.log("Received " + str);

      } else if (str === 'takeOff') {
        console.log("Received " + str);
        // This is temp code and will need to be rewritten such that 
        // when the connection closes this on data is removed
        accel.on('data', function (xyz) {
          accelData.x = xyz[0];
          accelData.y = xyz[1];
          accelData.z = xyz[2];
          conn.sendText("X-Axis: " + accelData.x + "\nY-Axis: " + accelData.y + "\nZ-Axis: " + accelData.z);
        });
      } else if (str === 'preflight') {
        console.log("Received " + str);
      } else {
        console.log("Invalid Command: ", str);
      }
    });
>>>>>>> 961be282f7c1b034e27a60b61be85c963af0f553

    // When the client closes the connection, notify us.
    // This is where there should be clean up of listeners
    // if 
    conn.on("close", function (code, reason) {
      console.log("Connection closed: ", code, reason);
    });
  }).listen(port);

  console.log('listening on port', port);
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

<<<<<<< HEAD
  // var gpio = tessel.port['GPIO'];

var server = http.createServer(function(req, res){

  if(req.method === 'GET' && req.url === '/takeOff'){
    console.log('taking off');
    takeOff();
    var statusCode = 200;
    var endData ='on';
  }
=======
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
  startServer();
});

wifi.on('disconnect', function (err, data) {
  // Wifi dropped, want to call connect() again?
  // Also immediate stop to all motors
  console.log('disconnect emitted', err, data);
});
>>>>>>> 961be282f7c1b034e27a60b61be85c963af0f553

wifi.on('timeout', function (err) {
  // Tried to connect but couldn't, retry
  console.log('timeout emitted', err);
  connect();
});

wifi.on('error', function (err) {
  // One of the following happened
  // 1. tried to disconnect while not connected
  // 2. tried to disconnect while in the middle of trying to connect
  // 3. tried to initialize a connection without first waiting for a timeout or a disconnect
  // Result make sure that motors are shutoff!
  console.log('error emitted', err);
});

// ###############################
// START THE SERVER
// ###############################

tryConnect();

