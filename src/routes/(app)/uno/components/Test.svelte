<script lang="ts">
	import { onMount } from 'svelte';
	import {
		type Card,
		type GameState,
		initializeGameState,
		isPlayValid,
		playCard,
		drawCard,
		createDeck
	} from './unoCore';
	import playAITurn from './unoAi';
	let gameState: GameState = $state({
		deck: createDeck(),
		discardPile: [createDeck()[0]], // Set the discard pile with a non-empty array
		players: [
			{
				id: 'player1',
				hand: [createDeck()[1]], // Set the player's hand with a non-empty array
				isComputer: false
			},
			{
				id: 'player2',
				hand: [createDeck()[2]], // Set the player's hand with a non-empty array
				isComputer: true
			},
			{
				id: 'player3',
				hand: [createDeck()[3]], // Set the player's hand with a non-empty array
				isComputer: true
			}
		],
		currentPlayerIndex: 0,
		direction: 1,
		winner: 'undefined' // Set the winner property to undefined
	});

	let selectedCardIndex: number | null = $state(null);

	onMount(() => {
		startNewGame();
	});

	function startNewGame() {
		gameState = initializeGameState(2, 1); // 2 players, 1 computer
	}

	function handleCardClick(index: number) {
		if (gameState.currentPlayerIndex !== 0) return; // Not player's turn

		const card = gameState.players[0].hand[index];
		const topCard = gameState.discardPile[gameState.discardPile.length - 1];

		if (isPlayValid(card, topCard)) {
			gameState = playCard(gameState, index);
			if (card.color === 'Wild') {
				// Prompt player to choose color
				// For simplicity, we'll just choose red here
				gameState.discardPile[gameState.discardPile.length - 1].color = 'Red';
			}
			handleAITurn();
		}
	}

	function handleDrawCard() {
		if (gameState.currentPlayerIndex !== 0) return; // Not player's turn

		gameState = drawCard(gameState);
		handleAITurn();
	}

	function handleAITurn() {
		while (gameState.currentPlayerIndex !== 0 && !gameState?.winner) {
			gameState = playAITurn(gameState);
		}
	}
</script>

<main>
	<h1>UNO Game</h1>
	{#if gameState?.winner}
		<h2>{gameState.winner === 'player0' ? 'You' : 'Computer'} won!</h2>
		<button onclick={startNewGame}>New Game</button>
	{:else}
		<div class="game-board">
			<div class="discard-pile">
				<div class="card {gameState.discardPile[gameState.discardPile.length - 1].color}">
					{gameState.discardPile[gameState.discardPile.length - 1].value}
				</div>
			</div>
			<div class="player-hand">
				{#each gameState.players[0].hand as card, index}
					<div class="card {card.color}" onclick={() => handleCardClick(index)}>
						{card.value}
					</div>
				{/each}
			</div>
			<button onclick={handleDrawCard}>Draw Card</button>
		</div>
	{/if}
</main>

<style>
	.game-board {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.discard-pile,
	.player-hand {
		display: flex;
		gap: 10px;
		margin: 20px 0;
	}
	.card {
		width: 60px;
		height: 90px;
		border: 1px solid black;
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.Red {
		background-color: #ff6b6b;
	}
	.Blue {
		background-color: #4ecdc4;
	}
	.Green {
		background-color: #45b7d1;
	}
	.Yellow {
		background-color: #feca57;
	}
	.Wild {
		background-color: #a55eea;
	}
</style>
