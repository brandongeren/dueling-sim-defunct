const events = require('../../events');

module.exports = (socket) => {
  console.log('an user has connected');

  socket.on(events.MESSAGE_SENT, (data) => {
    console.log('new message! from: ' + data.username);
    console.log(data.message);
    socket.broadcast.emit(events.MESSAGE_RECEIVED, {message: data.message, username: data.username})
  });

  socket.on(events.USER_DISCONNECTED, () => {
    console.log('an user has left')
  });
};

