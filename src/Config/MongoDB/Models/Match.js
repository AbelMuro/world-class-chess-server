const mongoose = require('mongoose');
const {Schema} = require('mongoose');


const matchSchema = new Schema({
    matchId: {type: String, required: true, unique: true},
    chessboard: {type: Array},
    currentTurn: {type: String},
    blackPiecesTaken: {type: Array},
    whitePiecesTaken: {type: Array},
    playerOne: {type: String, required: true},
    playerTwo: {type: String, requ},
    playerPlayingAsWhite: {type: String},
    playerPlayingAsBlack: {type: String},
    allMoves: {type: Array},
    hasBlackKingBeenMoved: {type: Boolean},
    hasBlackRooksBeenMoved: {type: Array},
    hasWhiteKingBeenMoved: {type: Boolean},
    hasWhiteRooksBeenMoved: {type: Array}
});


const Match = mongoose.model('match', matchSchema, 'matches');

module.exports = Match;