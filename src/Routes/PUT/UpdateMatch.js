const express = require('express');
const Match = require('../../Config/MongoDB/Models/Match.js');
const router = express.Router();


router.put('/update_match', async (req, res) => {
    const {board, currentTurn, matchId, blackPiecesTaken, whitePiecesTaken, moves, hasKingBeenMoved, hasRooksBeenMoved} = req.body;

    try{
        const match = await Match.findOne({matchId});
        if(!match){
            res.status(404).send('match not found');
            return;
        }
        match.chessboard = board;
        match.currentTurn = currentTurn;
        match.blackPiecesTaken = blackPiecesTaken;
        match.whitePiecesTaken = whitePiecesTaken;
        match.allMoves = moves;
        /* 
            if(userColor === 'white'){
                match.hasWhiteKingBeenMoved = hasKingBeenMoved;
                match.hasWhiteRooksBeenMoved = hasRooksBeenMoved
            }        
        */


        await match.save();

        res.status(200).send('chess board has been updated');
    }
    catch(error){
        const message = error.message;
        res.status(500).send(message);
    }
})

module.exports = router;