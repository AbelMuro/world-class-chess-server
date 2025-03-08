const express = require('express');
const {Match} = require('../../Config/MongoDB/Models.js');
const router = express.Router();


//this is where i left off, i need to finish this route
router.put('/update_match', async (req, res) => {
    const {board, currentTurn, matchId} = req.body;

    try{
        const match = await Match.findOne({matchId});
        match.board = board;
        match.currentTurn = currentTurn;
        await match.save();

        res.status(200).send('New match has been created');
    }
    catch(error){
        const message = error.message;
        res.status(500).send(message);
    }
})

module.exports = router;