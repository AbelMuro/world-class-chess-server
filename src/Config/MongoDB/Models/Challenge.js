const mongoose = require('mongoose');
const {Schema} = require('mongoose');


const challengeSchema = new Schema({
    playerOne: {type: String, required: true},
    playerTwo: {type: String, required: true},
    playerOneAccepted: {type: Boolean, required: true},
    playerTwoAccepted: {type: Boolean, required: true},
});


const Challenge = mongoose.model('challenge', challengeSchema, 'challengers');

module.exports = Challenge;