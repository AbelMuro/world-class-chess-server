const express = require('express');
const router = express.Router();
const Match = require('../../Config/MongoDB/Models/Match.js');

router.post('/create_match', async (req, res) => {
    const {chess} = req.body;
    const {
        board, 
        legal_squares, 
        moves, 
        stalemate, 
        checkmate, 
        time_traveling, 
        castleling, 
        players,
        en_passant,
        resigns,
        pinned_pieces,
        difficulty,
        pieceToBeMoved
    } = chess;


    try{
        const match = new Match({
            board, 
            legal_squares, 
            moves, 
            stalemate, 
            checkmate, 
            time_traveling, 
            castleling, 
            players, 
            en_passant,  
            resigns, 
            pinned_pieces,
            difficulty,
            pieceToBeMoved
        });

        const newMatch = await match.save();
        const matchId = newMatch._id;

        res.status(200).send(matchId);
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;