const WebSocket = require('ws');

//this is where i left off, i need to call this function to dynamically create websockets when the user logs-in or registers, 
// //and i need to disconnect the websockets when the user logs out


const server = global.httpsServer;

function CreateWebSocket(path, callback) {
    try{
        const wss = new WebSocket.Server({ noServer: true });

        server.on('upgrade', (request, socket, head) => {
            if (request.url === `/${path}`) {                                 //you can have different endpoints for your websocket   wss://domain.com/path1  etc..
                wss.handleUpgrade(request, socket, head, (ws) => {
                    wss.emit('connection', ws, request);
                });
            }
        });

        wss.on('connection', callback);
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }
}

module.exports = CreateWebSocket;