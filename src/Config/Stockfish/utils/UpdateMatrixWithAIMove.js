export function UpdateMatrixWithAIMove(matrix, move) {
    // Convert the move from algebraic notation to matrix coordinates
    const fromRow = 8 - parseInt(move[1]);
    const fromCol = move.charCodeAt(0) - 'a'.charCodeAt(0);
    const toRow = 8 - parseInt(move[3]);
    const toCol = move.charCodeAt(2) - 'a'.charCodeAt(0);

    // Perform the move on the matrix
    matrix[toRow][toCol] = matrix[fromRow][fromCol];
    matrix[fromRow][fromCol] = '';

    return matrix;
}