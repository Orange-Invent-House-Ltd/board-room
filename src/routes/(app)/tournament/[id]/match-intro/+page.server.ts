import { participantPairsTable, matches, usersTable } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq, and, or } from 'drizzle-orm';

export const load = async ({ locals: { db, user }, params }) => {
	if (!user) throw error(401, 'Unauthorized');

	const tournamentId = Number(params.id);

	// First check if there's an active match
	const currentMatch = await db.query.matches.findFirst({
		where: (m, { eq, and }) =>
			and(
				eq(m.tournamentId, tournamentId),
				eq(m.status, 'SCHEDULED'),
				or(eq(m.player1Id, user.id), eq(m.player2Id, user.id))
			),
		with: {
			player1: true,
			player2: true
		}
	});

	if (currentMatch) {
		const opponent =
			currentMatch.player1Id === user.id ? currentMatch.player2 : currentMatch.player1;
		return {
			opponent,
			matchId: currentMatch.id
		};
	}

	// If no match found, check participant pairs
	const pair = await db.query.participantPairsTable.findFirst({
		where: (p, { eq, and }) =>
			and(
				eq(p.tournamentId, tournamentId),
				or(eq(p.participantOneId, user.id), eq(p.participantTwoId, user.id))
			),
		with: {
			participantOne: {
				with: {
					user: true
				}
			},
			participantTwo: {
				with: {
					user: true
				}
			}
		}
	});

	if (!pair) {
		throw error(404, 'No opponent found');
	}

	const opponent = pair.participantOneId === user.id ? pair.participantTwo : pair.participantOne;

	// Create a new match for these participants
	const newMatch = await db
		.insert(matches)
		.values({
			tournamentId,
			player1Id: pair.participantOneId,
			player2Id: pair.participantTwoId,
			status: 'SCHEDULED',
			result: 'ONGOING'
		})
		.returning();

	return {
		opponent,
		matchId: newMatch[0].id
	};
};

export const actions = {
	ready: async ({ locals: { db, user }, params, request }) => {
		if (!user) throw error(401, 'Unauthorized');

		const formData = await request.formData();
		const matchId = formData.get('matchId');

		if (!matchId) throw error(400, 'Match ID is required');

		const match = await db.query.matches.findFirst({
			where: (m, { eq }) => eq(m.id, Number(matchId))
		});

		if (!match) throw error(404, 'Match not found');

		// Logic for handling ready state could go here
		// You might want to store this in a separate table or use WebSocket for real-time updates
	},

	abort: async ({ locals: { db, user }, params }) => {
		if (!user) throw error(401, 'Unauthorized');

		const tournamentId = Number(params.id);

		// Delete the match and participant pair
		await db
			.delete(matches)
			.where(
				and(
					eq(matches.tournamentId, tournamentId),
					or(eq(matches.player1Id, user.id), eq(matches.player2Id, user.id))
				)
			);

		await db
			.delete(participantPairsTable)
			.where(
				and(
					eq(participantPairsTable.tournamentId, tournamentId),
					or(
						eq(participantPairsTable.participantOneId, user.id),
						eq(participantPairsTable.participantTwoId, user.id)
					)
				)
			);

		return { success: true };
	}
};
