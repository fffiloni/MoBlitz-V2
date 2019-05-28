var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 4000);

app.use(express.static('public'));


console.log("Socket server for MoBlitz is running.");

// require and load dotenv
var dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env'});
// var key = process.env.MY_API_KEY;
//require and load firebasejs
// var Firebase = require('firebase');
let config = {
  apiKey: process.env.MY_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
};




var io = require('socket.io')(server, { wsEngine: 'ws', pingTimeout: 60000 });
var people = 0;
var stockIDs = [];
var currentRoom;
var numClients = {};


io.sockets.on('connection', newConnection);


function newConnection(socket){

  var newAnim = {animid: socket.id, posX: -1, posY: -1};
  stockIDs.push(newAnim);
  console.log('new connection:' + socket.id);
  people++;
  console.log(people + " people in the moblitz.");
  console.log(stockIDs);
  socket.emit('hello', people);
  socket.emit('yourID', socket.id);
  socket.emit('getOthersID', stockIDs);
  socket.broadcast.emit('sendMyID', socket.id);

  socket.on('connectDB', sendDBSettings);
  function sendDBSettings(){
    socket.emit('getdb', config)
  }



  socket.on('join custom', function(roomname){
    // console.log(numClients);
    socket.join(roomname);
    socket.room = roomname;

    console.log(socket.id + " Says: Je suis dans la room: " + roomname +" "+ numClients);

    if (numClients[roomname] == undefined) {
          numClients[roomname] = 1;
      } else {
          numClients[roomname]++;
      }

    socket.emit('socket joined a room', numClients[roomname]);

  })

  socket.on('get slots array', function(){
    socket.broadcast.to(socket.room).emit('gimme your slots array');
  })

  socket.on('this is my slots array', function(data){
    console.log("slots send " + data);
    socket.broadcast.to(socket.room).emit('transfer slots array', data);
  })

  socket.on('update slots array abroad', function(data){
    socket.broadcast.to(socket.room).emit('update slots from abroad', data);
  })
  /// Sending Drawing Informations to Others ///

  socket.on('startToDuo', function(){
    socket.broadcast.to(socket.room).emit('startFromDuo');
    //console.log(data);
  })

  socket.on('sendPoint', function(points){
    socket.broadcast.to(socket.room).emit('pushPointFromDuo',points);
    // console.log(points);
  })

  socket.on('endToDuo', function(data){
    socket.broadcast.to(socket.room).emit('endFromDuo', data);
    //console.log(data);
  })

  socket.on('undoForeign', function(){
    console.log("trying to undo");
    socket.broadcast.to(socket.room).emit('undoLastForeign');

  })

  socket.on('showForeign', function(data){

    socket.broadcast.to(socket.room).emit('replaceDuoDrawings', data);

  })

  socket.on('iamdrawing', function(){
    socket.broadcast.to(socket.room).emit('foreingIsDrawing');
  })

  socket.on('iamnotdrawing', function(){
    socket.broadcast.to(socket.room).emit('foreingIsNotDrawing');
  })

  socket.on('clearForeign', function(){
    socket.broadcast.to(socket.room).emit('cleanDuo');
    //console.log(data);
  })

  socket.on('eraseFriend', function(erasePoint){
    socket.broadcast.to(socket.room).emit('eraseInFriend', erasePoint);
  })



  socket.on('mouse', mouseMsg);

  function mouseMsg(data){
    socket.broadcast.emit('mouse', data);
    console.log('sending points');
  }

  socket.on('mouseReleased', mouseMsg);

  function mouseMsg(data){
    socket.broadcast.emit('mouseReleased', data);
    console.log('new path');
  }

  /// User Disconnect ////

  socket.on('disconnect', newDisConnection);

  function newDisConnection(){
    numClients[socket.room]--;
    //var indexIDout = stockIDs.indexOf(socket.id);
    var indexIDout = stockIDs.map(function(e) { return e.animid; }).indexOf(socket.id);
    stockIDs.splice(indexIDout, 1);
    console.log("disconnected:" + socket.id);
    people--;
    console.log('new disconnection');
    console.log(people + " people left in the moblitz.");
    // socket.broadcast.emit('spliceID', socket.id);
    socket.broadcast.to(socket.room).emit('user freeing slot', socket.id);
  }
}
