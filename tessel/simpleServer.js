'use strict';

var http = require('http');
var tessel = require('tessel');
var wifi = require('wifi-cc3000');

var greenLED = tessel.led[0];
var blueLED = tessel.led[1];
var redLED = tessel.led[2];
var yellowLED = tessel.led[3];

if(wifi.isConnected()){ 
  startServerEtAl(); 
}
wifi.on('connect', function (err, data) {
  startServerEtAl();
});

// Once wifi connected, start the server and listen for cURL commands.
// /100 /0 /2 /hover
function startServerEtAl(){
  http.createServer(function (req, res) {
    blueLED.toggle();
    console.log('\nRequest received', req.url);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    
    var command = req.url.slice(1);
    console.log('command is', command);

    res.end(' OK.');
    blueLED.toggle();
  }).listen(9000);
  console.log('Server started.');
  yellowLED.low();
  blueLED.high();
};
