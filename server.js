var express = require('express');
var ws = require("nodejs-websocket");
var app = express();

var port = process.env.PORT || 3000;
var tesselport = 8000;

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.redirect('/client');
})

console.log("listening on port", port);
console.log(__dirname)
app.listen(port);


// INSERT TESSEL IP ADDRESS HERE. Always prepend with 'ws://' to indicate websocket
var connection = ws.connect('ws://10.8.31.216:' + tesselport, function() {
  // When we connect to the server, send some catchy text
  connection.sendText("My milkshake brings all the boys to the yard")
});

// When we get text back
connection.on('text', function(text) {
  // print it out
  console.log("Echoed back from server:", text);
})