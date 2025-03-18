const express = require('express');
const router = express.Router();
const EventEmitter = require('events');
const messageQueue = require('../../utils/messageQueue.js');

//this is where i left off, i need to get this working
const messageEmitter = new EventEmitter()

// Route for SSE
router.get('/get_messages', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendMessages = () => {
        while(messageQueue.length > 0){
            const message = messageQueue.shift();
            res.write(`data: ${message}\n\n`);
        }
    }

    messageEmitter.on('new message', sendMessages);

    req.on('close', () => {
        messageEmitter.removeListener('new message', sendMessages)
    })
    
});

module.exports = router;
