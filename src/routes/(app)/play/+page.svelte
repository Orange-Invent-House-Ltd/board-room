<script lang="ts">
	import { onMount } from 'svelte';
	import type { Card } from './types';
	import { createDeck, shuffleDeck, dealCards } from './gameLogic';
	import PlayerHand from './PlayerHand.svelte';
	import ComputerHand from './ComputerHand.svelte';
	import Deck from './Deck.svelte';
	import DiscardPile from './DiscardPile.svelte';

	let deck: Card[] = [];
	let playerHand: Card[] = [];
	let computerHand: Card[] = [];
	let discardPile: Card[] = [];
	let currentPlayer: 'player' | 'computer' = 'player';

	onMount(() => {
		startNewGame();
	});

	function startNewGame() {
		deck = shuffleDeck(createDeck());
		[playerHand, computerHand, deck] = dealCards(deck);
		discardPile = [deck.pop()!];
		currentPlayer = 'player';
	}

	function playCard(card: Card) {
		if (currentPlayer === 'player' && isValidPlay(card)) {
			playerHand = playerHand.filter((c) => c !== card);
			discardPile = [card, ...discardPile];
			currentPlayer = 'computer';
			setTimeout(computerTurn, 1000);
		}
	}

	function drawCard() {
		if (currentPlayer === 'player') {
			if (deck.length === 0) {
				deck = shuffleDeck(discardPile.slice(1));
				discardPile = [discardPile[0]];
			}
			playerHand = [...playerHand, deck.pop()!];
			currentPlayer = 'computer';
			setTimeout(computerTurn, 1000);
		}
	}

	function computerTurn() {
		const playableCard = computerHand.find((card) => isValidPlay(card));
		if (playableCard) {
			computerHand = computerHand.filter((c) => c !== playableCard);
			discardPile = [playableCard, ...discardPile];
		} else {
			if (deck.length === 0) {
				deck = shuffleDeck(discardPile.slice(1));
				discardPile = [discardPile[0]];
			}
			computerHand = [...computerHand, deck.pop()!];
		}
		currentPlayer = 'player';
	}

	function isValidPlay(card: Card): boolean {
		const topCard = discardPile[0];
		return card.color === topCard.color || card.value === topCard.value || card.color === 'wild';
	}
</script>

<main>
	<h1>UNO Game</h1>
	<button on:click={startNewGame}>New Game</button>
	<div class="game-board">
		<ComputerHand cards={computerHand} />
		<div class="middle-section">
			<Deck {deck} on:drawCard={drawCard} />
			<DiscardPile cards={discardPile} />
		</div>
		<PlayerHand cards={playerHand} on:playCard={(e) => playCard(e.detail)} />
	</div>
	<p>Current player: {currentPlayer}</p>
</main>

<style>
	.game-board {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}
	.middle-section {
		display: flex;
		gap: 20px;
	}
</style>
