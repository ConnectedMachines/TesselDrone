var express = require('express');
var cors = require('cors')
var app = express();

var port = process.env.PORT || 3000;
// var tesselport = 8000;

app.use(cors());
app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.redirect('/client');
})

console.log("listening on port", port);
console.log(__dirname)
app.listen(port);