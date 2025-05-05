const express = require('express');
const router = express.Router();
const Match = require('../../Config/MongoDB/Models/Match.js');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.delete('/delete_match/:matchId', async (req, res) => {
    try{
        const matchId = req.params.matchId;
        const _id = new ObjectId(matchId);
        const result = await Match.deleteOne({_id});
        if(result.deletedCount === 0){
            res.status(404).send('Match not found');
            return;
        }

        res.status(200).send('Match successfully deleted');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
})

module.exports = router;