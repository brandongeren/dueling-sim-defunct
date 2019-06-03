const express = require('express');
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const router = express.Router(); // eslint-disable-line new-cap

// const socket_port = 3000;

// io.on('connection', (socket) => {
//   console.log('a user connected');

//   socket.on('new-message', (message) => {
//     console.log(message);
//     io.emit('new-message', message);
//   });
// });

// http.listen(socket_port, () => {
//   console.log(`socket.io is listening on *:${socket_port}`);
// });

// router.get('/room/:name', (req, res, next) => {
//   let name = req.params.name;
//   rooms.findOne({name: name}, (err, room) => {
//     if (err) {
//       console.log(err);
//       return false;
//     }
//     res.json(room.messages);
//   });
// });


module.exports = router;