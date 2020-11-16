const redisClient = require('../redisClient')
const shortId = require('shortid')

function Rooms() {
    this.client = redisClient.getClient()
}

module.exports = new Rooms();

Rooms.prototype.upsert = function (roomName) {
    const newId = shortId.generate();
    this.client.hset(
        'rooms',
        "@Room:"+newId,
        JSON.stringify({
            id:"@Room:"+newId,
            roomName,
            when : Date.now()

        }),
        err => {
            if(err) console.error(err);
        }
    )
    
};

Rooms.prototype.list = function (callback) {
    let activeRooms = [];
    this.client.hgetall(
        'rooms',
        function (err, rooms) {
            if(err) {
                console.error(err);
                return callback([]);
            }

            for(let room in rooms){
                activeRooms.push(JSON.parse(rooms[room]))
            }

            return callback(activeRooms);
            
        }
    )
};