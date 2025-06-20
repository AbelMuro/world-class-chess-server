const express = require('express');
const Queue = require('../../Config/MongoDB/Models/Queue.js');
const router = express.Router();


router.put('/cancel_challenge', async (req, res) => {
    const {username} = req.body;

    try{
        const player = await Queue.findOne({player: username});
        if(!player){
            res.status(404).send('Player was not found in the queue');
            return;
        }

        player.currentlyChallenged = false;
        await player.save();
        res.status(200).send('Player is no longer currently challenged');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
})

module.exports = router;