const express = require('express');
const Queue = require('../../Config/MongoDB/Models/Queue.js');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {config} = require('dotenv');
config();

router.delete('/leave_queue', async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = req.cookies.accessToken;

    if(!token){
        res.status(403).send('third-party-cookies are not enabled in the browser');
        return;
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const username = decoded.username;
        const result = await Queue.deleteOne({player: username});
        if(result.deletedCount === 0)
            res.status(404).send('Player was not in the queue')
        else{
            res.status(200).send('Player has successfully been removed from the queue');
        }
            
    }
    catch(error){
        const message = error.message;
        res.status(500).send(message);
    }
})

module.exports = router;