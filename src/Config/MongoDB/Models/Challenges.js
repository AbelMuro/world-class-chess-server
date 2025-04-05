const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const challengesSchema = new Schema({
    playerOne: {type: String},
    playerTwo: {type: String},
    playerOneAccepted: {type: String},
    playerTwoAccepted: {type: String},
    matchId: {type: ObjectId}
});

const Challenge = mongoose.model('challenge', challengesSchema, 'challenges');

module.exports = Challenge;