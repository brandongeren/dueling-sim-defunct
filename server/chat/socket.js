const events = require('../../events');
const createRoom = require('./factories');

let connectedUsers = { };
let general = createRoom({ name: "general", });
let rooms = { };
rooms[general.name] = general;

// TODO: make a new file (chat.js maybe?) for parsing chat messages
// model it after this: https://github.com/Zarel/Pokemon-Showdown/blob/master/server/chat.js
// cmd + f "command parser"
// read the documentation there

module.exports = (socket) => {
  console.log('Socket ID: ' + socket.id);

  socket.on(events.USER_CONNECTED, (user) => {
    let newUser = user.user;
    console.log(newUser.username + ' has joined!');
    socket.user = newUser;
    newUser.socketId = socket.id;
    connectedUsers = addUser(connectedUsers, newUser);
  });

  socket.on(events.DISCONNECT, () => {
    let username;
    if (socket.user) {
      username = socket.user.username;
      connectedUsers = removeUser(connectedUsers, socket.user);
      socket.emit(events.USER_DISCONNECTED, connectedUsers);
    }
    console.log(username + ' has left');
    // the below line crashes the server if it is restarted 
    // the line is useful in production though
    // TODO: find a solution to this problem
    // connectedUsers = removeUser(connectedUsers, socket.user);
  });

  socket.on(events.LOGOUT, () => {
    let username;
    if (socket.user) {
      connectedUsers = removeUser(connectedUsers, socket.user);
      socket.emit(events.USER_DISCONNECTED, connectedUsers);
      delete socket.user; 
    }
    console.log(username + ' has logged out');
  });

  // send a message
  socket.on(events.MESSAGE_SENT, (data) => {
    let from = data.from;
    console.log('new message! from: ' + from.username);
    let message = data.message;
    // abstract out the below stuff to a generalized function to handle chat message filtering
    // that function will also handle when users are muted
    // in addition, that function can handle slash commands
    // remove zalgo
    message = message.replace(/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g, '');
    // remove alternative space characters, and others
    message = message.replace(/[\u115f\u1160\u239b-\u23b9]/g, '');
    
    console.log(message);
    // TODO: change this to a socket.to().emit()
    // socket.to allows you to have different channels and shit
    // oh and you can also do private messages that way
    // more info: https://socket.io/docs/emit-cheatsheet/
    // TODO: BIG TODO
    // make the code so much simpler this way holy hell
    socket.emit(`${events.MESSAGE_RECEIVED}-${data.channelId}`, { message: message, from: from, });
  });

  socket.on(events.PRIVATE_MESSAGE, ({to, from}) => {
    if (receiver in connectedUsers) {
      // TODO: this is a shitty way of naming the chat
      // if users have '&' in their names, then it could cause anti-uniqueness problems
      // ideally we eventually refactor dm's into being distinct from normal conversation
      // pokemon showdown and db do that
      let name = from.username + ' & ' + to.username;
      const room = createRoom({users: [to, from], pm: true, name: name});
      rooms[name] = room;
      const toSocket = connectedUsers[to.user.username];
      socket.to(toSocket).emit(events.PRIVATE_MESSAGE, room);
      socket.to(socket.id).emit(events.PRIVATE_MESSAGE, room);
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
