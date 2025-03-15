const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const WebSocket = require('ws');

const queueSchema = new Schema({
    player: {type: String, required: true, unique: true},
    profileImageBase64: {type: String},
    contentType: {type: String}
})

const Queue = mongoose.model('player', queueSchema, 'queue')

const wss = new WebSocket.Server({port: 8000});

wss.on('connection', ws => {
    console.log('Queue collection connected');

    const changeStream = Queue.watch();
    changeStream.on('change', (change) => {
        ws.send(JSON.stringify(change))
    })

    ws.on('close', () => {
        console.log('Client disconnected')
    })
})


module.exports = Queue
