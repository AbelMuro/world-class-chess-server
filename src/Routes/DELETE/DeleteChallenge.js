const express = require('express');
const Challenge = require('../../Config/MongoDB/Models/Challenges.js');
const router = express.Router();

router.delete('/delete_challenge/:id', async (req, res) => {
    const challengeId = req.params.id;

    try{
        const challenge = Challenge.deleteOne()

        //res.status(200).json({message : `Match has been created between ${challenger} and ${challengedPlayer}`, _matchId});  
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
})

module.exports = router;