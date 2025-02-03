export type Player = {
	id: number;
	username: string;
	points: number;
	buchholzScore: number;
	opponentsPlayed: number[];
	hasReceivedBye: boolean;
	connected: boolean;
};

export type Match = {
	id: string;
	player1Id: number;
	player2Id: number;
	winner?: number;
	roundNumber: number;
	isBye: boolean;
	status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
};

export type TournamentState = {
	id: number;
	name: string;
	status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
	players: Player[];
	currentRound: number;
	numberOfRounds: number;
	maxPlayers: number;
	startTime: number;
	matches: Match[];
	roundStartTime?: number;
	roundDurationMinutes: number;
	chatMessages: ChatMessage[];
	currentPlayers: number;
};

export type TournamentMessage = {
	type:
		| 'JOIN_TOURNAMENT'
		| 'MATCH_RESULT'
		| 'PLAYER_READY'
		| 'ROUND_START'
		| 'ROUND_END'
		| 'FORFEIT_MATCH'
		| 'CHAT_MESSAGE'
		| 'TOURNAMENT_START_COUNTDOWN'
		| 'COUNTDOWN_UPDATE'
		| 'STATE_UPDATE'
		| 'TOURNAMENT_START'
		| 'TOURNAMENT_END'
		| 'ERROR';
	payload: any;
};

export type ChatMessage = {
	playerId: number;
	content: string;
	timestamp: number;
	username: string;
};
