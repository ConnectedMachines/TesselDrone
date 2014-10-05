var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 3000;
// var tesselport = 8000;

var tesselData = {
  attitude: {
    pitch: 0,
    roll: 0,
    yaw: 0
  },
  motorThrottles: {
    e1: 0,
    e2: 0,
    e3: 0,
    e4: 0
  }
};

app.use(cors());
app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.redirect('/client');
});

app.post('/data', function(req, res){
  console.log('REQUEST:', req.body);
  var data = req.body;
    tesselData.attitude.pitch = data[1];
    tesselData.attitude.roll = data[0];
    tesselData.attitude.yaw = data[2];
  if(data.attitude){
  }
  if(data.motorThrottles){
    tesselData.motorThrottles = data.motorThrottles;
  }
  res.send('recieved!');
});

app.get('/data', function(req, res){
  console.log('GETRES:',tesselData)
  res.send(tesselData);
});

console.log("listening on port", port);
app.listen(port);
