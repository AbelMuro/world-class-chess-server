
const CloseWebSocket = (path) => {
    global.webSocketHandlers[`/${path}`].close();
}

module.exports = CloseWebSocket;