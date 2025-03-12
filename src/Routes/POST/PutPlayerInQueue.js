const express = require('express');
const Queue = require('../../Config/MongoDB/Models/Queue.js');
const User = require('../../Config/MongoDB/Models/User.js');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {config} = require('dotenv');
config();

router.post('/put_player_in_queue', async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = req.cookies.accessToken;

    if(!token){
        res.status(403).send('third-party-cookies are not enabled in the browser');
        return;
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const username = decoded.username;
        const user = await User.findOne({username});
        const _id = user._id;
        const profileImage = user.profileImage;
        const contentType = user.contentType;
        const newPlayerInQueue = new Queue({_id, player: username, profileImage, contentType});
        await newPlayerInQueue.save();
        res.status(200).json({message: 'Player has successfully entered the queue', username});
    }
    catch(error){
        const message = error.message;

        if(message.includes('E11000 duplicate key error collection:'))
            res.status(401).send('Player is already in the queue');
        else
            res.status(500).send(message);
    }
})

module.exports = router;