const express = require('express');
const Queue = require('../../Config/MongoDB/Models/Queue.js');
const router = express.Router();

router.post('/challenge_player_in_queue', async (req, res) => {
    const {username} = req.body;

    try{
        const player = await Queue.findOne({player: username});
        if(!player){
            res.status(404).send('player is no longer in the queue');
            return;
        }
        if(player.currentlyChallenged){
            res.status(403).send('player is currently challenged by another player');
            return;
        }

        player.currentlyChallenged = true;
        await player.save();
        res.status(200).send('player can be challenged');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send('Internal Server error has occurred, please try again later')
    }
});

module.exports = router;