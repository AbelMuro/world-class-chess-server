const WebSocket = require('ws');
const Queue = require('../MongoDB/Models/Queue.js');
const fs = require('fs');
const https = require('https');
const path = require('path');
const keyFile = path.join(__dirname, '../../../SSL/private.key');
const certFile = path.join(__dirname, '../../../SSL/certificate.cer');

const server = https.createServer({                               
    cert: fs.readFileSync(certFile),                
    key: fs.readFileSync(keyFile),                  
});  

const CreateWebSocketForQueue = async () => {
    console.log('Initiate WebSocket for queue');

    try{
        const changeStream = Queue.watch();
        const wss = new WebSocket.Server({server});
        
        server.on('upgrade', (request, socket, head) => {               // upgrade event will be triggered when the client sends a request to upgrade from http request to websocket request
            if(request.headers['upgrade'] !== 'websocket')              // if the client is not requesting an upgrade to websocket, then we destroy the websocket
                socket.destroy();
            else
                wss.handleUpgrade(request, socket, head, (ws) => {      // we handle the upgrade here
                    wss.emit('connection', ws, request);                // we create the websocket connection
                })
        })

        wss.on('connection', ws => {                                    //Third, you establish the connection between the back end and the front end
            console.log('Front-end and back-end are connected');
        
            changeStream.on('change', (change) => {
                ws.send('data goes here')  
            })
                                        
            ws.on('close', () => {                                        //Event listener that is triggered when the front-end is disconnected from the back-end
                console.log('Client disconnected')
            })
        })        
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }

}

module.exports = CreateWebSocketForQueue;
