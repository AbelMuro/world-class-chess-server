const mongoose = require('mongoose');
const {Schema} = require('mongoose');


const serverMessageSchema = new Schema({
    message: {type: String, required: true}
});


const ServerMessage = mongoose.model('message', serverMessageSchema, 'server-messages');

module.exports = ServerMessage;