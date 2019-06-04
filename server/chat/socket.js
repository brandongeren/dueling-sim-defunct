const events = require('../../events');

let connectedUsers = { }

// TODO: make a new file (chat.js maybe?) for parsing chat messages
// model it after this: https://github.com/Zarel/Pokemon-Showdown/blob/master/server/chat.js
// cmd + f "command parser"
// read the documentation there

module.exports = (socket) => {
  console.log('Socket ID: ' + socket.id);

  socket.on(events.USER_CONNECTED, (user) => {
    console.log(user.username + ' has joined!');
    socket.user = user;
    user.socketId = socket.id;
    connectedUsers = addUser(connectedUsers, user);
  });

  socket.on(events.DISCONNECT, () => {
    let username = socket.user && socket.user.username;
    console.log(username + ' has left');
    // the below line crashes the server if it is restarted 
    // the line is useful in production though
    // TODO: find a solution to this problem
    // connectedUsers = removeUser(connectedUsers, socket.user);
  });

  // send a message
  socket.on(events.MESSAGE_SENT, (data) => {
    console.log('new message! from: ' + data.username);
    
    // abstract out the below stuff to a generalized function to handle chat message filtering
    // that function will also handle when users are muted
    // in addition, that function can handle slash commands
    // remove zalgo
    message = message.replace(/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g, '');
    // remove alternative space characters, and others
    message = message.replace(/[\u115f\u1160\u239b-\u23b9]/g, '');
    
    console.log(data.message);
    socket.broadcast.emit(events.MESSAGE_RECEIVED, {message: data.message, username: data.username})
  });

  socket.on(events.PRIVATE_MESSAGE, ({receiver, sender}) => {
    if (receiver in connectedUsers) {
      
    } else {
      // TODO: send error message to the front end informing the sender that the receiver is offline
      // this follows the pokemon showdown style of informing that receiver is offline
      // duelingbook takes a different approach, where as soon as the user signs off 
    }
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
