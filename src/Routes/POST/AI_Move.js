const express = require('express');
const path = require('path');
const router = express.Router();
const {spawn} = require('child_process');
const ConvertMatrixToFen = require('../../Config/Stockfish/utils/ConvertMatrixToFen.js')
const stockfishpath = path.resolve(__dirname, '../../Config/Stockfish/windows/stockfish.exe');

/*

    https://stockfishchess.org/download/

    for windows machine:
        download the stockfish folder for windows   (make sure you select the file appropriate for your CPU)
        in the folder, look for the .exe file
        put that file in you node.js and use it with the child_process

    for macOS machines:
        download the binaries for macOS     (make sure you select the file appropriate for your CPU)
        look for the file that ends with avx2 or something of the sort 
        put that file in your node.js and use it with the child_process

        this is where i left off, i will need to figure out how to find the best move for black and white
        the hint is in the FEN format
  
*/

router.post('/ai_move', (req, res) => {
    const {board, AI_Color} = req.body;
    const fen = ConvertMatrixToFen(board, AI_Color);

    try{
        const stockfish = spawn(stockfishpath);
        console.log('Stockfish process started with PID:', stockfish.pid);

        stockfish.stdin.write('uci\n');
        stockfish.stdin.write(`position fen ${fen}\n`);
        stockfish.stdin.write('go depth 15\n');

        stockfish.stdout.on('data', (data) => {
            const output = data.toString();

            if(output.includes('bestmove')){
                console.log(output);
                let bestMove = output.match(/bestmove\s(\w+)/)[1];  
                stockfish.stdin.write('quit\n');
                res.status(200).json({bestMove});
            }
        })

        stockfish.stderr.on('data', (data) => {
            console.error('Stockfish stderr:', data.toString());
        });

        stockfish.on('close', () => {
            console.log('stockfish process closed');
        });

        stockfish.on('error', (err) => {
            console.error('Stockfish error:', err);
            res.status(400).send('Failed to analyze position');
        });
    }
    catch(error){
        const message = error.message;
        res.status(500).send(message);
    }
});


module.exports = router;
