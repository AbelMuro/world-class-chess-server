const mongoose = require('mongoose');
const {Schema} = require('mongoose');


const matchSchema = new Schema({
    chessboard: {type: Array, default: [
        ['black rook a', 'black knight b', 'black bishop c', 'black queen d', 'black king e', 'black bishop f', 'black knight g', 'black rook h'],
        ['black pawn a', 'black pawn b', 'black pawn c', 'black pawn d', 'black pawn e', 'black pawn f', 'black pawn g', 'black pawn h'],      
        ['', '', '', '', '', '', '', '',],
        ['', '', '', '', '', '', '', '',],
        ['', '', '', '', '', '', '', '',],
        ['', '', '', '', '', '', '', '',],
        ['white pawn a', 'white pawn b', 'white pawn c', 'white pawn d', 'white pawn e', 'white pawn f', 'white pawn g', 'white pawn h'],
        ['white rook a', 'white knight b', 'white bishop c', 'white queen d', 'white king e', 'white bishop f', 'white knight g', 'white rook h'], 
      ]},
    currentTurn: {type: String},
    blackPiecesTaken: {type: Array},
    whitePiecesTaken: {type: Array},
    playerOne: {type: String},
    playerTwo: {type: String},
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