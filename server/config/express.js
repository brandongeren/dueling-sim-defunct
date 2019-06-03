const path = require('path');
const express = require('express');
const httpError = require('http-errors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const routes = require('../routes/index.route');
const config = require('./config');
const passport = require('./passport')

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const socket_port = 3000;

if (config.env === 'development') {
  app.use(logger('dev'));
}

// Choose what fronten framework to serve the dist from
var distDir = '../../dist/';
if (config.frontend == 'react') {
  distDir ='../../node_modules/material-dashboard-react/dist'
 } else {
  distDir ='../../dist/' ;
 }

// 
app.use(express.static(path.join(__dirname, distDir)))
app.use(/^((?!(api)).)*/, (req, res) => {
  res.sendFile(path.join(__dirname, distDir + '/index.html'));
});

console.log(distDir);
 //React server
app.use(express.static(path.join(__dirname, '../../node_modules/material-dashboard-react/dist')))
app.use(/^((?!(api)).)*/, (req, res) => {
res.sendFile(path.join(__dirname, '../../dist/index.html'));
}); 


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use(passport.initialize());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API router
app.use('/api/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new httpError(404)
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {

  // customize Joi validation errors
  if (err.isJoi) {
    err.message = err.details.map(e => e.message).join("; ");
    err.status = 400;
  }

  res.status(err.status || 500).json({
    message: err.message
  });
  next(err);
});

// chat app functionality follows
io.on('connection', (socket) => {
  console.log('a user connected');

  // when an user tries to join a room: add them to it if it exists
  // if it does not exist, create the room with an empty array of messages
  socket.on('join', (data) => {
    socket.join(data.room);
    chatrooms.find({}).toArray((err, rooms) => {
      if (err) {
        console.log(err);
        return false;
      }

      count = 0;
      roos.forEach((room) => {
        if (room.name == data.room) {
          count++;
        }
      });

      if (count == 0) {
        chatrooms.insert({name: data.room, messages: []});
      }
    })
  });

  socket.on('message', (data) => {
    console.log(data.toString());
    // TODO: add a timestamp to messages
    io.in(data.room).emit('new-message', {user: data.user, message: data.message});
    chatrooms.update({name: data.room}, { $push: { messages: { user: data.user, message: data.message} } }, (err, res) => {
      if (err) {
        console.log(err);
        return false;
      }
    });
  });

  socket.on('typing', (data) => {
    // broadcast to all users except the one typing
    socket.broadcast.in(data.room).emit('typing', {data: data, isTyping: true});
  });
});

http.listen(socket_port, () => {
  console.log(`socket.io is listening on *:${socket_port}`);
});

module.exports = app;
