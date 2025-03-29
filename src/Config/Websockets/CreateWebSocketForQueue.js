const WebSocket = require('ws');
const Queue = require('../MongoDB/Models/Queue.js');

//this is where i left off, i need to call this function to dynamically create websockets when the user logs-in or registers, 
// //and i need to disconnect the websockets when the user logs out

function CreateWebSocketForQueue(server, path) {
    try{
        const wss = new WebSocket.Server({ noServer: true });

        server.on('upgrade', (request, socket, head) => {
            if (request.url === `/${path}`) {                                 //you can have different endpoints for your websocket   wss://domain.com/path1  etc..
                wss.handleUpgrade(request, socket, head, (ws) => {
                    wss.emit('connection', ws, request);
                });
            }
            else
                socket.destroy();
        });

        wss.on('connection', ws => {                                 
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
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }
}

module.exports = CreateWebSocketForQueue;