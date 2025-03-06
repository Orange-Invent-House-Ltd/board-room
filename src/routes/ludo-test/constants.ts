export const COORDINATES_MAP = {
	// Main track coordinates
	0: [6, 13], // P1 start
	1: [6, 12],
	2: [6, 11],
	3: [6, 10],
	4: [6, 9],
	5: [5, 8],
	6: [4, 8],
	7: [3, 8],
	8: [2, 8],
	9: [1, 8],
	10: [0, 8],
	11: [0, 7],
	12: [0, 6],
	13: [1, 6], // Safe spot
	14: [2, 6],
	15: [3, 6],
	16: [4, 6],
	17: [5, 6],
	18: [6, 5],
	19: [6, 4],
	20: [6, 3],
	21: [6, 2],
	22: [6, 1],
	23: [6, 0],
	24: [7, 0],
	25: [8, 0], // P2 start
	26: [8, 1],
	27: [8, 2],
	28: [8, 3],
	29: [8, 4],
	30: [8, 5],
	31: [9, 6],
	32: [10, 6],
	33: [11, 6],
	34: [12, 6],
	35: [13, 6],
	36: [14, 6],
	37: [14, 7],
	38: [14, 8],
	39: [13, 8], // Safe spot
	40: [12, 8],
	41: [11, 8],
	42: [10, 8],
	43: [9, 8],
	44: [8, 9],
	45: [8, 10],
	46: [8, 11],
	47: [8, 12],
	48: [8, 13],
	49: [8, 14],
	50: [7, 14],
	51: [6, 14],

	// HOME ENTRANCE
	// P1 home path
	100: [7, 13],
	101: [7, 12],
	102: [7, 11],
	103: [7, 10],
	104: [7, 9],
	105: [7, 8], // P1 home

	// P2 home path
	200: [7, 1],
	201: [7, 2],
	202: [7, 3],
	203: [7, 4],
	204: [7, 5],
	205: [7, 6], // P2 home

	// BASE POSITIONS
	// P1 base (bottom-left)
	500: [2, 11],
	501: [4, 11],
	502: [2, 13],
	503: [4, 13],

	// P2 base (top-right)
	600: [11, 2],
	601: [13, 2],
	602: [11, 4],
	603: [13, 4]
};

export const STEP_LENGTH = 6.66; // Adjusted for standard board size

export const PLAYERS = ['P1', 'P2'];

export const BASE_POSITIONS = {
	P1: [500, 501, 502, 503],
	P2: [600, 601, 602, 603]
};

export const START_POSITIONS = {
	P1: 0,
	P2: 26
};

export const HOME_ENTRANCE = {
	P1: [100, 101, 102, 103, 104],
	P2: [200, 201, 202, 203, 204]
};

export const HOME_POSITIONS = {
	P1: 105,
	P2: 205
};

export const TURNING_POINTS = {
	P1: 50,
	P2: 24
};

export const SAFE_POSITIONS = [0, 8, 13, 21, 26, 34, 39, 47];

export const STATE = {
	DICE_NOT_ROLLED: 'DICE_NOT_ROLLED',
	DICE_ROLLED: 'DICE_ROLLED'
};

export const PLAYER_COLORS = {
	P1: {
		primary: '#2563eb',
		secondary: '#3b82f6',
		accent: '#60a5fa',
		text: '#1e40af'
	},
	P2: {
		primary: '#16a34a',
		secondary: '#22c55e',
		accent: '#4ade80',
		text: '#15803d'
	}
} as const;
