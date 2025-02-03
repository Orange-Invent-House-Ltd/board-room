import type * as Party from 'partykit/server';
import type {
	TournamentState,
	TournamentMessage,
	Match,
	Player
} from '../src/lib/types/tournament';

function calculateNumberOfRounds(playerCount: number): number {
	return Math.ceil(Math.log2(Math.max(playerCount, 2)));
}

export default class TournamentServer implements Party.Server {
	private state: TournamentState;
	private countdownInterval: NodeJS.Timeout | null = null;

	constructor(readonly room: Party.Room) {
		this.state = {
			id: 0,
			name: '',
			status: 'UPCOMING',
			players: [],
			currentRound: 0,
			numberOfRounds: 0,
			maxPlayers: 0,
			startTime: 0,
			matches: [],
			roundDurationMinutes: 30,
			chatMessages: [],
			currentPlayers: 0
		};
	}

	async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
		// Send current state to new connection
		conn.send(
			JSON.stringify({
				type: 'STATE_UPDATE',
				payload: {
					status: this.state.status,
					players: this.state.players,
					currentRound: this.state.currentRound,
					matches: this.getCurrentRoundMatches(),
					chatMessages: this.state.chatMessages
				}
			})
		);
	}

	async onMessage(message: string, sender: Party.Connection) {
		const data = JSON.parse(message) as TournamentMessage;

		switch (data.type) {
			case 'JOIN_TOURNAMENT':
				await this.handlePlayerJoin(data.payload, sender);
				break;
			case 'MATCH_RESULT':
				await this.handleMatchResult(data.payload);
				break;
			case 'PLAYER_READY':
				await this.handlePlayerReady(data.payload);
				break;
			case 'CHAT_MESSAGE':
				await this.handleChatMessage(data.payload);
				break;
			case 'FORFEIT_MATCH':
				await this.handleForfeit(data.payload);
				break;
		}
	}

	private async handlePlayerJoin(player: { id: number; username: string }, conn: Party.Connection) {
		if (this.state.status !== 'UPCOMING' || this.state.currentPlayers >= this.state.maxPlayers) {
			conn.send(
				JSON.stringify({
					type: 'ERROR',
					payload: 'Tournament is not accepting new players'
				})
			);
			return;
		}

		if (this.state.players.some((p) => p.id === player.id)) {
			conn.send(
				JSON.stringify({
					type: 'ERROR',
					payload: 'Player ID already exists in tournament'
				})
			);
			return;
		}

		if (this.state.players.some((p) => p.username === player.username)) {
			conn.send(
				JSON.stringify({
					type: 'ERROR',
					payload: 'Username already taken'
				})
			);
			return;
		}

		this.state.currentPlayers++;
		this.state.players.push({
			id: player.id,
			username: player.username,
			points: 0,
			buchholzScore: 0,
			opponentsPlayed: [],
			hasReceivedBye: false,
			connected: true
		});

		await this.saveState();
		this.broadcastState();

		if (this.state.currentPlayers === this.state.maxPlayers) {
			await this.startTournament();
		}
	}

	private async handleMatchResult(result: { matchId: string; winnerId: number }) {
		const match = this.state.matches.find((m) => m.id === result.matchId);
		if (!match || match.status === 'COMPLETED') return;

		match.winner = result.winnerId;
		match.status = 'COMPLETED';

		const winner = this.state.players.find((p) => p.id === result.winnerId);
		if (winner) {
			winner.points += 1;
			winner.opponentsPlayed.push(
				match.player1Id === winner.id ? match.player2Id : match.player1Id
			);
		}

		await this.saveState();
		this.broadcastState();

		const currentRoundMatches = this.getCurrentRoundMatches();
		if (currentRoundMatches.every((m) => m.status === 'COMPLETED')) {
			await this.endRound();
		}
	}

	private async handlePlayerReady(data: { playerId: number; matchId: string }) {
		const match = this.state.matches.find((m) => m.id === data.matchId);
		if (!match || match.status !== 'SCHEDULED') return;

		match.status = 'IN_PROGRESS';
		await this.saveState();
		this.broadcastState();
	}

	private async handleChatMessage(data: { playerId: number; content: string; username: string }) {
		const message = {
			playerId: data.playerId,
			content: data.content,
			username: data.username,
			timestamp: Date.now()
		};

		this.state.chatMessages.push(message);
		await this.saveState();

		this.room.broadcast(
			JSON.stringify({
				type: 'CHAT_MESSAGE',
				payload: message
			})
		);
	}

	private async handleForfeit(data: { playerId: number; matchId: string }) {
		const match = this.state.matches.find((m) => m.id === data.matchId);
		if (!match || match.status === 'COMPLETED') return;

		if (match.player1Id !== data.playerId && match.player2Id !== data.playerId) return;

		const winnerId = match.player1Id === data.playerId ? match.player2Id : match.player1Id;

		match.winner = winnerId;
		match.status = 'COMPLETED';

		const winner = this.state.players.find((p) => p.id === winnerId);
		if (winner) {
			winner.points += 1;
			winner.opponentsPlayed.push(data.playerId);
		}

		const forfeiter = this.state.players.find((p) => p.id === data.playerId);
		if (forfeiter) {
			forfeiter.opponentsPlayed.push(winnerId);
		}

		await this.saveState();
		this.broadcastState();

		const currentRoundMatches = this.getCurrentRoundMatches();
		if (currentRoundMatches.every((m) => m.status === 'COMPLETED')) {
			await this.endRound();
		}
	}

	private async startTournament() {
		if (this.countdownInterval) {
			clearInterval(this.countdownInterval);
			this.countdownInterval = null;
		}

		this.state.status = 'LIVE';
		this.state.currentRound = 1;
		this.state.numberOfRounds = calculateNumberOfRounds(this.state.currentPlayers);
		this.state.roundStartTime = Date.now();

		await this.generatePairings();
		await this.saveState();

		this.room.broadcast(
			JSON.stringify({
				type: 'TOURNAMENT_START',
				payload: {
					currentRound: this.state.currentRound,
					matches: this.getCurrentRoundMatches()
				}
			})
		);
	}

	private async generatePairings() {
		const players = [...this.state.players].sort((a, b) => {
			if (a.points !== b.points) return b.points - a.points;
			return b.buchholzScore - a.buchholzScore;
		});

		const matches: Match[] = [];
		const paired = new Set<number>();

		for (let i = 0; i < players.length; i++) {
			if (paired.has(players[i].id)) continue;

			let opponent = null;
			for (let j = i + 1; j < players.length; j++) {
				if (!paired.has(players[j].id) && !players[i].opponentsPlayed.includes(players[j].id)) {
					opponent = players[j];
					break;
				}
			}

			if (opponent) {
				matches.push({
					id: `${this.state.currentRound}-${players[i].id}-${opponent.id}`,
					player1Id: players[i].id,
					player2Id: opponent.id,
					roundNumber: this.state.currentRound,
					isBye: false,
					status: 'SCHEDULED'
				});
				paired.add(players[i].id);
				paired.add(opponent.id);
			} else {
				matches.push({
					id: `${this.state.currentRound}-${players[i].id}-bye`,
					player1Id: players[i].id,
					player2Id: 0,
					roundNumber: this.state.currentRound,
					isBye: true,
					status: 'COMPLETED'
				});
				paired.add(players[i].id);

				const playerIndex = this.state.players.findIndex((p) => p.id === players[i].id);
				if (playerIndex !== -1) {
					this.state.players[playerIndex].points += 1;
					this.state.players[playerIndex].hasReceivedBye = true;
				}
			}
		}

		this.state.matches = [...this.state.matches, ...matches];
	}

	private async endRound() {
		await this.updateBuchholzScores();

		if (this.state.currentRound >= this.state.numberOfRounds) {
			this.state.status = 'COMPLETED';
			await this.saveState();
			this.room.broadcast(
				JSON.stringify({
					type: 'TOURNAMENT_END',
					payload: {
						winners: this.getWinners()
					}
				})
			);
			return;
		}

		this.state.currentRound++;
		this.state.roundStartTime = Date.now();
		await this.generatePairings();
		await this.saveState();

		this.room.broadcast(
			JSON.stringify({
				type: 'ROUND_START',
				payload: {
					currentRound: this.state.currentRound,
					matches: this.getCurrentRoundMatches()
				}
			})
		);
	}

	private async updateBuchholzScores() {
		for (const player of this.state.players) {
			let buchholzScore = 0;
			for (const opponentId of player.opponentsPlayed) {
				const opponent = this.state.players.find((p) => p.id === opponentId);
				if (opponent) {
					buchholzScore += opponent.points;
				}
			}
			player.buchholzScore = buchholzScore;
		}
	}

	private getWinners() {
		return [...this.state.players]
			.sort((a, b) => {
				if (a.points !== b.points) return b.points - a.points;
				return b.buchholzScore - a.buchholzScore;
			})
			.slice(0, 3);
	}

	private getCurrentRoundMatches() {
		return this.state.matches.filter((m) => m.roundNumber === this.state.currentRound);
	}

	private broadcastState() {
		this.room.broadcast(
			JSON.stringify({
				type: 'STATE_UPDATE',
				payload: {
					status: this.state.status,
					players: this.state.players,
					currentRound: this.state.currentRound,
					matches: this.getCurrentRoundMatches()
				}
			})
		);
	}

	private async saveState() {
		await this.room.storage.put('tournamentState', this.state);
	}

	async onClose(connection: Party.Connection) {
		// Handle disconnection
		const playerId = connection.id;
		const playerIndex = this.state.players.findIndex((p) => p.id.toString() === playerId);
		if (playerIndex !== -1) {
			this.state.players[playerIndex].connected = false;
			await this.saveState();
			this.broadcastState();
		}
	}
}
