var express = require('express');
var app = express();
var server = app.listen(8080, console.log("Server is running"));
var socket = require('socket.io');
var io = socket(server);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', socketConnection);

app.get('/', function(req, res){
  res.render('homepage/index');
});

app.get('/chat/:chat', function(req, res){
  res.render('chat/index');
});

app.use(function(req, res){
  res.render('error/index');
});

function socketConnection(socket){
  console.log("New user connected");

  socket.on("message", receivedMsg);

  function receivedMsg(data){
    socket.broadcast.emit("message" + data.path, data);
    console.log("New message to " + data.path);
  }

  socket.on("cancel", cancelChat);
  function cancelChat(data){
    io.sockets.emit("cancel" + data, "yes");
    //broadcast for all users
    console.log("New cancel for " + data);
  }
}
