var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.redirect('/client');
})

console.log("listening on port", port);
console.log(__dirname)
app.listen(port);