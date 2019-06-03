const express = require('express');
const app = require('./express');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const socket_port = 3000;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('new-message', (message) => {
    console.log(message);
    io.emit('new-message', message);
  });
});

http.listen(socket_port, () => {
  console.log(`socket.io is listening on *:${socket_port}`);
});
