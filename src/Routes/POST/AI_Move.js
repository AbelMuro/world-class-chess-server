const express = require('express');
const path = require('path');
const router = express.Router();
const {spawn} = require('child_process');
const {ConvertMatrixToFen} = require('../../Config/Stockfish/utils/ConvertMatrixToFen.js')
const stockfishpath = path.resolve(__dirname, '../../Config/Stockfish/bin/stockfish');

/*
    first clone repo https://github.com/official-stockfish/Stockfish
    then cd src and run the command Make build
    copy the stockfish file in the src folder and put it in your node.js app

    this is where i left off, i finished the front end implementation of this route
    now i need to figure out how stockfish works
    
*/

router.post('/ai_move', (req, res) => {
    const board = req.body;
    const fen = ConvertMatrixToFen(board);
    const stockfish = spawn(stockfishpath);

    if(!stockfish){
        res.status(500).send('stockfish object is undefined');
        return;
    }

    stockfish.stdin.write('uci\n');
    stockfish.stdin.write(`position fen ${fen}\n`);
    stockfish.stdin.write('go depth 15\n');

    let bestMove = '';

    stockfish.stdout.on('data', (data) => {
        const output = data.toString();

        if(output.includes('bestmove')){
            bestMove = output.match(/bestmove\s(\w+)/)[1];
            stockfish.stdin.write('quit\n');
        }
    })

    stockfish.on('close', () => {
        res.status(200).json({bestMove});
    });

    stockfish.on('error', (err) => {
    console.error('Stockfish error:', err);
        res.status(400).json({ error: 'Failed to analyze position' });
    });
})

module.exports = router;
