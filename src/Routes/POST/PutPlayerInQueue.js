const express = require('express');
const mongoose = require('mongoose');
const initializeGridFs = require('../Middleware/initializeGridFs.js');
const sendMessageToServer = require('../../utils/sendMessageToServer.js');
const Queue = require('../../Config/MongoDB/Models/Queue.js');
const User = require('../../Config/MongoDB/Models/User.js');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {config} = require('dotenv');
config();

router.post('/put_player_in_queue', initializeGridFs, async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = req.cookies.accessToken;
    const gfs = req.gfs;

    if(!token){
        res.status(403).send('third-party-cookies are not enabled in the browser');
        return;
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const username = decoded.username;
        const user = await User.findOne({username});
        const _id = user._id;
        const profileImageId = user.profileImageId;
        let contentType;
        
        if(profileImageId){
            const _imageId = new mongoose.Types.ObjectId(profileImageId);
            const chunks = [];
            const readstream = gfs.openDownloadStream(_imageId);
            const cursor = gfs.find({_id: _imageId});
            const files = await cursor.toArray();
            const file = files?.[0];
            contentType = file.contentType;

            readstream.on('data', (chunk) => {
                chunks.push(chunk);
            })

            readstream.on('end', async () => {
                const fileBuffer = Buffer.concat(chunks);
                const base64 = fileBuffer.toString('base64');
                const newPlayerInQueue = new Queue({_id, player: username, profileImageBase64: base64, contentType});
                await newPlayerInQueue.save();
                await sendMessageToServer(`${username} has entered the queue`);
                res.status(200).json({message: 'Player has successfully entered the queue'});
            })

            readstream.on('error', async (err) => {
                console.log('Error reading file from MongoDB', err);
                const newPlayerInQueue = new Queue({_id, player: username});
                await newPlayerInQueue.save();
                await sendMessageToServer(`${username} has entered the queue, but their image could not be loaded`);
                res.status(200).json({message: 'Player has successfully entered the queue but image could not be loaded'})
            })
        }
        else{
            const newPlayerInQueue = new Queue({_id, player: username});
            await newPlayerInQueue.save();
            await sendMessageToServer(`${username} has entered the queue`);
            res.status(200).json({message: 'Player has successfully entered the queue', username});
        }

    }
    catch(error){
        const message = error.message;
        await sendMessageToServer(`Internal Server Error: ${message}`);
        if(message.includes('E11000 duplicate key error collection:'))
            res.status(401).send('Player is already in the queue');
        else
            res.status(500).send(message);
    }
})

module.exports = router;