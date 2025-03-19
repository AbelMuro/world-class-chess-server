const ServerMessage = require('../Config/MongoDB/Models/ServerMessage.js');

const sendMessageToServer = async (message) => {
    const newMessage = new ServerMessage({message});
    await newMessage.save();
}

module.exports = sendMessageToServer;