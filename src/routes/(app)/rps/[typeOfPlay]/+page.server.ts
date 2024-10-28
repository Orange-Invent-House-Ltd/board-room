import { gameHistoryTable, statsTable } from '$lib/server/db/schema.js';
import { error, redirect } from '@sveltejs/kit';
import { sql, and, eq } from 'drizzle-orm';
export const load = async ({ url }) => {
	console.log('🚀 ~ load ~ url:', url);
};

export const actions = {
	abortGame: async ({ locals: { db, user }, request }) => {
		const form = await request.formData();
		const gameHistoryId = Number(form.get('gh'));
		if (!user) error(401, 'Unauthorized');
		if (!gameHistoryId) error(400, 'error');
		try {
			// First get the game state
			const game = await db.query.gameHistoryTable.findFirst({
				where: and(
					eq(gameHistoryTable.id, gameHistoryId),
					eq(gameHistoryTable.status, 'IN_PROGRESS')
				)
			});

			if (!game) {
				error(400, 'Game not found or already finished');
			}

			// Verify user is part of the game
			if (game.playerOneId !== user.id && game.playerTwoId !== user.id) {
				error(400, 'User not part of this game');
			}

			// Prepare winner based on conditions
			const winner = game.isComputerOpponent
				? null
				: user.id === game.playerOneId
					? game.playerTwoId
					: game.playerOneId;

			await db
				.update(gameHistoryTable)
				.set({
					status: 'ABORTED',
					winner
				})
				.where(eq(gameHistoryTable.id, game.id));

			await db
				.insert(statsTable)
				.values({
					gameId: 4,
					globalRanking: 1000,
					userId: user.id,
					gamesPlayed: 1,
					gamesLost: 1
				})
				.onConflictDoUpdate({
					target: [statsTable.userId, statsTable.gameId],
					set: {
						gamesPlayed: sql`games_played + 1`,
						gamesLost: sql`games_lost + 1`,
						globalRanking: sql`global_ranking + 10`
					}
				});
		} catch (err) {
			console.log('🚀 ~ abortGame: ~ error:', err);
			// error(500, 'something went wrong');
		}
		redirect(303, '/rps');
	}
};
