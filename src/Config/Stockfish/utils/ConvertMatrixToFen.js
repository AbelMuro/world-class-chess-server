export const ConvertMatrixToFen = (matrix) => {
    const pieceMap = {
        'white king': 'K', 'white queen': 'Q', 'white rook': 'R',
        'white bishop': 'B', 'white knight': 'N', 'white pawn': 'P',
        'black king': 'k', 'black queen': 'q', 'black rook': 'r',
        'black bishop': 'b', 'black knight': 'n', 'black pawn': 'p'
    };

    let fen = '';
    for (let row of matrix) {
        let emptyCount = 0;
        for (let cell of row) {
            if (cell === '') {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    fen += emptyCount;
                    emptyCount = 0;
                }
                const pieceKey = cell.split(' ')[0] + ' ' + cell.split(' ')[1];
                fen += pieceMap[pieceKey];
            }
        }
        if (emptyCount > 0) {
            fen += emptyCount;
        }
        fen += '/';
    }

    fen = fen.slice(0, -1); // Remove trailing '/'
    fen += ' w - - 0 1'; // Add default FEN suffix (to be modified as needed)
    return
}