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
    const changeStream = Queue.watch();

    const wss = new WebSocket.Server({server});

    wss.on('connection', ws => {                                        //Third, you establish the connection between the back end and the front end
        console.log('Front-end and back-end are connected');
    
        changeStream.on('change', (change) => {
            ws.send('data goes here')  
        })
                                    
        ws.on('close', () => {                                        //Event listener that is triggered when the front-end is disconnected from the back-end
            console.log('Client disconnected')
        })
    })
}

module.exports = CreateWebSocketForQueue;
