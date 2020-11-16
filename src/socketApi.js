const socketio = require('socket.io');
const io = socketio();

const socketApi = {io};
const socketAutherization = require('../middleware/socketAutherization');

io.use(socketAutherization);

// libs
const Users = require('./lib/Users')
const Rooms = require('./lib/Rooms')
const Messages = require('./lib/Messages')

// Redis adapter
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ 
    host: process.env.REDIS_URI, 
    port: process.env.REDIS_PORT 
}));

io.on('connection',socket =>{
    console.log('a user connected in with name' + socket.request.user.name);
    Users.upsert(socket.id, socket.request.user);

    Users.list(users => {
       io.emit('onlineList',users);
    })

    Rooms.list(rooms => {
        io.emit('activeRooms',rooms);
     })

    socket.on('newRoom', roomName => {
        Rooms.upsert(roomName);
        Rooms.list(rooms => {
            io.emit('activeRooms',rooms);
         })
    })

    socket.on('newMessage', data => {

        Messages.upsert({...data, 
            userId: socket.request.user._id,
            username : socket.request.user.name,
            surname : socket.request.user.surname,
        });
    })



    socket.on('disconnect', () => {
        Users.remove(socket.request.user.googleID);

        Users.list(users => {
            io.emit('onlineList',users);
         })
    })
})

module.exports = socketApi;