const redisClient = require('../redisClient')
const shortId = require('shortid')
const _ = require('lodash');
const User = require('../../models/users')

function Messages() {
    this.client = redisClient.getClient()
}

module.exports = new Messages();

Messages.prototype.upsert = function ({roomId,message,userId,username,surname}) {
    const newId = shortId.generate();
    this.client.hset(
        'messages:'+roomId,
        newId,
        JSON.stringify({
            userId,
            username,
            surname,
            message,
            when : Date.now()

        }),
        err => {
            if(err) console.error(err);
        }
    )
    
};

Messages.prototype.list = function (roomId, callback) {

    let messageList = [];
    this.client.hgetall(
        'messages:'+roomId,
        function (err, messages) {
            if(err) {
                console.error(err);
                return callback([]);
            }        
            for(let message in messages){
                
               
                messageList.push(JSON.parse(messages[message]))
            }
         
            return callback(_.orderBy(messageList,'when','desc'));
            
        }
    )
};