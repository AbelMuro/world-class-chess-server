const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const Ably = require('ably');
const ably = new Ably.Realtime(process.env.ABLY_API_KEY); 
const channel = ably.channels.get('queue-channel');

const queueSchema = new Schema({
    player: {type: String, required: true, unique: true},
    profileImageBase64: {type: String},
    contentType: {type: String}
})

const Queue = mongoose.model('player', queueSchema, 'queue')

const changeStream = Queue.watch();

changeStream.on('change', (change) => {
    console.log('new player has joined the queue');

    channel.publish('queue-update', change, (err) => {
        if(err) {
            console.error('Failed to publish message', err);
        }
        else
            console.log('Change publish to ably channel');
    })
})

module.exports = Queue
