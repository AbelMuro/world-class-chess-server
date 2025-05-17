const express = require('express');
const mongoose = require('mongoose');
const Match = require('../../Config/MongoDB/Models/Match.js');
const router = express.Router();


router.put('/update_match', async (req, res) => {
    const {chess, matchId} = req.body;
    const {
        board, 
        legal_squares,
        moves,
        stalemate,
        checkmate,
        time_traveling,
        castleling,
        en_passant,
        pinned_pieces,
        difficulty,
        pieceToBeMoved,
        current_turn,
        out_of_time,
    } = chess;


    try{
        const ObjectId = mongoose.Types.ObjectId;
        const _id = new ObjectId(matchId);
        const match = await Match.findOne({_id});
        if(!match){
            res.status(404).send('match not found');
            return;
        }
        match.board = board;
        match.legal_squares = legal_squares;
        match.moves = moves;
        match.stalemate = stalemate;
        match.checkmate = checkmate;
        match.time_traveling = time_traveling;
        match.castleling = castleling;
        match.en_passant = en_passant;
        match.pinned_pieces = pinned_pieces;
        match.difficulty = difficulty;
        match.pieceToBeMoved = pieceToBeMoved;
        match.current_turn = current_turn;
        match.out_of_time = out_of_time,

        await match.save();

        res.status(200).send('chess board has been updated');
    }
    catch(error){
        const message = error.message;
        res.status(500).send(message);
    }
})

module.exports = router;