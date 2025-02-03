import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { participantsTable, tournamentsTable, matches } from '$lib/server/db/schema';
import type { MatchWithPlayer } from '$lib/types.js';

export const load = async ({ locals: { db, user }, params }) => {
	const id = Number(params.id);
	let isTournamentFull = false;
	const tournament = await db.query.tournamentsTable.findFirst({
		where: (t, { eq }) => eq(t.id, id),
		with: {
			game: true, // Include game details
			creator: true, // Include tournament creator details
			participants: {
				with: {
					user: true // Include full user details for each participant
				},
				orderBy: (participants, { desc }) => [
					desc(participants.points) // Optional: order participants by points
				]
			}
		}
	});

	const participant = tournament?.participants.some((p) => p.userId === user?.id) ?? false;
	if (!tournament) {
		error(404, 'No tournament found');
	}

	if (tournament?.currentPlayers >= tournament.maxPlayers) {
		isTournamentFull = true;
	}

	const participants = await db.query.participantsTable.findMany({
		where: eq(participantsTable.tournamentId, tournament.id),
		with: {
			user: {
				columns: {
					username: true,
					picture: true
				}
			}
		}
	});

	// Get current round matches if tournament is live
	let currentMatches: MatchWithPlayer[] = [];
	if (tournament.status === 'LIVE' && tournament.currentRound > 0) {
		currentMatches = await db.query.matches.findMany({
			where: and(
				eq(matches.tournamentId, tournament.id),
				eq(matches.roundNumber, tournament.currentRound)
			),
			with: {
				player1: {
					columns: {
						username: true
					}
				},
				player2: {
					columns: {
						username: true
					}
				}
			}
		});
	}

	return {
		tournament,
		participant,
		isTournamentFull,
		participants,
		matches: currentMatches
	};
};

// export const actions = {
// 	startRound: async ({ locals: { db, user }, params }) => {
// 		if (!user) throw error(401, 'Unauthorized');

// 		const id = Number(params.id);
// 		const tournament = await db.query.tournamentsTable.findFirst({
// 			where: eq(tournamentsTable.id, id)
// 		});

// 		if (!tournament) throw error(404, 'Tournament not found');
// 		if (tournament.userId !== user.id) throw error(403, 'Not tournament owner');
// 		if (tournament.status !== 'LIVE') throw error(400, 'Tournament not in progress');
// 		if (tournament.currentRound > 0) throw error(400, 'Round already in progress');
// 		if (tournament.currentRound >= tournament.numberOfRounds) {
// 			throw error(400, 'Tournament has ended');
// 		}

// 		// Update Buchholz scores before new round
// 		await updateBuchholzScores(db, tournament.id);

// 		// Generate pairings for new round
// 		const nextRound = tournament.currentRound + 1;
// 		await generatePairings(db, tournament.id, nextRound);

// 		return { success: true };
// 	},

// 	endRound: async ({ locals: { db, user }, params }) => {
// 		if (!user) throw error(401, 'Unauthorized');

// 		const id = Number(params.id);
// 		const tournament = await db.query.tournamentsTable.findFirst({
// 			where: eq(tournamentsTable.id, id)
// 		});

// 		if (!tournament) throw error(404, 'Tournament not found');
// 		if (tournament.userId !== user.id) throw error(403, 'Not tournament owner');
// 		if (tournament.status !== 'LIVE') throw error(400, 'Tournament not in progress');
// 		if (tournament.currentRound === 0) throw error(400, 'No round in progress');

// 		// Check if all matches in current round are completed
// 		const unfinishedMatches = await db.query.matches.findMany({
// 			where: and(
// 				eq(matches.tournamentId, tournament.id),
// 				eq(matches.roundNumber, tournament.currentRound),
// 				eq(matches.status, 'LIVE')
// 			)
// 		});

// 		if (unfinishedMatches.length > 0) {
// 			throw error(400, 'Not all matches are completed');
// 		}

// 		// Update tournament status
// 		await db
// 			.update(tournamentsTable)
// 			.set({
// 				currentRound: 0,
// 				status: tournament.currentRound >= tournament.numberOfRounds ? 'COMPLETED' : 'LIVE'
// 			})
// 			.where(eq(tournamentsTable.id, tournament.id));

// 		return { success: true };
// 	}
// };
