import { RED, BLACK, movePiece, isMoveLegal, getJumpedPiece } from './gameLogic';

const INFINITY = 10000;
const NEG_INFINITY = -10000;

export function computerMove(boardState) {
	const simulatedBoard = JSON.parse(JSON.stringify(boardState));
	const selectedMove = alphaBetaSearch(simulatedBoard, 8);

	if (!selectedMove) return boardState;

	const piece = simulatedBoard.pieces.find(
		(p) => p.row === selectedMove.from.row && p.col === selectedMove.from.col
	);

	return movePiece(simulatedBoard, piece, selectedMove.from, selectedMove.to);
}

function alphaBetaSearch(calcBoard, limit) {
	let alpha = NEG_INFINITY;
	let beta = INFINITY;

	const availableMoves = getAvailableMoves(BLACK, calcBoard);
	if (availableMoves.length === 0) return null;

	const max = maxValue(calcBoard, availableMoves, limit, alpha, beta);

	const bestMoves = availableMoves.filter((move) => move.score === max);
	return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function maxValue(calcBoard, computerMoves, limit, alpha, beta) {
	if (limit <= 0 && !hasJumpMove(computerMoves)) {
		return utility(calcBoard);
	}

	let max = NEG_INFINITY;

	for (const move of computerMoves) {
		const simBoard = JSON.parse(JSON.stringify(calcBoard));
		const piece = simBoard.pieces.find((p) => p.row === move.from.row && p.col === move.from.col);
		const newBoard = movePiece(simBoard, piece, move.from, move.to);

		const humanMoves = getAvailableMoves(RED, newBoard);
		const minScore = minValue(newBoard, humanMoves, limit - 1, alpha, beta);

		move.score = minScore;
		max = Math.max(max, minScore);

		if (max >= beta) break;
		alpha = Math.max(alpha, max);
	}

	return max;
}

function minValue(calcBoard, humanMoves, limit, alpha, beta) {
	if (limit <= 0 && !hasJumpMove(humanMoves)) {
		return utility(calcBoard);
	}

	let min = INFINITY;

	for (const move of humanMoves) {
		const simBoard = JSON.parse(JSON.stringify(calcBoard));
		const piece = simBoard.pieces.find((p) => p.row === move.from.row && p.col === move.from.col);
		const newBoard = movePiece(simBoard, piece, move.from, move.to);

		const computerMoves = getAvailableMoves(BLACK, newBoard);
		const maxScore = maxValue(newBoard, computerMoves, limit - 1, alpha, beta);

		move.score = maxScore;
		min = Math.min(min, maxScore);

		if (min <= alpha) break;
		beta = Math.min(beta, min);
	}

	return min;
}

function utility(targetBoard) {
	const pieceValues = targetBoard.pieces.reduce(
		(acc, piece) => {
			const value = evaluatePosition(piece.col, piece.row);
			if (piece.state > 0) {
				acc.human += 1;
				acc.humanKings += Math.abs(piece.state) > 1 ? 1 : 0;
				acc.humanPosSum += value;
			} else {
				acc.computer += 1;
				acc.computerKings += Math.abs(piece.state) > 1 ? 1 : 0;
				acc.computerPosSum += value;
			}
			return acc;
		},
		{
			human: 0,
			humanKings: 0,
			humanPosSum: 0,
			computer: 0,
			computerKings: 0,
			computerPosSum: 0
		}
	);

	const pieceDiff = pieceValues.computer - pieceValues.human;
	const kingDiff = pieceValues.computerKings - pieceValues.humanKings;

	const avgHumanPos = pieceValues.human ? pieceValues.humanPosSum / pieceValues.human : 0;
	const avgComputerPos = pieceValues.computer
		? pieceValues.computerPosSum / pieceValues.computer
		: 0;
	const avgPosDiff = avgComputerPos - avgHumanPos;

	const weights = [100, 10, 1];
	const features = [pieceDiff, kingDiff, avgPosDiff];

	return features.reduce((sum, feature, i) => sum + feature * weights[i], 0);
}

function evaluatePosition(x, y) {
	return x === 0 || x === 7 || y === 0 || y === 7 ? 5 : 3;
}

export function getAvailableMoves(player, targetBoard) {
	const playerPieces = targetBoard.pieces.filter((p) => Math.sign(p.state) === Math.sign(player));
	let moves = [];

	for (const piece of playerPieces) {
		const pieceMoves = getAvailablePieceMoves(targetBoard, piece);
		moves.push(...pieceMoves);
	}

	const jumpMoves = moves.filter((move) => move.moveType === 'jump');
	return jumpMoves.length > 0 ? jumpMoves : moves;
}

function hasJumpMove(moves) {
	return moves.some((move) => move.moveType === 'jump');
}

export function getAvailablePieceMoves(targetBoard, piece) {
	const moves = [];
	const player = Math.sign(piece.state);

	// Regular moves
	[-1, 1].forEach((dx) => {
		const to = {
			col: piece.col + dx,
			row: piece.row + player * 1
		};

		if (isMoveLegal(targetBoard.cells, targetBoard.pieces, piece, piece, to)) {
			moves.push({
				moveType: 'slide',
				from: { col: piece.col, row: piece.row },
				to
			});
		}
	});

	// Jump moves
	[-2, 2].forEach((dx) => {
		const to = {
			col: piece.col + dx,
			row: piece.row + player * 2
		};

		if (isMoveLegal(targetBoard.cells, targetBoard.pieces, piece, piece, to)) {
			moves.push({
				moveType: 'jump',
				from: { col: piece.col, row: piece.row },
				to
			});
		}
	});

	// King moves
	if (Math.abs(piece.state) > 1) {
		[-1, 1].forEach((dx) => {
			[-1, 1].forEach((dy) => {
				// Regular king moves
				let to = { col: piece.col + dx, row: piece.row + dy };
				if (isMoveLegal(targetBoard.cells, targetBoard.pieces, piece, piece, to)) {
					moves.push({
						moveType: 'slide',
						from: { col: piece.col, row: piece.row },
						to
					});
				}

				// Jump king moves
				to = { col: piece.col + dx * 2, row: piece.row + dy * 2 };
				if (isMoveLegal(targetBoard.cells, targetBoard.pieces, piece, piece, to)) {
					moves.push({
						moveType: 'jump',
						from: { col: piece.col, row: piece.row },
						to
					});
				}
			});
		});
	}

	return moves;
}
