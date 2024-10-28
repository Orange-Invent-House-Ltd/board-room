<script>
	import { createEventDispatcher } from 'svelte';
	import { isMoveLegal } from './gameLogic';

	export let board;

	const dispatch = createEventDispatcher();
	const CELL_SIZE = 70;

	let draggedPiece = null;
	let draggedElement = null;

	function handleDragStart(event, piece) {
		if (board.turn !== piece.state) return;
		draggedPiece = piece;
		draggedElement = event.target;
		event.dataTransfer.setData('text/plain', ''); // Required for Firefox
	}

	function handleDragOver(event) {
		event.preventDefault();
	}

	function handleDrop(event, cell) {
		event.preventDefault();
		if (!draggedPiece) return;

		const from = {
			row: draggedPiece.row,
			col: draggedPiece.col
		};

		const to = {
			row: cell.row,
			col: cell.col
		};

		if (isMoveLegal(board.cells, board.pieces, draggedPiece, from, to)) {
			dispatch('move', {
				piece: draggedPiece,
				from,
				to
			});
		}

		draggedPiece = null;
	}
</script>

<div class="board">
	{#each board.cells as cell}
		<div
			class="cell"
			class:dark={(cell.row + cell.col) % 2 === 1}
			on:dragover={handleDragOver}
			on:drop={(e) => handleDrop(e, cell)}
		>
			{#each board.pieces as piece}
				{#if piece.row === cell.row && piece.col === cell.col}
					<div
						class="piece"
						class:red={piece.state > 0}
						class:black={piece.state < 0}
						class:king={Math.abs(piece.state) > 1}
						draggable="true"
						on:dragstart={(e) => handleDragStart(e, piece)}
					>
						{Math.abs(piece.state) > 1 ? 'K' : ''}
					</div>
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style>
	.board {
		display: grid;
		grid-template-columns: repeat(8, 70px);
		grid-template-rows: repeat(8, 70px);
		border: 2px solid #333;
	}

	.cell {
		width: 70px;
		height: 70px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
	}

	.cell.dark {
		background-color: #999;
	}

	.piece {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24px;
		font-weight: bold;
		color: white;
		cursor: move;
		user-select: none;
	}

	.piece.red {
		background-color: #d00;
	}

	.piece.black {
		background-color: #000;
	}

	.piece.king {
		border: 3px solid #ffd700;
	}
</style>
