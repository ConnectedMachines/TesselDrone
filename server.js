var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 3000;
// var tesselport = 8000;

app.use(cors());
app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.redirect('/client');
})

app.post('/test', function(req, res){
  console.log('REQUEST:', req.body);
  res.send('recieved!');
})

console.log("listening on port", port);
app.listen(port);
