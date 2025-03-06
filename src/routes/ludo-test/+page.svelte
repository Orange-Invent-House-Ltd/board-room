<script lang="ts">
	import { onMount } from 'svelte';
	import {
		COORDINATES_MAP,
		PLAYERS,
		BASE_POSITIONS,
		START_POSITIONS,
		HOME_ENTRANCE,
		HOME_POSITIONS,
		TURNING_POINTS,
		SAFE_POSITIONS,
		STATE,
		STEP_LENGTH
	} from './constants';

	let currentPositions = {
		P1: [...BASE_POSITIONS.P1],
		P2: [...BASE_POSITIONS.P2]
	};

	let diceValue = 0;
	let turn = 0;
	let state = STATE.DICE_NOT_ROLLED;
	let isRolling = false;
	let gameStarted = false;
	/** @type {'P1' | 'P2' | null} */
	let winner = null;
	let dice1Value = 0;
	let dice2Value = 0;

	const PLAYER_COLORS = {
		P1: {
			primary: '#2563eb',
			secondary: '#3b82f6',
			accent: '#60a5fa',
			text: '#1e40af'
		},
		P2: {
			primary: '#16a34a',
			secondary: '#22c55e',
			accent: '#4ade80',
			text: '#15803d'
		}
	};

	function rollDice() {
		isRolling = true;
		let rolls = 0;
		const rollInterval = setInterval(() => {
			dice1Value = 1 + Math.floor(Math.random() * 6);
			dice2Value = 1 + Math.floor(Math.random() * 6);
			rolls++;
			if (rolls >= 10) {
				clearInterval(rollInterval);
				isRolling = false;
				state = STATE.DICE_ROLLED;
				checkForEligiblePieces();
				if (!gameStarted) gameStarted = true;
			}
		}, 100);
	}

	function checkForEligiblePieces() {
		const player = PLAYERS[turn];
		const totalValue = dice1Value + dice2Value;
		const eligiblePieces = getEligiblePieces(player);
		if (eligiblePieces.length === 0) {
			setTimeout(() => {
				incrementTurn();
			}, 1000);
		}
	}

	/** @param {string} player */
	function getEligiblePieces(player) {
		const totalValue = dice1Value + dice2Value;
		return [0, 1, 2, 3].filter((piece) => {
			const currentPosition = currentPositions[player][piece];

			if (currentPosition === HOME_POSITIONS[player]) return false;
			if (BASE_POSITIONS[player].includes(currentPosition) && dice1Value !== 6 && dice2Value !== 6)
				return false;
			if (
				HOME_ENTRANCE[player].includes(currentPosition) &&
				totalValue > HOME_POSITIONS[player] - currentPosition
			)
				return false;

			return true;
		});
	}

	function incrementTurn() {
		turn = turn === 0 ? 1 : 0;
		state = STATE.DICE_NOT_ROLLED;
	}

	/** @param {string} player */
	/** @param {number} piece */
	function handlePieceClick(player, piece) {
		if (player !== PLAYERS[turn]) return;
		if (!getEligiblePieces(player).includes(Number(piece))) return;

		const currentPosition = currentPositions[player][piece];
		const totalValue = dice1Value + dice2Value;

		if (BASE_POSITIONS[player].includes(currentPosition)) {
			setPiecePosition(player, piece, START_POSITIONS[player]);
			state = STATE.DICE_NOT_ROLLED;
			return;
		}

		movePiece(player, piece, totalValue);
	}

	/** @param {string} player */
	/** @param {number} piece */
	/** @param {number} newPosition */
	function setPiecePosition(player, piece, newPosition) {
		currentPositions[player][piece] = newPosition;
		currentPositions = { ...currentPositions };
	}

	/** @param {string} player */
	/** @param {number} piece */
	/** @param {number} moveBy */
	function movePiece(player, piece, moveBy) {
		let remainingMoves = moveBy;
		const moveInterval = setInterval(() => {
			incrementPiecePosition(player, piece);
			remainingMoves--;

			if (remainingMoves === 0) {
				clearInterval(moveInterval);

				if (hasPlayerWon(player)) {
					winner = player;
					return;
				}

				const isKill = checkForKill(player, piece);

				if (isKill || dice1Value === 6 || dice2Value === 6) {
					state = STATE.DICE_NOT_ROLLED;
					return;
				}

				incrementTurn();
			}
		}, 200);
	}

	/** @param {string} player */
	/** @param {number} piece */
	function incrementPiecePosition(player, piece) {
		const currentPosition = currentPositions[player][piece];
		let newPosition;

		if (currentPosition === TURNING_POINTS[player]) {
			newPosition = HOME_ENTRANCE[player][0];
		} else if (currentPosition === 51) {
			newPosition = 0;
		} else {
			newPosition = currentPosition + 1;
		}

		setPiecePosition(player, piece, newPosition);
	}

	/** @param {string} player */
	/** @param {number} piece */
	function checkForKill(player, piece) {
		const currentPosition = currentPositions[player][piece];
		const opponent = player === 'P1' ? 'P2' : 'P1';
		let kill = false;

		[0, 1, 2, 3].forEach((opponentPiece) => {
			const opponentPosition = currentPositions[opponent][opponentPiece];
			if (currentPosition === opponentPosition && !SAFE_POSITIONS.includes(currentPosition)) {
				setPiecePosition(opponent, opponentPiece, BASE_POSITIONS[opponent][opponentPiece]);
				kill = true;
			}
		});

		return kill;
	}

	/** @param {string} player */
	function hasPlayerWon(player) {
		return [0, 1, 2, 3].every(
			(piece) => currentPositions[player][piece] === HOME_POSITIONS[player]
		);
	}

	function resetGame() {
		currentPositions = {
			P1: [...BASE_POSITIONS.P1],
			P2: [...BASE_POSITIONS.P2]
		};
		turn = 0;
		state = STATE.DICE_NOT_ROLLED;
		diceValue = 0;
		gameStarted = false;
		winner = null;
	}

	/** @param {number} position */
	function getPieceStyle(position) {
		const [x, y] = COORDINATES_MAP[position];
		return `top: ${y * STEP_LENGTH}%; left: ${x * STEP_LENGTH}%;`;
	}

	$: activePlayer = PLAYERS[turn];
	$: activePlayerColors = PLAYER_COLORS[activePlayer];
