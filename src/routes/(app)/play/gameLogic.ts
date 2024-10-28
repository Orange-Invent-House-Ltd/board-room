// src/gameLogic.ts
import type { Card } from './types';

export function createDeck(): Card[] {
	const colors: Card['color'][] = ['red', 'blue', 'green', 'yellow'];
	const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Skip', 'Reverse', 'Draw Two'];
	const deck: Card[] = [];

	colors.forEach((color, colorIndex) => {
		values.forEach((value, valueIndex) => {
			deck.push({ color, value, row: colorIndex, column: valueIndex });
			if (value !== '0') {
				deck.push({ color, value, row: colorIndex + 4, column: valueIndex });
			}
		});
	});

	// Add wild cards
	for (let i = 0; i < 4; i++) {
		deck.push({ color: 'wild', value: 'Wild', row: i % 2, column: 13 });
		deck.push({ color: 'wild', value: 'Wild Draw Four', row: 2 + (i % 2), column: 13 });
	}

	return deck;
}

// ... rest of the gameLogic.ts file remains the same
export function shuffleDeck(deck: Card[]): Card[] {
	return [...deck].sort(() => Math.random() - 0.5);
}

export function dealCards(deck: Card[]): [Card[], Card[], Card[]] {
	const playerHand = deck.splice(0, 7);
	const computerHand = deck.splice(0, 7);
	return [playerHand, computerHand, deck];
}
