var ws = require("nodejs-websocket");
var port = 8000;

// INSERT TESSEL IP ADDRESS HERE. Always prepend with ws:// to indicate websocket
var connection = ws.connect('ws://10.8.31.216:' + port, function() {
  // When we connect to the server, send some catchy text
  connection.sendText("My milkshake brings all the boys to the yard")
});

// When we get text back
connection.on('text', function(text) {
  // print it out
  console.log("Echoed back from server:", text);
})
