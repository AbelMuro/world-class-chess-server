const express = require('express');
const User = require('../../Config/MongoDB/Models/User.js');
const Challenge = require('../../Config/MongoDB/Models/Challenges.js');
const Match = require('../../Config/MongoDB/Models/Match.js');
const {config} = require('dotenv');
const jwt = require('jsonwebtoken');
const router = express.Router();
config();

//look at notes in <DisplayChallenger/> in front-end to see what needs to be done

router.post('/handle_challenge', async (req, res) => {
    const {challengeId, decision} = req.body;
    const JWT_SECRET = process.env.JWT_SECRET
    const token = req.cookies.accessToken;

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const username = decoded.username;
        const user = await User.findOne({username});
        user.hasBeenChallenged = '';
        await user.save();

        const challenge = await Challenge.findOne({_id: challengeId})
        if(!challenge){
            res.status(404).send('Challenge document could not be found, challenger most likely left the queue');
            return;
        }

        challenge.playerTwoAccepted = decision;

        if(decision === 'accepted'){
            const challenger = challenge.playerOne;
            const challengedPlayer = challenge.playerTwo;
            const randomNumber = Math.floor(Math.random() * 2) + 1;
            const playerPlayingAsWhite = randomNumber === 2 ? challenger : challengedPlayer;
            const playerPlayingAsBlack =  randomNumber === 2 ? challengedPlayer : challenger;
            const newMatch = new Match({playerOne: challenger, playerTwo: challengedPlayer, playerPlayingAsWhite, playerPlayingAsBlack});
            const {_id: _matchId} = await newMatch.save();
            challenge.matchId = _matchId;
        }

        await challenge.save();
        res.status(200).send('success');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
})

module.exports = router;