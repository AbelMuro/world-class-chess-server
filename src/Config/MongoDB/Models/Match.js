const mongoose = require('mongoose');
const {Schema} = require('mongoose');


const matchSchema = new Schema({
    matchId: {type: String, required: true, unique: true},
    chessboard: {type: Array, required: true},
    currentTurn: {type: String},
    blackPiecesTaken: {type: Array},
    whitePiecesTaken: {type: Array},
    white: {type: String},
    black: {type: String},
    allMoves: {type: Array},
    hasBlackKingBeenMoved: {type: Boolean},
    hasBlackRooksBeenMoved: {type: Array},
    hasWhiteKingBeenMoved: {type: Boolean},
    hasWhiteRooksBeenMoved: {type: Array}
});


const Match = mongoose.model('match', matchSchema, 'matches');

module.exports = Match;