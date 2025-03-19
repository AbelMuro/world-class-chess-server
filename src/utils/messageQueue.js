const EventEmitter = require('events');

const messageQueue = [];
const messageEmitter = new EventEmitter()

module.exports = {messageQueue, messageEmitter};