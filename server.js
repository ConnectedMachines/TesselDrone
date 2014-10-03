// ###############################
// REQUIRES
// ###############################
var express = require('express');
var Pusher = require('pusher');
var cors = require('cors');
var bodyParser = require('body-parser');
var ws = require('nodejs-websocket');

// ###############################
// GLOBAL VARIABLES
// ###############################
var app = express();
var tesselConnected = false;
var tesselPreflightComplete = false;
var port = process.env.PORT || 3000;
var tesselport = 8000;
var tesselIP = '10.8.31.216';

// ###############################
// EXPRESS CONFIGURATION
// ###############################

app.use(cors());
app.use(express.static(__dirname));
app.use(bodyParser.json());

// ###############################
// PUSHER SETUP - TO CLIENT
// ###############################
var pusher = new Pusher({
  appId: '12345',
  key: '1234567890',
  secret: 'my secret... shhh!!!'
});

// ###############################
// WEBSOCKETS SETUP - TO TESSEL
// ###############################
var connection = ws.connect('ws://' + tesselIP + ':' + port, function () {
  tesselConnected = true;
  console.log('Connected to Tessel');
});

// When we get info back from the tessel websocket we want to let the client know
connection.on('text', function (data) {
  // Tell Pusher to trigger an 'updated' event on the 'Drone' channel
  // and pass the JSON data from the tessel to the event
  pusher.trigger('droneData', 'updated', data);
});

// ###############################
// HELPER FUNCTIONS
// ###############################
var tesselPreflight = function (res) {
  if (tesselPreflightComplete) {
    res.send('Recieved!');
  } else if (tesselConnected) {
    tesselPreflightComplete = true;
    connection.sendText('preflight');
    res.send('Recieved!');
  } else {
    tesselPreflight(res);
  }
};

var tesselTakeoff = function (res) {
  connection.sendText('takeoff');
  res.send('Taking Off!');
};

var tesselLand = function (res) {
  connection.sendText('land');
  res.send('Landing!');
};

// ###############################
// ROUTING SETUP
// ###############################
app.get('/', function (req, res) {
  res.redirect('/client');
});

app.get('/api/preflight', function (req, res) {
  tesselPreflight(res);
});

app.get('/api/land', function (req, res) {
  tesselLand(res);
});
app.get('/api/takeoff', function (req, res) {
  tesselTakeoff(res);
});


// ###############################
// START LISTEINING
// ###############################
console.log('listening on port', port);
app.listen(port);