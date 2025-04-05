const express = require('express');
const Challenge = require('../../Config/MongoDB/Models/Challenges.js');
const CloseWebSocket = require('../../Config/Websockets/CloseWebSocket.js');
const router = express.Router();

router.delete('/delete_challenge/:id', async (req, res) => {
    const challengeId = req.params.id;

    try{
        await Challenge.deleteOne({_id: challengeId});
        CloseWebSocket(challengeId);
        res.status(200).send('Websocket has been destroyed, and challenge document has been deleted');  
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
})

module.exports = router;