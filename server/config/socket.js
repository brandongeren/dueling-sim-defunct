const events = require('../../events');

let connectedUsers = { }

module.exports = (socket) => {
  console.log('Socket ID: ' + socket.id);

  socket.on(events.USER_CONNECTED, (user) => {
    console.log(user.username + ' has joined!');
    socket.user = user;
    user.socketId = socket.id;
    connectedUsers = addUser(connectedUsers, user);
  });

  socket.on(events.MESSAGE_SENT, (data) => {
    console.log('new message! from: ' + data.username);
    console.log(data.message);
    socket.broadcast.emit(events.MESSAGE_RECEIVED, {message: data.message, username: data.username})
  });

  socket.on(events.DISCONNECT, () => {
    let username = socket.user && socket.user.username;
    console.log(username + ' has left');
    // the below line crashes the server if it is restarted 
    // the line is useful in production though
    // TODO: find a solution to this problem
    // connectedUsers = removeUser(connectedUsers, socket.user);
  });
};

// Add an user to the connected users object
function addUser(users, user) {
  if (!users[user.username]) {
    let updatedUsers = Object.assign({}, users);
    updatedUsers[user.username] = user;
    return updatedUsers;
  } else {
    return users;
  }
}

// Remove an user from the connected users object
function removeUser(users, user) {
  if (users[user.username]) {
    let updatedUsers = Object.assign({}, users);
    delete updatedUsers[user.username]
    return updatedUsers;
  } else {
    return users;
  }
}

// Check if an user exists in the users object
function isUser(users, user) {
  return user.username in users;
}
