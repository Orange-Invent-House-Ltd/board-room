<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';

	type Color = 'red' | 'blue' | 'green' | 'yellow' | 'wild';
	type Value =
		| '0'
		| '1'
		| '2'
		| '3'
		| '4'
		| '5'
		| '6'
		| '7'
		| '8'
		| '9'
		| 'Skip'
		| 'Reverse'
		| 'Draw Two'
		| 'Wild'
		| 'Wild Draw Four';
	type Card = { color: Color; value: Value };
	type Player = 'player' | 'computer';

	let colors: Color[] = $state(['red', 'blue', 'green', 'yellow']);
	let values: Value[] = $state([
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'Skip',
		'Reverse',
		'Draw Two',
		'Wild',
		'Wild Draw Four'
	]);
	let deck: Card[] = $state([]);
	let playerHand: Card[] = $state([]);
	let computerHand: Card[] = $state([]);
	let currentCard: Card | null = $state(null);
	let currentPlayer: Player = $state('player');
	let currentColor: Color | null = $state(null);
	let message: string = $state('');
	let showColorChooser: boolean = $state(false);

	function createDeck(): void {
		deck = [];
		for (let color of colors) {
			for (let value of values) {
				if (value === 'Wild' || value === 'Wild Draw Four') {
					deck.push({ color: 'wild', value });
				} else {
					deck.push({ color, value });
				}
			}
		}
	}

	function shuffleDeck(): void {
		for (let i = deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[deck[i], deck[j]] = [deck[j], deck[i]];
		}
	}

	function dealInitialHands(): void {
		playerHand = [];
		computerHand = [];
		for (let i = 0; i < 7; i++) {
			playerHand.push(deck.pop()!);
			computerHand.push(deck.pop()!);
		}
	}

	function getRandomNumber(): number {
		const numbers = [1000, 2000, 3000];
		return numbers[Math.floor(Math.random() * numbers.length)];
	}

	function playCard(card: Card): void {
		if (currentPlayer !== 'player') return;
		const randomNumber = getRandomNumber();
		if (card.color === 'wild' || card.color === currentColor || card.value === currentCard?.value) {
			currentCard = card;
			currentColor = card.color === 'wild' ? currentColor : card.color;
			playerHand = playerHand.filter((c) => c !== card);

			if (card.color === 'wild') {
				showColorChooser = true;
			} else {
				applyCardEffect(card);
				checkWinCondition('player');
				if (playerHand.length > 0 && currentPlayer === 'computer') {
					setTimeout(computerTurn, randomNumber);
				}
			}
		} else {
			message = 'Invalid move!';
		}
	}

	function chooseColor(color: Color): void {
		currentColor = color;
		showColorChooser = false;
		if (currentCard) {
			currentCard.color = currentColor;
			applyCardEffect(currentCard);
		}
		checkWinCondition('player');
		if (playerHand.length > 0 && currentPlayer === 'computer') {
			setTimeout(computerTurn, 1000);
		}
	}

	function applyCardEffect(card: Card): void {
		switch (card.value) {
			case 'Skip':
			case 'Reverse':
				// In a two-player game, both Skip and Reverse allow the current player to go again
				break;
			case 'Draw Two':
				if (currentPlayer === 'player') {
					drawCards(computerHand, 2);
				} else {
					drawCards(playerHand, 2);
				}
				break;
			case 'Wild Draw Four':
				if (currentPlayer === 'player') {
					drawCards(computerHand, 4);
				} else {
					drawCards(playerHand, 4);
				}
				break;
			default:
				currentPlayer = currentPlayer === 'player' ? 'computer' : 'player';
		}
	}

	function drawCards(hand: Card[], count: number): void {
		for (let i = 0; i < count; i++) {
			if (deck.length > 0) {
				hand.push(deck.pop()!);
			} else {
				reshuffleDeck();
				if (deck.length > 0) {
					hand.push(deck.pop()!);
				} else {
					message = 'No more cards in the deck!';
					break;
				}
			}
		}
	}

	function reshuffleDeck(): void {
		let discardPile = deck.splice(0, deck.length);
		deck = discardPile.concat(deck);
		shuffleDeck();
	}

	function drawCard(): void {
		if (currentPlayer !== 'player') return;
		if (deck.length > 0) {
			const drawnCard = deck.pop()!;
			playerHand = [...playerHand, drawnCard];
			if (
				drawnCard.color === currentColor ||
				drawnCard.value === currentCard?.value ||
				drawnCard.color === 'wild'
			) {
				playCard(drawnCard);
			} else {
				currentPlayer = 'computer';
				setTimeout(computerTurn, 1000);
			}
		} else {
			reshuffleDeck();
			if (deck.length > 0) {
				drawCard();
			} else {
				message = 'No more cards in the deck!';
			}
		}
	}

	function computerTurn(): void {
		let playableCards = computerHand.filter(
			(card) =>
				card.color === 'wild' || card.color === currentColor || card.value === currentCard?.value
		);

		if (playableCards.length > 0) {
			let selectedCard = playableCards[Math.floor(Math.random() * playableCards.length)];

			// Prioritize matching color or value
			if (selectedCard.color === currentColor) {
				selectedCard = playableCards.find((card) => card.color === currentColor)!;
			} else if (selectedCard.value === currentCard?.value) {
				selectedCard = playableCards.find((card) => card.value === currentCard?.value)!;
			}

			currentCard = selectedCard;
			currentColor =
				selectedCard.color === 'wild'
					? colors[Math.floor(Math.random() * colors.length)]
					: selectedCard.color;
			computerHand = computerHand.filter((c) => c !== selectedCard);

			applyCardEffect(selectedCard);
			checkWinCondition('computer');
			if (currentPlayer === 'computer') {
				setTimeout(computerTurn, 1000);
			}
		} else {
			drawCards(computerHand, 1);
			currentPlayer = 'player';
		}
	}

	function checkWinCondition(player: Player): void {
		if (player === 'player' && playerHand.length === 0) {
			message = 'Congratulations! You win!';
			setTimeout(initializeGame, 2000);
		} else if (player === 'computer' && computerHand.length === 0) {
			message = 'Computer wins! Better luck next time.';
			setTimeout(initializeGame, 2000);
		}
	}

	function initializeGame(): void {
		createDeck();
		shuffleDeck();
		dealInitialHands();
		currentCard = deck.pop()!;
		while (currentCard.color === 'wild') {
			deck.push(currentCard);
			shuffleDeck();
			currentCard = deck.pop()!;
		}
		currentColor = currentCard.color;
		currentPlayer = 'player';
		message = '';
		showColorChooser = false;
	}

	onMount(() => {
		initializeGame();
	});
