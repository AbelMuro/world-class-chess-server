const express = require('express');
const router = express.Router();
const {messageQueue, messageEmitter} = require('../../utils/messageQueue.js');

// Route for SSE
router.get('/get_messages', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://world-class-chess.netlify.app');
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
