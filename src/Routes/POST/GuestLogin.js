const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const CreateWebSocket = require('../../Config/Websockets/CreateWebSocket.js');
const User = require('../../Config/MongoDB/Models/User.js');
const {config} = require('dotenv');
config();

router.post('/guestlogin', async (req, res) => {
    let username = 'Guest'
    const guestId = Array.from({length: 10}, () => null).reduce((acc) => {acc += Math.floor(Math.random() * 9); return acc}, '');
    username += guestId;

    for(let i = 0; i < 10; i++)
        username += Math.floor(Math.random() * 9);

    const token = jwt.sign({id: 'guest', email: null, username, profileImageId: ''}, JWT_SECRET);

    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    });

    CreateWebSocket(username, (ws) => {
        console.log(`Front-end and back-end are connected, waiting for updates on ${username}'s account`);
        const changeStream = User.watch([{$match: {'fullDocument.username': username}}]);

        changeStream.on('change', (change) => {
            const operationType = change.operationType;

            if(operationType === 'delete'){
                ws.close();
                changeStream.close();
            }

            const fullDocument = change.fullDocument;
            const hasBeenChallenged = fullDocument.hasBeenChallenged;

            if(hasBeenChallenged)
                ws.send(hasBeenChallenged)

        })
    })  
    res.status(200).send('User has successfully logged in as guest');
})

module.exports = router;