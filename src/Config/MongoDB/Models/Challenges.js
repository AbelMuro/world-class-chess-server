const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const objectId = mongoose.Types.ObjectId;

const challengesSchema = new Schema({
    playerOne: {type: String},
    playerTwo: {type: String},
    playerOneAccepted: {type: String},
    playerTwoAccepted: {type: String},
    matchId: {type: objectId}
});

const Challenge = mongoose.model('challenge', challengesSchema, 'challenges');

module.exports = Challenge;