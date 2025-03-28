const express = require('express');
const Challenge = require('../../Config/MongoDB/Models/Challenge.js');
const User = require('../../Config/MongoDB/Models/User.js');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {config} = require('dotenv');
config();

//this is where i left off, i need to finish implementing this route
// i need to make a web socket for the User model, specifically for the hasBeenChallenged property


router.post('/create_new_challenge', async (req, res) => {
    const {playerToBeChallenged} = req.body;
    const token = req.cookies.accessToken;
    const JWT_SECRET = process.env.JWT_SECRET;

    if(!token)
        return res.status(403).send('third-party-cookies are not enabled in the browser');

    try{
        const decoded = jwt.decode(token, JWT_SECRET);
        const username = decoded.username;

        const challenge = new Challenge({playerOne: username, playerTwo: playerToBeChallenged, playerOneAccepted: true, playerTwoAccepted: false})
        const result = await challenge.save();
        const challengeId = result._id;

        const challengedPlayer = User.find({username: playerToBeChallenged});
        challengedPlayer.hasBeenChallenged = challengeId;
        await challengedPlayer.save();
        res.status(200).send('Invitation has been sent');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
    
})

module.exports = router;