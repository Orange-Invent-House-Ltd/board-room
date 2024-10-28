import { gameHistoryTable, statsTable } from '$lib/server/db/schema.js';
import { error } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';

export const POST = async ({ locals: { db, user }, request }) => {
	const { gameHistoryId, winner, draw }: { gameHistoryId: number; winner: boolean; draw: boolean } =
		await request.json();
	if (!gameHistoryId) error(400, 'Invalid gameHistoryId');
	if (!user) error(401, 'Unauthorized');
	try {
		// First get the game state
		const game = await db.query.gameHistoryTable.findFirst({
			where: and(eq(gameHistoryTable.id, gameHistoryId), eq(gameHistoryTable.status, 'IN_PROGRESS'))
		});

		if (!game) {
			error(400, 'Game not found or already finished');
		}

		// Verify user is part of the game
		if (game.playerOneId !== user.id && game.playerTwoId !== user.id) {
			error(400, 'User not part of this game');
		}

		// Prepare winner based on conditions

		await db
			.update(gameHistoryTable)
			.set({
				status: 'COMPLETED',
				winner: winner ? user.id : null
			})
			.where(eq(gameHistoryTable.id, game.id));
		// Prepare the increment values based on winner and draw
		const lostIncrement = winner ? 0 : 1;
		const wonIncrement = winner ? 1 : 0;
		const drawIncrement = draw ? 1 : 0;

		const rankingChange = winner ? 10 : draw ? 0 : -10;
		const res = await db
			.insert(statsTable)
			.values({
				gameId: 4,
				globalRanking: 1000,
				userId: user.id,
				gamesPlayed: 1,
				gamesLost: lostIncrement,
				gamesWon: wonIncrement,
				gamesDrawn: drawIncrement
			})
			.onConflictDoUpdate({
				target: [statsTable.userId, statsTable.gameId],
				set: {
					gamesPlayed: sql`games_played + 1`,
					gamesLost: sql`games_lost + ${lostIncrement}`,
					gamesWon: sql`games_won + ${wonIncrement}`,
					gamesDrawn: sql`games_drawn + ${drawIncrement}`,
					globalRanking: sql`global_ranking + ${rankingChange}`
				}
			})
			.returning()
			.get();
		console.log('🚀 ~ POST ~ res:', res);
	} catch (err) {
		console.log('🚀 ~ abortGame: ~ error:', err);
		error(500, 'something went wrong');
	}
	return new Response(JSON.stringify({ success: true }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
