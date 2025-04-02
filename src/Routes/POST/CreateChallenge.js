const express = require('express');
const initializeGridFs = require('../Middleware/initializeGridFs.js');
const mongoose = require('mongoose');
const CreateWebSocket = require('../../Config/Websockets/CreateWebSocket.js');
const Challenge = require('../../Config/MongoDB/Models/Challenges.js');
const User = require('../../Config/MongoDB/Models/User.js');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {config} = require('dotenv');
config();

//this is where i left off, i need to create a websocket that connects the challenger and the challenged player through a document in the Challenges collection
//i also need to save the _id of the Challenge document in the .hasBeenChallenged property of the User document

router.post('/create_challenge', initializeGridFs, async (req, res) => {
    const {playerToBeChallenged} = req.body;
    const token = req.cookies.accessToken;
    const JWT_SECRET = process.env.JWT_SECRET;
    const gfs = req.gfs;

    if(!token)
        return res.status(403).send('third-party-cookies are not enabled in the browser');

    try{
        const decoded = jwt.decode(token, JWT_SECRET);
        const username = decoded.username;
        const profileImageId = decoded.profileImageId;
        const challenge = new Challenge({playerOne: username, playerTwo: playerToBeChallenged, playerOneAccepted: true, playerTwoAccepted: false});
        const challengedPlayer = await User.findOne({username: playerToBeChallenged});
        if(challengedPlayer.hasBeenChallenged){
            res.status(401).send('Player has already been challenged by someone else');
            return;
        }   

        if(profileImageId){
            const _imageId = new mongoose.Types.ObjectId(profileImageId);
            const cursor = gfs.find({_id: _imageId});
            const files = await cursor.toArray();
            const file = files?.[0];
            const chunks = [];
            const readstream = gfs.openDownloadStream(_imageId);
            
            readstream.on('data', (chunk) => {
                chunks.push(chunk);
            })

            readstream.on('end', async () => {
                const fileBuffer = Buffer.concat(chunks);             
                const challenger = JSON.stringify({username, imageBase64: fileBuffer.toString('base64'), imageContentType: file.contentType})
                challengedPlayer.hasBeenChallenged = challenger;
                await challengedPlayer.save();
                await challenge.save();
                res.status(200).send('Invitation has been sent');
            })

            readstream.on('error', async(err) => {
                console.log('Error reading file from MongoDB', err);
                const challenger = JSON.stringify({username, imageBase64: '', imageContentType: ''})
                challengedPlayer.hasBeenChallenged = challenger;
                await challengedPlayer.save();
                await challenge.save();
                res.status(200).send('Invitation has been sent, but image could not be loaded')
            })
        }
        else{
            const challenger = JSON.stringify({username, imageBase64: '', imageContentType: ''})
            challengedPlayer.hasBeenChallenged = challenger;
            await challengedPlayer.save();
            await challenge.save();
            res.status(200).send('Invitation has been sent');            
        }
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
    
})

module.exports = router;