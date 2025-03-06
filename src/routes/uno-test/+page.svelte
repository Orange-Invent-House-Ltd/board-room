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

	function isValidMove(card: Card): boolean {
		// Wild cards can always be played
		if (card.color === 'wild') {
			// Wild Draw Four has special rules
			if (card.value === 'Wild Draw Four') {
				// Check if player has any cards matching current color
				return !playerHand.some((c) => c.color === currentColor && c.color !== 'wild');
			}
			return true;
		}

		// Match color or value
		return card.color === currentColor || card.value === currentCard?.value;
	}

	function playCard(card: Card): void {
		if (currentPlayer !== 'player') return;

		if (!isValidMove(card)) {
			if (card.value === 'Wild Draw Four') {
				message = 'You can only play Wild Draw Four when you have no matching colors!';
			} else {
				message = 'Invalid move! Card must match color or number.';
			}
			return;
		}

		const randomNumber = getRandomNumber();
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
				// Player keeps their turn after Skip
				break;
			case 'Reverse':
				// Player keeps their turn after Reverse in 2-player game
				break;
			case 'Draw Two':
				if (currentPlayer === 'player') {
					drawCards(computerHand, 2);
					// Keep player's turn
				} else {
					drawCards(playerHand, 2);
					// Keep computer's turn
				}
				break;
			case 'Wild Draw Four':
				if (currentPlayer === 'player') {
					drawCards(computerHand, 4);
					// Keep player's turn
				} else {
					drawCards(playerHand, 4);
					// Keep computer's turn
				}
				break;
			default:
				// Only change turns for regular number cards
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
		// Only reshuffle if there are cards in the discard pile (currentCard)
		if (currentCard) {
			const topCard = currentCard;
			deck = [topCard]; // Keep the current top card
			shuffleDeck();
			currentCard = deck[0]; // Restore the top card
		}
	}

	function debugDeck(): void {
		console.log('Current deck:', deck);
		console.log('Player hand:', playerHand);
		console.log('Current card:', currentCard);
	}

	function drawCard(): void {
		console.log('Draw card clicked'); // Debug log

		if (currentPlayer !== 'player') {
			message = "It's not your turn!";
			return;
		}

		const hasValidMove = playerHand.some((card) => isValidMove(card));
		if (hasValidMove) {
			message = 'You must play a valid card if you have one!';
			return;
		}

		if (deck.length > 0) {
			const drawnCard = deck.pop()!;
			playerHand = [...playerHand, drawnCard];
			message = isValidMove(drawnCard)
				? 'You drew a playable card! Click it to play.'
				: 'No playable cards. Turn passes to computer.';

			// Force a UI update
			playerHand = [...playerHand];
			deck = [...deck];

			if (!isValidMove(drawnCard)) {
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
			debugDeck(); // Debug log
		}
	}

	function computerTurn(): void {
		let playableCards = computerHand.filter((card) => isValidMove(card));

		if (playableCards.length > 0) {
			// Prioritize action cards if available
			let selectedCard =
				playableCards.find((card) =>
					['Skip', 'Reverse', 'Draw Two', 'Wild Draw Four'].includes(card.value)
				) ||
				playableCards.find((card) => card.color !== 'wild') ||
				playableCards[Math.floor(Math.random() * playableCards.length)];

			currentCard = selectedCard;
			currentColor =
				selectedCard.color === 'wild'
					? colors[Math.floor(Math.random() * colors.length)]
					: selectedCard.color;
			computerHand = computerHand.filter((c) => c !== selectedCard);

			applyCardEffect(selectedCard);

			// Check win before continuing
			if (checkWinCondition('computer')) {
				return;
			}

			// If it was an action card, computer plays again
			if (['Skip', 'Reverse', 'Draw Two', 'Wild Draw Four'].includes(selectedCard.value)) {
				setTimeout(computerTurn, 1000);
			}
		} else {
			drawCards(computerHand, 1);
			currentPlayer = 'player';
		}
	}

	function checkWinCondition(player: Player): boolean {
		if (player === 'player' && playerHand.length === 0) {
			message = 'Congratulations! You win!';
			setTimeout(initializeGame, 2000);
			return true;
		} else if (player === 'computer' && computerHand.length === 0) {
			message = 'Computer wins! Better luck next time.';
			setTimeout(initializeGame, 2000);
			return true;
		}
		return false;
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

<main class="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 text-white p-8">
	<div class="container mx-auto max-w-4xl">
		<h1
			class="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
		>
			UNO Game
		</h1>

		<div class="game-area">
			<div class="computer-hand-wrapper mb-8">
				<h2 class="text-lg font-semibold mb-2 text-gray-400">Computer's Hand</h2>
				<div class="computer-hand">
					{#each computerHand as card}
						<div class="card computer-card">
							<div class="card-inner">UNO</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="current-card-area my-8 flex justify-center items-center gap-4">
				{#if currentCard}
					<div class="current-card-wrapper">
						<div class="card {currentCard.color} transform hover:scale-105 transition-transform">
							<div class="card-inner">
								{currentCard.value}
							</div>
						</div>
					</div>
				{/if}

				<div class="game-status">
					<div class="px-4 py-2 rounded-lg bg-opacity-20 bg-white">
						<p class="text-sm">
							Current Color: <span class="font-bold capitalize">{currentColor}</span>
						</p>
						<p class="text-sm">Turn: <span class="font-bold capitalize">{currentPlayer}</span></p>
					</div>
				</div>
			</div>

			<div class="player-hand-wrapper">
				<h2 class="text-lg font-semibold mb-2 text-gray-400">Your Hand</h2>
				<div class="player-hand">
					{#each playerHand as card}
						<button class="card {card.color}" on:click={() => playCard(card)}>
							<div class="card-inner">
								{card.value}
							</div>
						</button>
					{/each}
				</div>
			</div>

			<div class="controls mt-6 flex justify-center gap-4">
				<button
					class="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold"
					on:click={drawCard}
				>
					Draw Card
				</button>
			</div>

			{#if showColorChooser}
				<div class="color-chooser mt-6">
					<h3 class="text-center mb-2">Choose a color:</h3>
					<div class="flex justify-center gap-2">
						{#each colors as color}
							<button class="color-button {color}" on:click={() => chooseColor(color)}>
								<span class="sr-only">{color}</span>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			{#if message}
				<div class="message-wrapper mt-4">
					<p class="message text-center py-2 px-4 rounded-lg bg-opacity-20 bg-white">
						{message}
					</p>
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
	.game-area {
		perspective: 1000px;
	}

	.card {
		width: 80px;
		height: 120px;
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 18px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		position: relative;
		overflow: hidden;
	}

	.card:hover {
		transform: translateY(-5px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
	}

	.card-inner {
		padding: 0.5rem;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
	}

	.red {
		background: linear-gradient(135deg, #ff6b6b, #ff4757);
		color: white;
	}

	.blue {
		background: linear-gradient(135deg, #54a0ff, #2e86de);
		color: white;
	}

	.green {
		background: linear-gradient(135deg, #26de81, #20bf6b);
		color: white;
	}

	.yellow {
		background: linear-gradient(135deg, #fed330, #f7b731);
		color: white;
	}

	.wild {
		background: linear-gradient(45deg, #ff6b6b, #54a0ff, #26de81, #fed330);
		color: white;
	}

	.computer-card {
		background: linear-gradient(135deg, #2d3436, #636e72);
		color: white;
		transform-style: preserve-3d;
		animation: float 3s ease-in-out infinite;
	}

	.computer-hand,
	.player-hand {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 10px;
		padding: 1rem;
	}

	.color-button {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 2px solid white;
		transition: transform 0.2s;
	}

	.color-button:hover {
		transform: scale(1.1);
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}

	@media (max-width: 640px) {
		.card {
			width: 60px;
			height: 90px;
			font-size: 14px;
		}
	}
</style>
