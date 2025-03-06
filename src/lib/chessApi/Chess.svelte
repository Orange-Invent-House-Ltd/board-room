<script lang="ts" context="module">
	import type { Square, Color, PieceSymbol, Move, GameOver } from '$lib/chessApi/api.js';
	export type GameOverEvent = CustomEvent<GameOver>;
	export type MoveEvent = CustomEvent<Move>;
	export type UciEvent = CustomEvent<string>;
	export type { Square, Color, PieceSymbol, Move, GameOver };
	export { Engine } from '$lib/chessApi/engine.js';
</script>

<script lang="ts">
	import { Chessground } from 'svelte-chessground';
	import { Chess } from 'chess.js';
	import { onMount, createEventDispatcher } from 'svelte';
	import type { Engine } from '$lib/chessApi/engine.js';

	const dispatch = createEventDispatcher<{
		move: Move;
		gameOver: GameOver;
		ready: void;
		uci: string;
	}>();

	// Props using runes
	const props = $props<{
		orientation?: Color;
		engine?: Engine;
		class?: string;
	}>();

	// Default values using $derived
	let orientation = $derived(props.orientation ?? 'w');
	let engine = $derived(props.engine);
	let className = $derived(props.class);

	// State
	let chessground: Chessground;
	let container: HTMLElement;
	let game = new Chess();

	// Handle engine initialization and moves
	$effect(() => {
		if (engine) {
			engine.onMove = (move) => {
				if (!game.isGameOver()) {
					const result = game.move(move);
					if (result) {
						dispatch('move', result);
						updateBoard();
					}
				}
			};

			engine.setUciCallback((message) => dispatch('uci', message));

			// Start engine analysis if it's computer's turn
			if (game.turn() === engine.color) {
				engine.analyze(game.fen());
			}
		}
	});

	function onMove(from: string, to: string) {
		try {
			// Only allow moves when it's the player's turn
			if (engine && game.turn() === engine.color) {
				console.log('Not player turn');
				return;
			}

			const move = {
				from,
				to,
				promotion: 'q' // Always promote to queen for simplicity
			};

			// Validate move before attempting
			const possibleMoves = game.moves({ verbose: true });
			const isValidMove = possibleMoves.some((m) => m.from === move.from && m.to === move.to);

			if (!isValidMove) {
				console.log('Invalid move attempted:', move);
				return;
			}

			const result = game.move(move);

			if (result) {
				dispatch('move', result);
				updateBoard();

				// Only let engine respond if it's actually its turn
				if (engine && !game.isGameOver() && game.turn() === engine.color) {
					setTimeout(() => {
						engine.analyze(game.fen());
					}, 100);
				}
			}
		} catch (err) {
			console.error('Move error:', err);
		}
	}

	function updateBoard() {
		chessground?.set({
			fen: game.fen(),
			turnColor: game.turn() === 'w' ? 'white' : 'black',
			movable: {
				free: false,
				// Prevent moves when it's engine's turn
				color: engine?.color === game.turn() ? undefined : game.turn() === 'w' ? 'white' : 'black',
				dests: getValidMoves(),
				events: {
					after: onMove
				}
			},
			draggable: {
				enabled: !(engine?.color === game.turn())
			}
		});
	}

	function getValidMoves() {
		const dests = new Map();
		const moves = game.moves({ verbose: true });
		for (const move of moves) {
			const from = move.from as Square;
			const to = move.to as Square;
			if (!dests.has(from)) dests.set(from, []);
			dests.get(from).push(to);
		}
		return dests;
	}

	export function reset() {
		game = new Chess();
		updateBoard();
		if (engine && orientation === 'b') {
			engine.analyze(game.fen());
		}
	}

	export function getFen() {
		return game.fen();
	}

	onMount(() => {
		updateBoard();
		dispatch('ready');
	});
</script>

<div style="position:relative;" bind:this={container}>
	<Chessground
		bind:this={chessground}
		{orientation}
		class={className}
		on:move={({ detail: { from, to } }) => onMove(from, to)}
	/>
</div>
