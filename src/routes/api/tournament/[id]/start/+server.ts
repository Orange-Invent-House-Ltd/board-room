import { matches, tournamentsTable } from '$lib/server/db/schema.js';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const POST = async ({ locals, params, request }) => {
	const { db } = locals;
	const id = Number(params.id);
	const {
		status,
		currentRound,
		numberOfRounds,
		matches: matchesData
	}: {
		status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
		currentRound: number;
		numberOfRounds: number;
		matches: {
			roundNumber: number;
			player1Id: number;
			player2Id: number;
			status: 'LIVE' | 'COMPLETED' | 'SCHEDULED' | 'READY';
			isBye: boolean;
			id: number;
		}[];
	} = await request.json();
	await db
		.update(tournamentsTable)
		.set({
			status: status,
			currentRound,
			numberOfRounds
		})
		.where(eq(tournamentsTable.id, id));
	await db.insert(matches).values(
		matchesData.map((m) => ({
			tournamentId: id,
			roundNumber: m.roundNumber,
			player1Id: m.player1Id,
			player2Id: m.player2Id,
			status: m.status,
			isBye: m.isBye,
			id: m.id
		}))
	);
	console.log(matchesData);

	return json({ success: true });
};
