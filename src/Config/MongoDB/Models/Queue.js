const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const {Schema} = require('mongoose');
const WebSocket = require('ws');
const path = require('path');
const certPath = path.resolve(__dirname, 'PemFiles/cert.pem');
const keyPath = path.resolve(__dirname, 'PemFiles/key.pem');

const queueSchema = new Schema({
    player: {type: String, required: true, unique: true},
    profileImageBase64: {type: String},
    contentType: {type: String}
})

const Queue = mongoose.model('player', queueSchema, 'queue')

const server = https.createServer({
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
});

const wss = new WebSocket.Server({server});

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
