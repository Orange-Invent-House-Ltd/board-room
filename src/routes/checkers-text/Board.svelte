<script>
	import { createEventDispatcher } from 'svelte';
	import { isMoveLegal } from './gameLogic';

	export let board;
	export let windowWidth;

	const dispatch = createEventDispatcher();
	$: cellSize = getCellSize(windowWidth);

	function getCellSize(width) {
		if (width < 400) return 40; // Slightly larger for mobile
		if (width < 600) return 48;
		if (width < 768) return 56;
		if (width < 1024) return 64;
		return 72; // Larger default size
	}

	let selectedPiece = null;
	let validMoves = [];
	let jumpingPiece = null;
	let lastMove = null;

	function calculateValidMoves(piece) {
		const moves = [];
		for (let row = 0; row < 8; row++) {
			for (let col = 0; col < 8; col++) {
				const from = { row: piece.row, col: piece.col };
				const to = { row, col };
				if (isMoveLegal(board.cells, board.pieces, piece, from, to)) {
					moves.push(to);
				}
			}
		}
		return moves;
	}

	function handlePieceClick(piece, event) {
		if (board.turn !== piece.state) return;

		event.stopPropagation();
		if (selectedPiece === piece) {
			selectedPiece = null;
			validMoves = [];
		} else {
			selectedPiece = piece;
			validMoves = calculateValidMoves(piece);
		}
	}

	function handleCellClick(cell) {
		if (!selectedPiece) return;

		const isValidMove = validMoves.some((move) => move.row === cell.row && move.col === cell.col);
		if (!isValidMove) {
			selectedPiece = null;
			validMoves = [];
			return;
		}

		const from = {
			row: selectedPiece.row,
			col: selectedPiece.col
		};

		const to = {
			row: cell.row,
			col: cell.col
		};

		// Store the move for animation purposes
		lastMove = { from, to };

		// Check if this is a capture move
		const isCapture = Math.abs(to.row - from.row) === 2;
		if (isCapture) {
			jumpingPiece = selectedPiece;
			setTimeout(() => {
				jumpingPiece = null;
				lastMove = null;
			}, 400); // Slightly longer for the jump animation
		} else {
			setTimeout(() => {
				lastMove = null;
			}, 300);
		}

		dispatch('move', {
			piece: selectedPiece,
			from,
			to
		});

		selectedPiece = null;
		validMoves = [];
	}

	// Handle touch events better for mobile
	function handleTouchStart(piece, event) {
		event.preventDefault();
		if (board.turn !== piece.state) return;

		if (selectedPiece === piece) {
			selectedPiece = null;
			validMoves = [];
		} else {
			selectedPiece = piece;
			validMoves = calculateValidMoves(piece);
		}
	}

	function handleTouchMove(event) {
		event.preventDefault();
	}

	function handleTouchEnd(event, cell) {
		event.preventDefault();
		handleCellClick(cell);
	}

	function getPosition(row, col, isJumping = false) {
		const x = col * cellSize;
		const y = row * cellSize;
		let transform = 'none';

		if (isJumping) {
			// Calculate the jump arc based on the direction of movement
			if (lastMove) {
				const moveDistance = Math.abs(lastMove.to.row - lastMove.from.row);
				const moveDirection = Math.sign(lastMove.to.row - lastMove.from.row);
				const progress = (y - lastMove.from.row * cellSize) / (moveDistance * cellSize);
				const jumpHeight = moveDistance === 2 ? -80 : -40; // Higher jump for captures
				const arc = Math.sin(progress * Math.PI) * jumpHeight;
				transform = `translateY(${arc}px) scale(1.1)`;
			}
		}

		return {
			top: `${y}px`,
			left: `${x}px`,
			transform
		};
	}
</script>

