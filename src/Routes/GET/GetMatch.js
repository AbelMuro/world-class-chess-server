const express = require('express');
const Match = require('../../Config/MongoDB/Models/Match.js');
const router = express.Router();


router.get('/get_match/:matchId', async (req, res) => {
    const matchId = req.params.matchId;

    try{
        const match = await Match.findOne({matchId});
        if(!match){
            res.status(404).send('match not found');
            return;
        }

        res.status(200).json(match);
    }
    catch(error){
        const message = error.message;
        res.status(500).send(message);
    }
})

module.exports = router;