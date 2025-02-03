import { participantsTable, participantPairsTable, statsTable } from '$lib/server/db/schema';
import * as schema from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

export const load = async ({ locals: { db, user }, params }) => {
	const id = Number(params.id);
	if (!user) {
		error(401, 'Unauthorized');
	}
	const existingParticipant = await db.query.participantsTable.findFirst({
		where: (p, { eq, and }) => and(eq(p.tournamentId, id), eq(p.userId, user.id))
	});

	if (existingParticipant) {
		redirect(303, `/tournament/${id}/lobby`);
	}

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
	console.log('🚀 ~ load ~ participant:', participant);
	if (!tournament) {
		error(404, 'No tournament found');
	}

	if (tournament?.currentPlayers >= tournament.maxPlayers) {
		isTournamentFull = true;
	}

	return {
		tournament,
		participant,
		isTournamentFull
	};
};

export const actions = {
	joinTournament: async ({ locals: { db, user }, params, fetch }) => {
		if (!user) error(401, 'Unauthorized');

		const tournamentId = Number(params.id);
		const userId = user?.id;

		try {
			await db.insert(participantsTable).values({
				tournamentId,
				userId
			});
			const tournament = await db.query.tournamentsTable.findFirst({
				where: (t, { eq }) => eq(t.id, tournamentId)
			});

			if (tournament) {
				// Update the current number of participants
				const updatedPlayers = tournament.currentPlayers + 1;

				const updatedTournament = await db
					.update(schema.tournamentsTable)
					.set({ currentPlayers: updatedPlayers })
					.where(eq(schema.tournamentsTable.id, tournamentId))
					.returning()
					.get();
				const info = await fetch('http://127.0.0.1:8787/tournament/join', {
					method: 'PUT',
					body: JSON.stringify({ ...updatedTournament, username: user.username, userId: user.id })
				});
			}

			return { success: true };
		} catch (error) {
			console.error('Error joining tournament:', error);
			return { success: false, error: 'Failed to join tournament' };
		}
	}
};
