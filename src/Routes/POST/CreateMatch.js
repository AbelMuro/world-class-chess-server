const express = require('express');
const {Match} = require('../../Config/MongoDB/Models.js');
const router = express.Router();

router.post('/create_match', async (req, res) => {
    const {board, matchId} = req.body;

    try{
        const match = new Match({board, matchId});
        await match.save();

        res.status(200).send('New match has been created');
    }
    catch(error){
        const message = error.message;
        res.status(500).send(message);
    }
})

module.exports = router;