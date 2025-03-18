const express = require('express');
const router = express.Router();
const EventEmitter = require('events');
const messageQueue = require('../../utils/messageQueue.js');

const messageEmitter = new EventEmitter()

// Route for SSE
router.get('/get_messages', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendMessages = () => {
        while(messageQueue.length > 0){
            const message = messageQueue.shift();
            res.write(message);
        }
    }

    messageEmitter.on('new message', sendMessages);
});

module.exports = router;
