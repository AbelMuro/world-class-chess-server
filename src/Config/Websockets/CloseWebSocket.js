
const CloseWebSocket = (path) => {
    try{
        global.webSocketHandlers[`/${path}`].close();
        delete global.webSocketHandlers[`/${path}`];
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }
}

module.exports = CloseWebSocket;