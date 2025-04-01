const express = require('express');
const User = require('../../Config/MongoDB/Models/User.js');
const Match = require('../../Config/MongoDB/Models/Match.js');
const {config} = require('dotenv');
const jwt = require('jsonwebtoken');
const router = express.Router();
config();

router.post('/accept_invitation', async (req, res) => {
    const {challenger, challengedPlayer, board} = req.body;
    const JWT_SECRET = process.env.JWT_SECRET
    const token = req.cookies.accessToken;

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const username = decoded.username;
        const user = await User.findOne({username});
        user.hasBeenChallenged = '';
        await user.save();
        const randomNumber = Math.floor(Math.random() * 2) + 1 === 2;
        const playerPlayingAsWhite = randomNumber === 2 ? challenger : challengedPlayer;
        const playerPlayingAsBlack =  randomNumber === 2 ? challengedPlayer : challenger;
        const newMatch = new Match({playerOne: challenger, playerTwo: challengedPlayer, playerPlayingAsWhite, playerPlayingAsBlack, board});
        const _matchId = await newMatch.save();

        res.status(200).json({message : `Match has been created between ${challenger} and ${challengedPlayer}`, _matchId});
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
})

module.exports = router;