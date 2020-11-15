
const session = require('express-session');
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT,process.env.REDIS_URI,{ auth_pass : process.env.REDIS_PASS});
const RedisStore = require("connect-redis")(session);

module.exports = new RedisStore({
    client : client,
    logErrors : true
})