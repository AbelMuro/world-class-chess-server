const WebSocket = require('ws');



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