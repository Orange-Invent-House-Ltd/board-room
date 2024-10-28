// Types
type Color = 'Red' | 'Blue' | 'Green' | 'Yellow' | 'Wild';
type Value =
	| 0
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8
	| 9
	| 'Skip'
	| 'Reverse'
	| 'DrawTwo'
	| 'Wild'
	| 'WildDrawFour';

interface Card {
	color: Color;
	value: Value;
}

interface Player {
	id: string;
	hand: Card[];
	isComputer: boolean;
}

interface GameState {
	deck: Card[];
	discardPile: Card[];
	players: Player[];
	currentPlayerIndex: number;
	direction: 1 | -1;
	winner: string | null;
}

// Helper functions
function createDeck(): Card[] {
	const deck: Card[] = [];
	const colors: Color[] = ['Red', 'Blue', 'Green', 'Yellow'];
	const values: Value[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'Skip', 'Reverse', 'DrawTwo'];

	// Add color cards
	for (const color of colors) {
		for (const value of values) {
			deck.push({ color, value });
			if (value !== 0) {
				deck.push({ color, value });
			}
		}
	}

	// Add wild cards
	for (let i = 0; i < 4; i++) {
		deck.push({ color: 'Wild', value: 'Wild' });
		deck.push({ color: 'Wild', value: 'WildDrawFour' });
	}

	return shuffleDeck(deck);
}

function shuffleDeck(deck: Card[]): Card[] {
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	return deck;
}

function dealInitialHands(deck: Card[], numPlayers: number): [Card[][], Card[]] {
	const hands: Card[][] = Array(numPlayers)
		.fill([])
		.map(() => []);
	for (let i = 0; i < 7; i++) {
		for (let j = 0; j < numPlayers; j++) {
			hands[j].push(deck.pop()!);
		}
	}
	return [hands, deck];
}

function initializeGameState(numPlayers: number, numComputers: number): GameState {
	const deck = createDeck();
	const [hands, remainingDeck] = dealInitialHands(deck, numPlayers);

	const players: Player[] = hands.map((hand, index) => ({
		id: `player${index}`,
		hand,
		isComputer: index >= numPlayers - numComputers
	}));

	const initialDiscard = remainingDeck.pop()!;

	return {
		deck: remainingDeck,
		discardPile: [initialDiscard],
		players,
		currentPlayerIndex: 0,
		direction: 1,
		winner: null
	};
}

// Game logic functions
function isPlayValid(card: Card, topCard: Card): boolean {
	return card.color === topCard.color || card.value === topCard.value || card.color === 'Wild';
}

function playCard(gameState: GameState, cardIndex: number): GameState {
	const currentPlayer = gameState.players[gameState.currentPlayerIndex];
	const playedCard = currentPlayer.hand[cardIndex];

	if (!isPlayValid(playedCard, gameState.discardPile[gameState.discardPile.length - 1])) {
		throw new Error('Invalid play');
	}

	// Remove the card from the player's hand
	currentPlayer.hand.splice(cardIndex, 1);

	// Add the card to the discard pile
	gameState.discardPile.push(playedCard);

	// Handle special cards
	switch (playedCard.value) {
		case 'Skip':
			gameState.currentPlayerIndex =
				(gameState.currentPlayerIndex + gameState.direction * 2) % gameState.players.length;
			break;
		case 'Reverse':
			gameState.direction *= -1;
			if (gameState.players.length === 2) {
				gameState.currentPlayerIndex =
					(gameState.currentPlayerIndex + gameState.direction) % gameState.players.length;
			}
			break;
		case 'DrawTwo':
			const nextPlayerIndex =
				(gameState.currentPlayerIndex + gameState.direction) % gameState.players.length;
			gameState.players[nextPlayerIndex].hand.push(...gameState.deck.splice(0, 2));
			gameState.currentPlayerIndex =
				(gameState.currentPlayerIndex + gameState.direction * 2) % gameState.players.length;
			break;
		case 'WildDrawFour':
			const nextPlayerIdx =
				(gameState.currentPlayerIndex + gameState.direction) % gameState.players.length;
			gameState.players[nextPlayerIdx].hand.push(...gameState.deck.splice(0, 4));
			gameState.currentPlayerIndex =
				(gameState.currentPlayerIndex + gameState.direction * 2) % gameState.players.length;
			// Color change handled separately
			break;
		default:
			gameState.currentPlayerIndex =
				(gameState.currentPlayerIndex + gameState.direction) % gameState.players.length;
	}

	// Check for winner
	if (currentPlayer.hand.length === 0) {
		gameState.winner = currentPlayer.id;
	}

	return gameState;
}

function drawCard(gameState: GameState): GameState {
	const currentPlayer = gameState.players[gameState.currentPlayerIndex];

	if (gameState.deck.length === 0) {
		// Reshuffle the discard pile if the deck is empty
		const topCard = gameState.discardPile.pop()!;
		gameState.deck = shuffleDeck(gameState.discardPile);
		gameState.discardPile = [topCard];
	}

	currentPlayer.hand.push(gameState.deck.pop()!);
	gameState.currentPlayerIndex =
		(gameState.currentPlayerIndex + gameState.direction) % gameState.players.length;

	return gameState;
}

// Export the functions and types
export {
	Card,
	Player,
	GameState,
	createDeck,
	initializeGameState,
	isPlayValid,
	playCard,
	drawCard
};
