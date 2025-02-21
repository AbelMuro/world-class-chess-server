const express = require('express');
const path = require('path');
const router = express.Router();
const {spawn} = require('child_process');
const ConvertMatrixToFen = require('../../Config/Stockfish/utils/ConvertMatrixToFen.js')
const stockfishpath = path.resolve(__dirname, '../../Config/Stockfish/windows/stockfish.exe');

/*

    https://stockfishchess.org/download/

    for windows machine:
        download the stockfish folder for windows
        in the folder, look for the .exe file
        put that file in you node.js and use it with the child_process

    for macOS machines:
        download the binaries for macOS
        look for the file that ends with avx2 or something of the sort
        put that file in your node.js and use it with the child_process

    this is where i left off, i finished the front end implementation of this route
    now i need to figure out how stockfish works
    
*/

router.post('/ai_move', (req, res) => {
    const board = req.body;
    const fen = ConvertMatrixToFen(board);

    try{
        const stockfish = spawn(stockfishpath);

        if(!stockfish){
            res.status(500).send('stockfish object is undefined');
            return;
        }

        stockfish.stdin.write('uci\n');
        stockfish.stdin.write(`position fen ${fen}\n`);
        stockfish.stdin.write('go depth 15\n');
        stockfish.stdin.end();

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

        /* stockfish.on('error', (err) => {
            console.log('error')
            console.error('Stockfish error:', err);
            res.status(400).send('failed to analyze position');
        });

        */        
    }
    catch(error){
        const message = error.message;
        res.status(500).send(message);
    }

})

module.exports = router;
