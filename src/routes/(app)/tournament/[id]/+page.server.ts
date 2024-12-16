import {  participantsTable, participantPairsTable, statsTable } from '$lib/server/db/schema';
import * as schema from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

export const load = async ({ locals: { db, user }, params }) => {
	const id = Number(params.id);
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
	return {
		tournament,
		participant
	};
};


export const actions = {
	joinTournament: async ({ locals: { db,user }, params, }) => {
		if (!user) error(401, 'Unauthorized');

		const tournamentId = Number(params.id);
		const userId = user?.id

		try {
			await db.insert(participantsTable).values({
				tournamentId,
				userId
			});
			const tournament = await db.query.tournamentsTable.findFirst({
				where: (t, { eq }) => eq(t.id, tournamentId),
				columns: {
					maxPlayers: true,
					currentPlayers: true
				}
			});
		
			if (tournament) {
				// Update the current number of participants
				const updatedPlayers = tournament.currentPlayers + 1;
		
				await db.update(schema.tournamentsTable)
					.set({ currentPlayers: updatedPlayers })
					.where( eq(schema.tournamentsTable.id, tournamentId))
					
		
				// Check if the tournament is full
				if (updatedPlayers === tournament.maxPlayers) {
					await pairParticipants(tournamentId, db);
				}
			}
			return { success: true };
		} catch (error) {
			console.error('Error joining tournament:', error);
			return { success: false, error: 'Failed to join tournament' };
		}

	}
	
};



async function pairParticipants(tournamentId: number, db: DrizzleD1Database<typeof schema>) {
    const participantsWithStats = await db.query.participantsTable.findMany({
        where: (participants, { eq }) => eq(participants.tournamentId, tournamentId),
        with: {
			user: {
				with: {
					stats: {
						columns: {
							gamesWon: true,
							gamesLost: true,
							gamesDrawn: true
						}
					}
				}
			}

			
           
        },
        orderBy: (participants, { asc }) => asc(participants.points)
    });

    const pairs = [];
    for (let i = 0; i < participantsWithStats.length; i += 2) {
        if (i + 1 < participantsWithStats.length) {
            pairs.push([participantsWithStats[i].userId, participantsWithStats[i + 1].userId]);
        }
    }

    // Insert pairs into the database
    for (const [participantOneId, participantTwoId] of pairs) {
        await db.insert(participantPairsTable).values({
            tournamentId,
            participantOneId,
            participantTwoId,
            round: 1 // Assuming this is the first round
        }).run();
    }

    // Handle odd participant if any
    if (participantsWithStats.length % 2 !== 0) {
        const lastParticipant = participantsWithStats[participantsWithStats.length - 1];
        // Logic to handle the odd participant, e.g., give a bye
    }
}
