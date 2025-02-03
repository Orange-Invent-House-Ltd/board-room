import PartySocket from 'partysocket';
import type { TournamentMessage, TournamentState } from '../types/tournament';

type TournamentHook = {
	connect: () => void;
	disconnect: () => void;
	joinTournament: (player: { id: number; username: string }) => void;
	submitMatchResult: (matchId: string, winnerId: number) => void;
	markPlayerReady: (playerId: number, matchId: string) => void;
	sendChatMessage: (message: { playerId: number; content: string; username: string }) => void;
	forfeitMatch: (playerId: number, matchId: string) => void;
};

export function createTournamentConnection(
	tournamentId: string,
	onMessage: (message: TournamentMessage) => void
): TournamentHook {
	let socket: PartySocket | null = null;

	const connect = () => {
		if (socket) return;

		socket = new PartySocket({
			host: import.meta.env.VITE_PARTYKIT_HOST as string,
			room: tournamentId,
			party: 'tournament'
		});

		socket.addEventListener('message', (event) => {
			const message = JSON.parse(event.data) as TournamentMessage;
			onMessage(message);
		});
	};

	const disconnect = () => {
		if (!socket) return;
		socket.close();
		socket = null;
	};

	const send = (message: TournamentMessage) => {
		if (!socket) return;
		socket.send(JSON.stringify(message));
	};

	const joinTournament = (player: { id: number; username: string }) => {
		send({
			type: 'JOIN_TOURNAMENT',
			payload: player
		});
	};

	const submitMatchResult = (matchId: string, winnerId: number) => {
		send({
			type: 'MATCH_RESULT',
			payload: { matchId, winnerId }
		});
	};

	const markPlayerReady = (playerId: number, matchId: string) => {
		send({
			type: 'PLAYER_READY',
			payload: { playerId, matchId }
		});
	};

	const sendChatMessage = (message: { playerId: number; content: string; username: string }) => {
		send({
			type: 'CHAT_MESSAGE',
			payload: message
		});
	};

	const forfeitMatch = (playerId: number, matchId: string) => {
		send({
			type: 'FORFEIT_MATCH',
			payload: { playerId, matchId }
		});
	};

	return {
		connect,
		disconnect,
		joinTournament,
		submitMatchResult,
		markPlayerReady,
		sendChatMessage,
		forfeitMatch
	};
}
