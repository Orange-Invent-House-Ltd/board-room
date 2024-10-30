<script>
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

	function rollDice() {
		diceValue = 1 + Math.floor(Math.random() * 6);
		state = STATE.DICE_ROLLED;
		checkForEligiblePieces();
	}

	function checkForEligiblePieces() {
		const player = PLAYERS[turn];
		const eligiblePieces = getEligiblePieces(player);
		if (eligiblePieces.length === 0) {
			incrementTurn();
		}
	}

	function getEligiblePieces(player) {
		return [0, 1, 2, 3].filter((piece) => {
			const currentPosition = currentPositions[player][piece];

			if (currentPosition === HOME_POSITIONS[player]) return false;
			if (BASE_POSITIONS[player].includes(currentPosition) && diceValue !== 6) return false;
			if (
				HOME_ENTRANCE[player].includes(currentPosition) &&
				diceValue > HOME_POSITIONS[player] - currentPosition
			)
				return false;

			return true;
		});
	}

	function incrementTurn() {
		turn = turn === 0 ? 1 : 0;
		state = STATE.DICE_NOT_ROLLED;
	}

	function handlePieceClick(player, piece) {
		if (player !== PLAYERS[turn]) return;
		if (!getEligiblePieces(player).includes(Number(piece))) return;

		const currentPosition = currentPositions[player][piece];

		if (BASE_POSITIONS[player].includes(currentPosition)) {
			setPiecePosition(player, piece, START_POSITIONS[player]);
			state = STATE.DICE_NOT_ROLLED;
			return;
		}

		movePiece(player, piece, diceValue);
	}

	function setPiecePosition(player, piece, newPosition) {
		currentPositions[player][piece] = newPosition;
		currentPositions = { ...currentPositions }; // Trigger reactivity
	}

	function movePiece(player, piece, moveBy) {
		let remainingMoves = moveBy;
		const moveInterval = setInterval(() => {
			incrementPiecePosition(player, piece);
			remainingMoves--;

			if (remainingMoves === 0) {
				clearInterval(moveInterval);

				if (hasPlayerWon(player)) {
					alert(`Player ${player} has won!`);
					resetGame();
					return;
				}

				const isKill = checkForKill(player, piece);

				if (isKill || diceValue === 6) {
					state = STATE.DICE_NOT_ROLLED;
					return;
				}

				incrementTurn();
			}
		}, 200);
	}

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
	}

	function getPieceStyle(position) {
		const [x, y] = COORDINATES_MAP[position];
		return `top: ${y * STEP_LENGTH}%; left: ${x * STEP_LENGTH}%;`;
	}
</script>

<div class="ludo-container">
	<div class="h-[450px] w-full bg-cover bg-center relative">
		<img src="./ludo-bg.jpg" alt="" />
		<div class="player-pieces">
			{#each PLAYERS as player}
				{#each [0, 1, 2, 3] as piece}
					<div
						class="player-piece"
						class:highlight={state === STATE.DICE_ROLLED &&
							player === PLAYERS[turn] &&
							getEligiblePieces(player).includes(piece)}
						style={getPieceStyle(currentPositions[player][piece])}
						data-player-id={player}
						data-piece={piece}
						on:click={() => handlePieceClick(player, piece)}
					></div>
				{/each}
			{/each}
		</div>
		<div class="player-bases">
			{#each PLAYERS as player}
				<div
					class="player-base"
					class:highlight={player === PLAYERS[turn]}
					data-player-id={player}
				></div>
			{/each}
		</div>
	</div>
	<div class="footer">
		<div class="row">
			<button class="btn btn-dice" on:click={rollDice} disabled={state !== STATE.DICE_NOT_ROLLED}>
				Roll
			</button>
			<div class="dice-value">{diceValue || ''}</div>
			<button class="btn btn-reset" on:click={resetGame}>Reset</button>
		</div>
		<h2 class="active-player">Active Player: <span>{PLAYERS[turn]}</span></h2>
	</div>
</div>

<style>
	* {
		box-sizing: border-box;
	}
	.ludo-container {
		width: 450px;
		margin: 20px auto;
	}
	/* .ludo {
		height: 450px;
		width: 100%;
		background-image: url('./ludo-bg.jpg');
		background-size: contain;
		position: relative;
	} */
	.player-pieces {
		height: 100%;
		width: 100%;
	}
	.player-piece {
		width: 3%;
		height: 3%;
		border: 2px solid;
		border-radius: 10px;
		position: absolute;
		transform: translate(50%, 50%);
		transition: all 0.2s;
		z-index: 1;
	}
	.player-piece.highlight {
		cursor: pointer;
		border: 2px dashed;
		animation: spin 1s infinite linear;
	}
	[data-player-id='P1'].player-piece {
		background-color: #2eafff;
	}
	[data-player-id='P2'].player-piece {
		background-color: #00b550;
	}
	.player-base {
		width: 40%;
		height: 40%;
		border: 30px solid;
		position: absolute;
	}
	.player-bases [data-player-id='P1'].player-base {
		bottom: 0;
		left: 0;
		border-color: #1295e7;
	}
	.player-bases [data-player-id='P2'].player-base {
		top: 0;
		right: 0;
		border-color: #049645;
	}
	.player-base.highlight {
		animation: border-blink 0.7s infinite ease-in-out;
	}
	.btn {
		padding: 8px 20px;
		border: none;
		cursor: pointer;
		font-size: 16px;
	}
	.btn:disabled {
		opacity: 0.5;
	}
	.btn-dice {
		background-color: #009d60;
		color: white;
	}
	.row {
		display: flex;
		justify-content: space-between;
		margin-top: 15px;
	}
	.dice-value {
		font-size: 24px;
		font-weight: bold;
	}

	@keyframes spin {
		0% {
			transform: translate(50%, 50%) rotate(0deg);
		}
		50% {
			transform: translate(50%, 50%) rotate(180deg) scale(1.4);
		}
		100% {
			transform: translate(50%, 50%) rotate(360deg);
		}
	}

	@keyframes border-blink {
		50% {
			border-color: rgba(255, 255, 255, 0.8);
		}
	}
</style>
