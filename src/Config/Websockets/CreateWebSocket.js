const WebSocket = require('ws');

//this is where i left off, i need to call this function to dynamically create websockets when the user logs-in or registers, 
// //and i need to disconnect the websockets when the user logs out


function CreateWebSocket(path, callback) {
    try{
        const wss = new WebSocket.Server({ noServer: true });
        global.webSocketHandlers[`/${path}`] = wss;

        wss.on('connection', callback);
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }
}

module.exports = CreateWebSocket;