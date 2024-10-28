import type { Card, CardColor, GameState } from './types';
import { isValidPlay } from './gameLogic';

function chooseCardToPlay(hand: Card[], topCard: Card, currentColor: CardColor): number | null {
	// First, try to play a card matching the current color
	for (let i = 0; i < hand.length; i++) {
		if (hand[i].color === currentColor) return i;
	}

	// Then, try to play a card matching the value
	for (let i = 0; i < hand.length; i++) {
		if (hand[i].value === topCard.value) return i;
	}

	// Finally, try to play a wild card
	for (let i = 0; i < hand.length; i++) {
		if (hand[i].color === 'Wild') return i;
	}

	// If no playable card, return null
	return null;
}

function chooseBestColor(hand: Card[]): CardColor {
	const colorCounts = { Red: 0, Blue: 0, Green: 0, Yellow: 0 };
	for (const card of hand) {
		if (card.color !== 'Wild') {
			colorCounts[card.color]++;
		}
	}
	return Object.entries(colorCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0] as CardColor;
}

export function computerPlay(state: GameState): {
	action: 'play' | 'draw';
	cardIndex?: number;
	chosenColor?: CardColor;
} {
	const hand = state.players[state.currentPlayerIndex].hand;
	const topCard = state.discardPile[state.discardPile.length - 1];

	const cardIndexToPlay = chooseCardToPlay(hand, topCard, state.currentColor);

	if (cardIndexToPlay !== null) {
		const chosenColor = hand[cardIndexToPlay].color === 'Wild' ? chooseBestColor(hand) : undefined;
		return { action: 'play', cardIndex: cardIndexToPlay, chosenColor };
	} else {
		return { action: 'draw' };
	}
}
