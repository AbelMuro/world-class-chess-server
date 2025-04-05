
const CloseWebSocket = (path) => {
    try{
        global.webSocketHandlers[`/${path}`].close();
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }
}

module.exports = CloseWebSocket;