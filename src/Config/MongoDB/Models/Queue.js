const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const queueSchema = new Schema({
    player: {type: String, required: true, unique: true}
})

const Queue = mongoose.model('player', queueSchema, 'queue')

module.exports = Queue
