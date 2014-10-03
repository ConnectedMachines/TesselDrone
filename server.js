// ###############################
// REQUIRES
// ###############################
var cors = require('cors');
var bodyParser = require('body-parser');
var ws = require('nodejs-websocket');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// ###############################
// GLOBAL VARIABLES
// ###############################
var tesselConnected = false;
var tesselPreflightComplete = false;
var port = process.env.PORT || 3000;
var tesselIP = '10.8.31.216';

// ###############################
// EXPRESS CONFIGURATION
// ###############################


app.use(cors());
app.use(express.static(__dirname));
app.use(bodyParser.json());

// ###############################
// WEBSOCKETS SETUP - TO TESSEL
// ###############################
var connection = ws.connect('ws://' + tesselIP + ':' + port, function () {
  tesselConnected = true;
  console.log('Connected to Tessel');
});

var tesselToClientBridge(socket){
  // When we get info back from the tessel websocket we want to let the client know
  connection.on('text', function (data) {
    data = JSON.parse(data);
    socket.volatile.emit('droneData', { attitude: {
                                          pitch: data.xAxis,
                                          roll: data.yAxis,
                                          yaw: data.zAxis
                                        },
                                        motorThrottles: {
                                          motor1: data.motor1,
                                          motor2: data.motor2,
                                          motor3: data.motor3,
                                          motor4: data.motor4
                                        }
                                      });
  });
};

// ###############################
// HELPER FUNCTIONS
// ###############################
var tesselPreflight = function (callback) {
  if (tesselPreflightComplete) {
    callback();
  } else if (tesselConnected) {
    tesselPreflightComplete = true;
    connection.sendText('preflight');
    callback();
  } else {
    tesselPreflight(callback);
  }
};

var tesselTakeoff = function (callback) {
  connection.sendText('takeoff');
  callback();
};

var tesselLand = function (callback) {
  connection.sendText('land');
  callback();
};

// ###############################
// ROUTING SETUP
// ###############################
app.get('/', function (req, res) {
  res.redirect('/client');
});

io.on('connection', function (socket) {
  socket.emit('status', { status: 'Successfuly Connected' });
  socket.on('land', function (data) {
    tesselLand(function(){
      socket.emit('status', { status: 'Landing Command Recieved' });
    });
  });
  socket.on('preflight', function (data) {
    tesselPreflight(function(){
      socket.emit('status', { status: 'Preflight Command Recieved' });
    });
  });
  socket.on('takeoff', function (data) {
    tesselTakeoff(function(){
      socket.emit('status', { status: 'Takeoff Command Recieved' });
    });
  });
  tesselToClientBridge(socket);
});

// ###############################
// START LISTEINING
// ###############################
console.log('listening on port', port);
server.listen(port);