</script>

<div class="game-container">
	<div class="game-header">
		<h1 class="game-title">Ludo Game</h1>
		{#if !gameStarted}
			<p class="game-intro">Roll the dice to start the game!</p>
		{:else if winner}
			<p class="winner-announcement" style="color: {PLAYER_COLORS[winner].text}">
				🎉 Player {winner} has won! 🎉
			</p>
		{:else}
			<p class="turn-indicator" style="color: {activePlayerColors.text}">
				Player {activePlayer}'s Turn
			</p>
		{/if}
	</div>

	<div class="game-board">
		<div class="board-container">
			<img src="./ludo-bg.jpg" alt="ludo-bg" class="board-background" />
			<div class="player-pieces">
				{#each PLAYERS as player}
					{#each [0, 1, 2, 3] as piece}
						<div
							class="player-piece"
							class:highlight={state === STATE.DICE_ROLLED &&
								player === PLAYERS[turn] &&
								getEligiblePieces(player).includes(piece)}
							class:in-base={BASE_POSITIONS[player].includes(currentPositions[player][piece])}
							style="{getPieceStyle(
								currentPositions[player][piece]
							)} background-color: {PLAYER_COLORS[player].secondary}; border-color: {PLAYER_COLORS[
								player
							].primary};"
							data-player-id={player}
							data-piece={piece}
							on:click={() => handlePieceClick(player, piece)}
						>
							<span class="piece-number">{piece + 1}</span>
						</div>
					{/each}
				{/each}
			</div>
		</div>
	</div>

	<div class="game-controls">
		<div class="dice-section" style="--player-color: {activePlayerColors.primary}">
			<button
				class="dice-button"
				on:click={rollDice}
				disabled={state !== STATE.DICE_NOT_ROLLED || winner !== null}
				class:rolling={isRolling}
			>
				{#if isRolling}
					Rolling...
				{:else if dice1Value && dice2Value}
					<div class="dice-container">
						<div class="dice-face">{dice1Value}</div>
						<div class="dice-face">{dice2Value}</div>
					</div>
				{:else}
					Roll Dice
				{/if}
			</button>
		</div>

		<button class="reset-button" on:click={resetGame}> New Game </button>
	</div>
</div>

<style>
	.game-container {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.game-header {
		text-align: center;
	}

	.game-title {
		font-size: 2.5rem;
		font-weight: bold;
		margin: 0;
		color: #1f2937;
	}

	.game-intro {
		font-size: 1.2rem;
		color: #4b5563;
		margin: 0.5rem 0;
	}

	.turn-indicator {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0.5rem 0;
		transition: color 0.3s ease;
	}

	.winner-announcement {
		font-size: 1.8rem;
		font-weight: bold;
		margin: 0.5rem 0;
		animation: celebrate 1s ease infinite;
	}

	.game-board {
		aspect-ratio: 1;
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		position: relative;
		padding: 0;
		background: #f8fafc;
		border-radius: 1.5rem;
	}

	.board-container {
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	.board-background {
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: absolute;
		top: 0;
		left: 0;
	}

	.player-pieces {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.player-piece {
		width: 4.5%;
		height: 4.5%;
		border: 2px solid;
		border-radius: 50%;
		position: absolute;
		transform: translate(-50%, -50%);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: bold;
		color: #ffffff;
		text-shadow: 0 1px 2px rgb(0 0 0 / 0.1);
		pointer-events: auto;
		z-index: 10;
	}

	.player-piece.highlight {
		animation: bounce 1s infinite;
		box-shadow:
			0 0 0 2px white,
			0 0 0 4px currentColor;
		z-index: 20;
	}

	.player-piece.in-base {
		width: 5.5%;
		height: 5.5%;
		font-size: 0.85rem;
	}

	.game-controls {
		display: flex;
		gap: 2rem;
		justify-content: center;
		align-items: center;
		padding: 1rem;
	}

	.dice-section {
		position: relative;
	}

	.dice-button {
		font-size: 1.2rem;
		padding: 1rem 2rem;
		border: none;
		border-radius: 0.5rem;
		background-color: var(--player-color);
		color: white;
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 120px;
	}

	.dice-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.dice-button.rolling {
		animation: shake 0.5s infinite;
	}

	.dice-container {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}

	.dice-face {
		background: white;
		border-radius: 0.5rem;
		padding: 0.5rem 1rem;
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--player-color);
		min-width: 2.5rem;
		text-align: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.reset-button {
		padding: 1rem 2rem;
		border: none;
		border-radius: 0.5rem;
		background-color: #ef4444;
		color: white;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 1.2rem;
	}

	.reset-button:hover {
		background-color: #dc2626;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			transform: translate(-50%, -50%) scale(1.1);
		}
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-5px);
		}
		75% {
			transform: translateX(5px);
		}
	}

	@keyframes celebrate {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	@media (max-width: 768px) {
		.game-container {
			margin: 1rem;
			gap: 1rem;
		}

		.game-title {
			font-size: 2rem;
		}

		.turn-indicator,
		.winner-announcement {
			font-size: 1.2rem;
		}

		.dice-button,
		.reset-button {
			padding: 0.75rem 1.5rem;
			font-size: 1rem;
		}
	}
</style>
