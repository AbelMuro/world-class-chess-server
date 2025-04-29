const mongoose = require('mongoose');
const {Schema} = require('mongoose');


const matchSchema = new Schema({
    board: {type: Array, default: [
      ['black rook a', 'black knight b', 'black bishop c', 'black queen d', 'black king e', 'black bishop f', 'black knight g', 'black rook h'],
      ['black pawn a', 'black pawn b', 'black pawn c', 'black pawn d', 'black pawn e', 'black pawn f', 'black pawn g', 'black pawn h'],      
      ['', '', '', '', '', '', '', '',],
      ['', '', '', '', '', '', '', '',],
      ['', '', '', '', '', '', '', '',],
      ['', '', '', '', '', '', '', '',],
      ['white pawn a', 'white pawn b', 'white pawn c', 'white pawn d', 'white pawn e', 'white pawn f', 'white pawn g', 'white pawn h'],
      ['white rook a', 'white knight b', 'white bishop c', 'white queen d', 'white king e', 'white bishop f', 'white knight g', 'white rook h'], 
    ]},
    legal_squares: {type: Array, default: [
      ['', '', '', '', '', '', '', '',],
      ['', '', '', '', '', '', '', '',],
      ['', '', '', '', '', '', '', '',],
      ['', '', '', '', '', '', '', '',],      
      ['', '', '', '', '', '', '', '',],
      ['', '', '', '', '', '', '', '',],
      ['', '', '', '', '', '', '', '',],
      ['', '', '', '', '', '', '', '',],
    ]},
    moves: {type: Object, default: {
      all: [],
      black_pieces_taken: [],
      white_pieces_taken: []}
    },
    stalemate: {type: Object, default: {
        movesAvailableForWhite: ['white pawn a', 'white pawn b', 'white pawn c', 'white pawn d', 'white pawn e', 'white pawn f', 'white pawn g', 'white pawn h', 'white knight b', 'white knight g'],
        movesAvailableForBlack: ['black pawn a', 'black pawn b', 'black pawn c', 'black pawn d', 'black pawn e', 'black pawn f', 'black pawn g', 'black pawn h', 'black knight b', 'black knight g'],
        game_over: false}
    },
    checkmate: {type: Object, default: {
      king_in_check: false,
      squares_between_king_and_attacker: [],
      game_over: false}
    },        
    time_traveling: {type: Object, default: {
        past: [],
        future: [],
        stop_moves: false}
    },
    castleling: {type: Object, default: {
        has_king_been_moved: false,
        has_rooks_been_moved: [false, false]}
    },    
    players: {type: Object, default: {
        user_color: 'white',
        opponent_color: 'black',
        current_turn: 'white'}
    },
    en_passant: {type: Object, default: null},
    resigns: {type: Boolean, default: false},
    pinned_pieces: {type: Array, default: []},
    difficulty: {type: String, default: ''},
    pieceToBeMoved: {type: Object, default: {
      square: {row: null, column: null}}
    }
});


const Match = mongoose.model('match', matchSchema, 'matches');

module.exports = Match;