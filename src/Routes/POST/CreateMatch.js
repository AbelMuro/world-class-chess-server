const express = require('express');
const router = express.Router();
const Match = require('../../Config/MongoDB/Models/Match.js');

router.post('/create_match', async (req, res) => {
    const {chess, playerOne, playerTwo} = req.body;
    const {
        board, 
        legal_squares, 
        moves, 
        stalemate, 
        checkmate, 
        time_traveling, 
        castleling, 
        en_passant,
        resigns,
        pinned_pieces,
        difficulty,
        pieceToBeMoved,
        current_turn,
        out_of_time,
    } = chess;

    try{

        const playerOneIsWhite = Math.round(Math.random() * 1) === 0;
        const game_settings = {
                player_one: {username: playerOne, color: playerOneIsWhite ? 'white' : 'black'},
                player_two: {username: playerTwo, color: playerOneIsWhite ? 'black' : 'white'},
        }

        const match = new Match({
            board, 
            legal_squares, 
            moves, 
            stalemate, 
            checkmate, 
            time_traveling, 
            castleling, 
            en_passant,  
            resigns, 
            game_settings,
            current_turn,
            pinned_pieces,
            difficulty,
            pieceToBeMoved,
            out_of_time
        });

        const newMatch = await match.save();
        const matchId = newMatch._id.toString();

        res.status(200).send(matchId);
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;