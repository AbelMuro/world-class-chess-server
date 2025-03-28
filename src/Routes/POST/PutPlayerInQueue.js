const express = require('express');
const mongoose = require('mongoose');
const initializeGridFs = require('../Middleware/initializeGridFs.js');
const Queue = require('../../Config/MongoDB/Models/Queue.js');
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
        const profileImageId = decoded.profileImageId;
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
                try{
                    console.log('Image has been uploaded from Mongo')
                    const fileBuffer = Buffer.concat(chunks);
                    const base64 = fileBuffer.toString('base64');
                    const newPlayerInQueue = new Queue({player: username, profileImageBase64: base64, contentType});
                    await newPlayerInQueue.save();
                    res.status(200).json({message: 'Player has successfully entered the queue', username});
                }
                catch(error){
                    const message = error.message;
                    console.log(message);
                    if(message.includes('E11000 duplicate key error collection:'))
                        res.status(401).send('Player is already in queue');
                    else
                        res.status(500).send(message);
                }
            })

            readstream.on('error', async (err) => {
                try{
                    console.log('Error getting Image file from MongoDB', err);
                    const newPlayerInQueue = new Queue({player: username, profileImageBase64: '', contentType: null});
                    await newPlayerInQueue.save();
                    res.status(200).json({message: 'Player has successfully entered the queue but image could not be loaded', username})                    
                }
                catch(error){
                    const message = error.message;
                    console.log(message);
                    if(message.includes('E11000 duplicate key error collection:'))
                        res.status(401).send('Player is already in queue');
                    else
                        res.status(500).send(message);

                }
            })
        }
        else{
            const newPlayerInQueue = new Queue({player: username, profileImageBase64: '', contentType: null});
            await newPlayerInQueue.save();
            console.log('Player has entered the queue');
            res.status(200).json({message: 'Player has successfully entered the queue', username});
        }
    }
    catch(error){
        const message = error.message;
        console.log(message);
        if(message.includes('E11000 duplicate key error collection:'))
            res.status(401).send('Player is already in the queue');
        else
            res.status(500).send(message);
    }
})

module.exports = router;