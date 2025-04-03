const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const challengesSchema = new Schema({
    playerOne: {type: String},
    playerTwo: {type: String},
    playerOneAccepted: {type: String},
    playerTwoAccepted: {type: String},
});

const Challenge = mongoose.model('challenge', challengesSchema, 'challenges');

module.exports = Challenge;