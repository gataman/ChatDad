const express = require('express');
const router = express.Router();
const Messages = require('../src/lib/Messages');
const Users = require('../models/users');

/* GET home page. */
router.get('/list',  (req, res, next) => {
  let roomId = req.query.roomId;
   Messages.list(roomId,(messages)=>{  
    res.json(messages);
  })
 
});



module.exports = router;