<div class="board" style="--cell-size: {cellSize}px;">
	{#each board.cells as cell}
		<div
			class="cell"
			class:dark={(cell.row + cell.col) % 2 === 1}
			class:valid-move={validMoves.some((move) => move.row === cell.row && move.col === cell.col)}
			class:selectable={validMoves.length > 0}
			on:click={() => handleCellClick(cell)}
			on:touchend={(e) => handleTouchEnd(e, cell)}
		/>
	{/each}

	{#each board.pieces as piece (piece)}
		{@const pos = getPosition(piece.row, piece.col, jumpingPiece === piece)}
		<div
			class="piece"
			class:red={piece.state > 0}
			class:black={piece.state < 0}
			class:king={Math.abs(piece.state) > 1}
			class:selected={selectedPiece === piece}
			class:playable={board.turn === piece.state}
			class:jumping={jumpingPiece === piece}
			style="top: {pos.top}; left: {pos.left}; transform: {pos.transform};"
			on:click={(e) => handlePieceClick(piece, e)}
			on:touchstart={(e) => handleTouchStart(piece, e)}
			on:touchmove|preventDefault
		>
			{#if Math.abs(piece.state) > 1}
				<span class="crown">♔</span>
			{/if}
		</div>
	{/each}
</div>

<style>
	.board {
		display: grid;
		grid-template-columns: repeat(8, var(--cell-size));
		grid-template-rows: repeat(8, var(--cell-size));
		border: 2px solid hsl(var(--border));
		border-radius: 8px;
		overflow: hidden;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1),
			inset 0 0 20px rgba(0, 0, 0, 0.05);
		background-color: hsl(var(--background));
		touch-action: none;
		user-select: none;
		position: relative;
		margin: auto;
	}

	.cell {
		width: var(--cell-size);
		height: var(--cell-size);
		background-color: hsl(47 80% 90%);
		transition: background-color 0.2s;
		position: relative;
	}

	.cell.dark {
		background-color: hsl(200 70% 50%);
	}

	.cell.valid-move::after {
		content: '';
		position: absolute;
		inset: 15%;
		border-radius: 50%;
		background: hsl(var(--primary) / 0.15);
		border: 2px dashed hsl(var(--primary) / 0.4);
		z-index: 1;
		animation: pulse 2s ease-in-out infinite;
	}

	.cell.selectable:hover {
		background-color: hsl(47 85% 85%);
	}

	.cell.selectable.dark:hover {
		background-color: hsl(200 75% 45%);
	}

	.piece {
		position: absolute;
		width: calc(var(--cell-size) * 0.85);
		height: calc(var(--cell-size) * 0.85);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		color: white;
		transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.2),
			inset 0 2px 4px rgba(255, 255, 255, 0.3);
		z-index: 2;
		transform-origin: center;
		will-change: transform, top, left;
		pointer-events: auto;
		margin: calc(var(--cell-size) * 0.075);
		-webkit-tap-highlight-color: transparent;
	}

	.piece.playable {
		cursor: pointer;
	}

	.piece.playable:hover {
		transform: scale(1.05);
		box-shadow:
			0 4px 8px rgba(0, 0, 0, 0.3),
			inset 0 2px 4px rgba(255, 255, 255, 0.4);
	}

	.piece.selected {
		transform: scale(1.1);
		box-shadow:
			0 0 0 3px hsl(var(--primary)),
			0 4px 8px rgba(0, 0, 0, 0.3),
			inset 0 2px 4px rgba(255, 255, 255, 0.4);
		z-index: 4;
	}

	.piece.red {
		background: linear-gradient(135deg, #ff5555 0%, #cc0000 100%);
		border: 2px solid rgba(255, 255, 255, 0.3);
	}

	.piece.black {
		background: linear-gradient(135deg, #444444 0%, #111111 100%);
		border: 2px solid rgba(255, 255, 255, 0.2);
	}

	.piece.king {
		border-width: 3px;
		border-color: #ffd700;
		background-image: linear-gradient(
				135deg,
				rgba(255, 215, 0, 0.3) 0%,
				rgba(255, 215, 0, 0.1) 100%
			),
			linear-gradient(
				135deg,
				var(--piece-base-color, #ff5555) 0%,
				var(--piece-dark-color, #cc0000) 100%
			);
	}

	.piece.king.red {
		--piece-base-color: #ff5555;
		--piece-dark-color: #cc0000;
	}

	.piece.king.black {
		--piece-base-color: #444444;
		--piece-dark-color: #111111;
	}

	.crown {
		font-size: calc(var(--cell-size) * 0.5);
		color: #ffd700;
		text-shadow:
			0 1px 2px rgba(0, 0, 0, 0.3),
			0 0 4px rgba(255, 215, 0, 0.5);
		line-height: 1;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.8;
		}
	}

	@keyframes jump {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-20%) scale(1.1);
		}
	}

	@media (max-width: 640px) {
		.board {
			border-width: 1px;
		}

		.piece {
			border-width: 1.5px;
			transition-duration: 0.3s;
		}

		.cell.valid-move::after {
			inset: 20%;
			border-width: 1.5px;
		}

		.piece.selected {
			transform: scale(1.15);
		}
	}

	@media (hover: none) {
		.piece.playable:hover {
			transform: none;
			box-shadow:
				0 2px 4px rgba(0, 0, 0, 0.2),
				inset 0 2px 4px rgba(255, 255, 255, 0.3);
		}
	}
</style>
