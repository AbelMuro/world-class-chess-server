const WebSocket = require('ws');
const Queue = require('../MongoDB/Models/Queue.js');


//this is where i left off, i will need to configure the cluster in mongoDB and use replica set mode

const CreateWebSocketForQueue = async (server) => {
    console.log('Initiate WebSocket for queue');

    try{
        const changeStream = Queue.watch();
        const wss = new WebSocket.Server({noServer: true});             //we create a websocket in the same server
        
        server.on('upgrade', (request, socket, head) => {               // upgrade event will be triggered when the client sends a request to upgrade from http request to websocket request
            if(request.headers['upgrade'] !== 'websocket')              // if the client is not requesting an upgrade to websocket, then we destroy the websocket
                socket.destroy();
            else
                wss.handleUpgrade(request, socket, head, (ws) => {      // we handle the upgrade here
                    wss.emit('connection', ws, request);                // we create the websocket connection
                })
        })

        wss.on('connection', ws => {                                    //we establish the connection between the back end and the front end
            console.log('Front-end and back-end are connected');
        
            changeStream.on('change', (change) => {
                const document = JSON.stringify(change);
                ws.send(document);  
            })
                                        
            ws.on('close', () => {                                        //Event listener that is triggered when the front-end is disconnected from the back-end
                console.log('Client disconnected')
            })
        })    
        
        changeStream.on('error', (error) => {
            console.log(`mongoDB change stream error: ${error}`);
        })
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }

}

module.exports = CreateWebSocketForQueue;
