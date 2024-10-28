<script>
	import { onMount } from 'svelte';
	import Board from './Board.svelte';
	import ScoreBoard from './ScoreBoard.svelte';
	import { initializeBoard, movePiece, getWinner, getPieceCount } from './gameLogic';
	import { computerMove } from './ai';

	let currentBoard = initializeBoard();
	let gameOver = false;

	const RED = 1;
	const BLACK = -1;

	function handleMove(event) {
		const { piece, from, to } = event.detail;

		console.log('Move attempted:', { piece, from, to });
		console.log('Current turn:', currentBoard.turn);

		if (currentBoard.turn !== RED || gameOver) {
			console.log('Move rejected: wrong turn or game over');
			return;
		}

		const newBoard = movePiece(currentBoard, piece, from, to);
		if (newBoard) {
			console.log('Move accepted, new board state:', newBoard);
			currentBoard = newBoard;

			const winner = getWinner(currentBoard);
			console.log('Winner check:', winner);
			if (winner !== 0) {
				console.log('Game over, winner:', winner);
				gameOver = true;
				return;
			}

			// Computer's turn
			currentBoard.turn = BLACK;
			setTimeout(() => {
				currentBoard = computerMove(currentBoard);
				const winner = getWinner(currentBoard);
				if (winner !== 0) {
					gameOver = true;
				} else {
					currentBoard.turn = RED;
				}
			}, 500);
		}
	}

	function startNewGame() {
		currentBoard = initializeBoard();
		gameOver = false;
	}
</script>

<main>
	<div class="game-container">
		<div class="controls">
			<button on:click={startNewGame}>Start New Game</button>
		</div>

		<div class="game-area">
			<Board board={currentBoard} on:move={handleMove} />
			<ScoreBoard pieceCount={getPieceCount(currentBoard)} {gameOver} />
		</div>
	</div>
</main>

<style>
	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
	}

	.controls {
		margin-bottom: 20px;
	}

	.game-area {
		display: flex;
		gap: 40px;
	}

	button {
		font-size: 18px;
		padding: 10px 20px;
		cursor: pointer;
	}
</style>
