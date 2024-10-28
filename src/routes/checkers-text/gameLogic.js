import { getAvailableMoves, getAvailablePieceMoves } from './ai';

export const RED = 1;
export const BLACK = -1;
export const EMPTY = 0;
export const RED_KING = 1.1;
export const BLACK_KING = -1.1;

export function initializeBoard() {
	const initialBoard = [
		[RED, EMPTY, RED, EMPTY, RED, EMPTY, RED, EMPTY],
		[EMPTY, RED, EMPTY, RED, EMPTY, RED, EMPTY, RED],
		[RED, EMPTY, RED, EMPTY, RED, EMPTY, RED, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, BLACK, EMPTY, BLACK, EMPTY, BLACK, EMPTY, BLACK],
		[BLACK, EMPTY, BLACK, EMPTY, BLACK, EMPTY, BLACK, EMPTY],
		[EMPTY, BLACK, EMPTY, BLACK, EMPTY, BLACK, EMPTY, BLACK]
	];

	const cells = [];
	const pieces = [];

	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			const state = initialBoard[i][j];
			cells.push({ row: i, col: j, state });
			if (state !== EMPTY) {
				pieces.push({ row: i, col: j, state });
			}
		}
	}

	return { cells, pieces, turn: RED };
}

export function isMoveLegal(cells, pieces, piece, from, to) {
	if (to.col < 0 || to.row < 0 || to.col > 7 || to.row > 7) {
		return false;
	}

	const distance = {
		x: to.col - from.col,
		y: to.row - from.row
	};

	if (distance.x === 0 || distance.y === 0) return false;
	if (Math.abs(distance.x) !== Math.abs(distance.y)) return false;
	if (Math.abs(distance.x) > 2) return false;

	const toCell = cells.find((cell) => cell.col === to.col && cell.row === to.row);
	if (!toCell || toCell.state !== EMPTY) return false;

	if (Math.abs(distance.x) === 2) {
		const jumpedPiece = getJumpedPiece(cells, pieces, from, to);
		if (!jumpedPiece) return false;

		const pieceState = Math.floor(piece.state);
		const jumpedState = Math.floor(jumpedPiece.state);
		if (pieceState !== -jumpedState) return false;
	}

	if (Math.abs(piece.state) === 1 && Math.sign(piece.state) !== Math.sign(distance.y)) {
		return false;
	}

	return true;
}

export function getJumpedPiece(cells, pieces, from, to) {
	const distance = {
		x: to.col - from.col,
		y: to.row - from.row
	};

	if (Math.abs(distance.x) === 2) {
		const jumpRow = from.row + Math.sign(distance.y);
		const jumpCol = from.col + Math.sign(distance.x);
		return pieces.find((p) => p.row === jumpRow && p.col === jumpCol);
	}

	return null;
}

export function movePiece(boardState, piece, from, to) {
	const newBoardState = JSON.parse(JSON.stringify(boardState));
	const jumpedPiece = getJumpedPiece(newBoardState.cells, newBoardState.pieces, from, to);

	// Update cells
	const fromCell = newBoardState.cells.find((c) => c.row === from.row && c.col === from.col);
	const toCell = newBoardState.cells.find((c) => c.row === to.row && c.col === to.col);

	fromCell.state = EMPTY;
	toCell.state = piece.state;

	// Update pieces
	const movingPiece = newBoardState.pieces.find((p) => p.row === from.row && p.col === from.col);
	movingPiece.row = to.row;
	movingPiece.col = to.col;

	// King promotion
	if ((to.row === 0 && piece.state === RED) || (to.row === 7 && piece.state === BLACK)) {
		movingPiece.state *= 1.1;
		toCell.state = movingPiece.state;
	}

	// Remove jumped piece
	if (jumpedPiece) {
		const jumpedCell = newBoardState.cells.find(
			(c) => c.row === jumpedPiece.row && c.col === jumpedPiece.col
		);
		jumpedCell.state = EMPTY;

		const jumpedIndex = newBoardState.pieces.findIndex(
			(p) => p.row === jumpedPiece.row && p.col === jumpedPiece.col
		);
		newBoardState.pieces.splice(jumpedIndex, 1);

		// Check for multiple jumps
		const moreJumps = getAvailablePieceMoves(newBoardState, movingPiece).filter(
			(move) => move.moveType === 'jump'
		);

		if (moreJumps.length > 0) {
			return movePiece(newBoardState, movingPiece, { row: to.row, col: to.col }, moreJumps[0].to);
		}
	}

	// Switch turns
	newBoardState.turn *= -1;

	return newBoardState;
}

export function getWinner(boardState) {
	const pieceCount = getPieceCount(boardState);
	console.log('🚀 ~ getWinner ~ pieceCount:', pieceCount);

	// Check if any side has no pieces
	// if (pieceCount.red === 0) return BLACK;
	// if (pieceCount.black === 0) return RED;

	// Check if current player has any legal moves
	const availableMoves = getAvailableMoves(boardState.turn, boardState);
	if (availableMoves.length === 0) {
		return -boardState.turn; // Return the opposite player as winner
	}

	return 0; // Game is still ongoing
}

export function getPieceCount(boardState) {
	return boardState.pieces.reduce(
		(count, piece) => {
			if (Math.abs(piece.state) === RED) count.red++;
			if (Math.abs(piece.state) === BLACK) count.black++;
			return count;
		},
		{ red: 0, black: 0 }
	);
}
