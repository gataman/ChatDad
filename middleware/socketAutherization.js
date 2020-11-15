const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');
const redisStore = require('../helpers/redisStore')

const onAuthorizeSuccess = (data, accept) => {
    console.log('successful connection to socket.io');
    accept(null, true);
}

const onAuthorizeFail = (data, message, error, accept) => {
    if (error)
        throw new Error(message);
    console.log('failed connection to socket.io:', message);
    accept(null, false);
    
}

module.exports = passportSocketIo.authorize({
    cookieParser,
    key: 'connect.sid',
    secret: process.env.SESSION_SECRET_KEY,
    store: redisStore,
    success: onAuthorizeSuccess, 
    fail: onAuthorizeFail,    

})
