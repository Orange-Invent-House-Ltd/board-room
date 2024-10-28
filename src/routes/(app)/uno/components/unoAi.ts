import { type Card, drawCard, type GameState, isPlayValid, playCard } from './unoCore';

function chooseCardAI(hand: Card[], topCard: Card): number | null {
	// First, try to play a card of the same color
	for (let i = 0; i < hand.length; i++) {
		if (hand[i].color === topCard.color) {
			return i;
		}
	}

	// If no color match, try to play a card of the same value
	for (let i = 0; i < hand.length; i++) {
		if (hand[i].value === topCard.value) {
			return i;
		}
	}

	// If no match, play a wild card if available
	for (let i = 0; i < hand.length; i++) {
		if (hand[i].color === 'Wild') {
			return i;
		}
	}

	// If no playable card, return null to draw
	return null;
}

function chooseBestColorAI(hand: Card[]): 'Red' | 'Blue' | 'Green' | 'Yellow' {
	const colorCounts = { Red: 0, Blue: 0, Green: 0, Yellow: 0 };
	for (const card of hand) {
		if (card.color !== 'Wild') {
			colorCounts[card.color]++;
		}
	}
	return Object.entries(colorCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0] as
		| 'Red'
		| 'Blue'
		| 'Green'
		| 'Yellow';
}

function playAITurn(gameState: GameState): GameState {
	const currentPlayer = gameState.players[gameState.currentPlayerIndex];
	const topCard = gameState.discardPile[gameState.discardPile.length - 1];

	const cardIndexToPlay = chooseCardAI(currentPlayer.hand, topCard);

	if (cardIndexToPlay !== null) {
		gameState = playCard(gameState, cardIndexToPlay);

		// If a wild card was played, choose the best color
		if (gameState.discardPile[gameState.discardPile.length - 1].color === 'Wild') {
			const newColor = chooseBestColorAI(currentPlayer.hand);
			gameState.discardPile[gameState.discardPile.length - 1].color = newColor;
		}
	} else {
		gameState = drawCard(gameState);
	}

	return gameState;
}

export default playAITurn;
