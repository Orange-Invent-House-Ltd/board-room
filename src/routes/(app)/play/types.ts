export interface Card {
	color: 'red' | 'blue' | 'green' | 'yellow' | 'wild';
	value: string;
	row: number;
	column: number;
}
