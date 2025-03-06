<script>
	import { onMount } from 'svelte';
	import Board from './Board.svelte';
	import ScoreBoard from './ScoreBoard.svelte';
	import { initializeBoard, movePiece, getWinner, getPieceCount } from './gameLogic';
	import { computerMove } from './ai';

	let currentBoard = initializeBoard();
	let gameOver = false;
	let windowWidth;

	const RED = 1;
	const BLACK = -1;

	function handleMove(event) {
		const { piece, from, to } = event.detail;

		if (currentBoard.turn !== RED || gameOver) {
			return;
		}

		const newBoard = movePiece(currentBoard, piece, from, to);
		if (newBoard) {
			currentBoard = newBoard;

			const winner = getWinner(currentBoard);
			if (winner !== 0) {
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

<svelte:window bind:innerWidth={windowWidth} />

<div class="game-container">
	<div class="game-content">
		<header class="game-header">
			<h1>Checkers</h1>
			<button class="btn variant-filled" on:click={startNewGame}>
				<span class="i-lucide-refresh mr-2"></span>
				New Game
			</button>
		</header>

		<div class="game-layout">
			<div class="board-container">
				<div class="board-wrapper">
					<Board board={currentBoard} on:move={handleMove} {windowWidth} />
				</div>
			</div>

			<div class="scoreboard-container">
				<ScoreBoard pieceCount={getPieceCount(currentBoard)} {gameOver} />
			</div>
		</div>
	</div>
</div>

<style>
	.game-container {
		min-height: 100vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: hsl(var(--background));
	}

	.game-content {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.game-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0 1rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		color: hsl(var(--foreground));
		margin: 0;
	}

	.game-layout {
		display: grid;
		gap: 2rem;
		width: 100%;
		grid-template-columns: 1fr;
		align-items: start;
	}

	.board-container {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.board-wrapper {
		width: min(100%, min(calc(100vh - 16rem), 600px));
		aspect-ratio: 1;
		padding: 1rem;
	}

	.scoreboard-container {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	:global(.btn) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 2.5rem;
		padding: 0 1.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: var(--radius);
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		transition: all 0.2s;
	}

	:global(.btn:hover) {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	:global(.btn:active) {
		transform: translateY(0);
	}

	@media (min-width: 768px) {
		.game-container {
			padding: 2rem;
		}

		.game-layout {
			grid-template-columns: 1fr auto;
			gap: 3rem;
		}

		.board-wrapper {
			width: min(100%, min(calc(100vh - 12rem), 700px));
		}

		h1 {
			font-size: 2.5rem;
		}
	}

	@media (max-width: 640px) {
		.game-container {
			padding: 0.5rem;
		}

		.game-content {
			gap: 1rem;
		}

		.game-header {
			padding: 0 0.5rem;
		}

		h1 {
			font-size: 1.5rem;
		}

		.board-wrapper {
			padding: 0.5rem;
		}

		:global(.btn) {
			height: 2.25rem;
			padding: 0 1rem;
			font-size: 0.813rem;
		}
	}
</style>
