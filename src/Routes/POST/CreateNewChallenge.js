const express = require('express');
const Challenge = require('../../Config/MongoDB/Models/Challenge.js');
const User = require('../../Config/MongoDB/Models/User.js');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {config} = require('dotenv');
config();

//this is where i left off, i need to finish implementing this route
// i need to make sure that the result._id is indeed a string and can be assigned to the challengeId property of the User model
// and then i can make a web socket for the User model, specifically for the hasBeenChallenged property

//oh and dont forget to test out the queue functionality with two pc's

router.post('/create_new_challenge', async (req, res) => {
    const {playerToBeChallenged, playerId} = req.body;
    const token = req.cookies.accessToken;
    const JWT_SECRET = process.env.JWT_SECRET;

    if(!token)
        return res.status(403).send('third-party-cookies are not enabled in the browser');

    try{
        const decoded = jwt.decode(token, JWT_SECRET);
        const username = decoded.username;

        const challenge = new Challenge({playerOne: username, playerTwo: playerToBeChallenged, playerOneAccepted: true, playerTwoAccepted: false})
        const result = challenge.save();
        const challengeId = result._id;

        const challengedPlayer = User.find({_id: playerId});
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