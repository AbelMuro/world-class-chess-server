const WebSocket = require('ws');
const Queue = require('../MongoDB/Models/Queue.js');

const CreateWebSocketForQueue = async (server) => {
    console.log('Initiate WebSocket for queue');

    try{
        const changeStream = Queue.watch();
        const wss = new WebSocket.Server({noServer: true});             //we create a websocket in the same server

        wss.on('connection', ws => {                                    //Third, you establish the connection between the back end and the front end
            console.log('Front-end and back-end are connected');
        
            changeStream.on('change', (change) => {
                const document = JSON.stringify(change);
                ws.send(document);  
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
