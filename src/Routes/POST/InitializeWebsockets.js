const express = require('express');
const router = express.Router();
const Queue = require('../../Config/MongoDB/Models/Queue.js');
const User = require('../../Config/MongoDB/Models/User.js'); 
const CreateWebSocket = require('../../Config/Websockets/CreateWebSocket.js');
const jwt = require('jsonwebtoken')
const {config} = require('dotenv');
config();

router.post('/initialize_websockets', (req, res) => {
    const token = req.cookies.accessToken;
    const JWT_SECRET = process.env.JWT_SECRET;

    if(!token){
        res.status(403).send('third-party-cookies are not enabled in the browser');
        return;
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const username = decoded.username;

        CreateWebSocket('queue', ws => {                                 
            console.log('Front-end and back-end are connected, waiting for updates on queue collection in database');
            const changeStream = Queue.watch();
        
            changeStream.on('change', async () => {
                const queue = await Queue.find();
                const documents = JSON.stringify(queue);
                ws.send(documents);  
            })
        
            changeStream.on('error', (error) => {
                console.log(`mongoDB change stream error: ${error}`);
            })            
                                        
            ws.on('close', () => {                                        //Event listener that is triggered when the front-end is disconnected from the back-end
                console.log('Client disconnected')
            })
        });

        CreateWebSocket(username, (ws) => {
            console.log(`Front-end and back-end are connected, waiting for updates on ${username}'s account`);
            const changeStream = User.watch([{$match : {'fullDocument.username': username}}]);

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

            changeStream.on('error', (error) => {
                console.log(`mongoDB change stream error: ${error}`);
            })    

            ws.on('close', () => {                                        //Event listener that is triggered when the front-end is disconnected from the back-end
                console.log('Client disconnected')
            })
        })  

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
})

module.exports = router;