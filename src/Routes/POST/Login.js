const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../Config/MongoDB/Models/User.js');
const {config} = require('dotenv');
config();

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;

    try{
        const user = await User.findOne({email});

        if(!user || !(await user.matchPassword(password))){
            res.status(401).send('Email or password is incorrect');
            return;
        }

        const token = jwt.sign({id: user._id, email, username: user.username, profileImageId: user.profileImageId}, JWT_SECRET);

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });
        CreateWebSocket(user.username, (ws) => {
            console.log(`Front-end and back-end are connected, waiting for updates on ${user.username}'s account`);
            const changeStream = User.watch([{'$match': {'fullDocument.username': user.username}}]);

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
        res.status(200).send('User has successfully logged in');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }

})

module.exports = router;