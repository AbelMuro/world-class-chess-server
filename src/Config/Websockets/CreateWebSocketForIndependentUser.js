const WebSocket = require('ws');
const User = require('../MongoDB/Models/User.js');

const CreateWebSocketForIndependentUser = (userId, server) => {
    console.log('Initiate WebSocket for independent user');

    const changeStream = User.watch([{$match: {'fullDocument._id': userId}}]);
    const wss = new WebSocket.Server({noServer: true});

    server.on('upgrade', (request, socket, head) => {               // upgrade event will be triggered when the client sends a request to upgrade from http request to websocket request
        if(request.headers['upgrade'] !== 'websocket')              // if the client is not requesting an upgrade to websocket, then we destroy the websocket
            socket.destroy();
        else
            wss.handleUpgrade(request, socket, head, (ws) => {      // we handle the upgrade here
                wss.emit('connection', ws, request);                // we create the websocket connection
            })
    })

    wss.on('connection', ws => {                                    //we establish the connection between the back end and the front end
        console.log('Front-end and back-end are connected, waiting for updates on independent user collection in database');
    
        changeStream.on('change', async (change) => {
            if(change.operationType === 'delete'){
                ws.close();
                changeStream.close();
            }

            const challengedBy = change?.fullDocument?.hasBeenChallenged;       //value has already been stringified to JSON
            if(challengedBy)
                ws.send(challengedBy);              
        })

        changeStream.on('error', (error) => {
            console.log(`mongoDB change stream error: ${error}`);
        })            
                                    
        ws.on('close', () => {                                        //Event listener that is triggered when the front-end is disconnected from the back-end
            console.log('Client disconnected')
        })
    }) 
}

module.exports = CreateWebSocketForIndependentUser;