</script>

<main>
	<h1>UNO Game with Computer Opponent</h1>
	<div class="computer-hand">
		{#each computerHand as card}
			<div class="card computer-card">UNO</div>
		{/each}
	</div>
	<div class="current-card">
		{#if currentCard}
			<div class="card {currentCard.color}">
				{currentCard.value}
			</div>
		{/if}
	</div>
	<div class="player-hand">
		{#each playerHand as card}
			<button class="card {card.color}" onclick={() => playCard(card)}>
				{card.value}
			</button>
		{/each}
	</div>
	<Button onclick={drawCard}>Draw Card</Button>
	{#if showColorChooser}
		<div class="color-chooser">
			{#each colors as color}
				<Button class={color} onclick={() => chooseColor(color)}>{color}</Button>
			{/each}
		</div>
	{/if}
	{#if message}
		<p class="message text-red-500">{message}</p>
	{/if}
</main>

<style>
	main {
		font-family: Arial, sans-serif;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		background-color: #f0f0f0;
		min-height: 100vh;
	}
	.computer-hand,
	.player-hand {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 20px;
	}
	.card {
		width: 80px;
		height: 120px;
		border: 1px solid #000;
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 18px;
		cursor: pointer;
	}
	.red {
		background-color: #ffcccb;
	}
	.blue {
		background-color: #add8e6;
	}
	.green {
		background-color: #90ee90;
	}
	.yellow {
		background-color: #ffffe0;
	}
	.wild {
		background: linear-gradient(45deg, #ffcccb, #add8e6, #90ee90, #ffffe0);
	}
	.computer-card {
		background-color: #808080;
		color: white;
	}
	.color-chooser {
		display: flex;
		gap: 10px;
		margin-top: 10px;
	}
	.color-chooser button {
		padding: 5px 10px;
	}
	.message {
		margin-top: 10px;
		font-weight: bold;
	}
</style>
