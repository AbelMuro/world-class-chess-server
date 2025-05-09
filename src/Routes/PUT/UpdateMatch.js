const express = require('express');
const mongoose = require('mongoose');
const Match = require('../../Config/MongoDB/Models/Match.js');
const router = express.Router();


router.put('/update_match', async (req, res) => {
    const {chess, matchId} = req.body;

    try{
        const ObjectId = mongoose.Types.ObjectId;
        const _id = new ObjectId(matchId);
        const match = await Match.findOne({_id});
        if(!match){
            res.status(404).send('match not found');
            return;
        }
        match.board = chess.board;
        match.legal_squares = chess.legal_squares;
        match.moves = chess.moves;
        match.stalemate = chess.stalemate;
        match.checkmate = chess.checkmate;
        match.time_traveling = chess.time_traveling;
        match.castleling = chess.castleling;
        match.en_passant = chess.en_passant;
        match.pinned_pieces = chess.pinned_pieces;
        match.difficulty = chess.difficulty;
        match.pieceToBeMoved = chess.pieceToBeMoved;
        match.current_turn = chess.current_turn;

        await match.save();

        res.status(200).send('chess board has been updated');
    }
    catch(error){
        const message = error.message;
        res.status(500).send(message);
    }
})

module.exports = router;