const Challenge = require('../MongoDB/Models/Challenge.js');
const User = require('../MongoDB/Models/User.js');
const WebSocket = require('ws');


const CreateWebSocketForChallenges = (server) => {
    const changeStream = Challenge.watch();
    const wss = new WebSocket.Server({noServer: true});

    server.on('upgrade', (request, socket, head) => {               // upgrade event will be triggered when the client sends a request to upgrade from http request to websocket request
        if(request.headers['upgrade'] !== 'websocket')              // if the client is not requesting an upgrade to websocket, then we destroy the websocket
            socket.destroy();
        else
            wss.handleUpgrade(request, socket, head, (ws) => {      // we handle the upgrade here
                wss.emit('connection', ws, request);                // we create the websocket connection
            })
    })

    wss.on('connection',  (ws) => {
        console.log('Front-end and back-end are connected, waiting for updates for Challenge Collection in Database');
        
        changeStream.on('change', async (change) => {
            const hasBeenChallenged = change.fullDocument.hasBeenChallenged;        //hasBeenChallenged contains the _id of the challenge document in the challenges collection
            if(!hasBeenChallenged) return;

            const challenge = await Challenge.findOne({_id: hasBeenChallenged})
            const challengerUsername = challenge.playerOne;
            const challengerData = await User.findOne({username: challengerUsername});
            ws.send(JSON.stringify(challengerData));
        })

        changeStream.on('error', (err) => {
            console.log(`MongoDB change stream error: ${err}`)
        })
    })

    ws.on('close', () => {
        console.log('Client Disconnected from ')
    })

}

