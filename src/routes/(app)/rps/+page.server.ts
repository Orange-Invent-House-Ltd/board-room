import { gameHistoryTable } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';

export const actions = {
	playWithComputer: async ({ locals: { db, user }, request }) => {
		if (!user) return;
		const form = await request.formData();
		const href = form.get('href') as string;

		const ghc = await db
			.insert(gameHistoryTable)
			.values({
				gameId: 4,
				playerOneId: user?.id,
				isComputerOpponent: true
			})
			.returning()
			.get()
			.catch(() => {
				error(500, 'Something went wrong');
			});

		redirect(303, `${href}?gh=${ghc.id}`);
	},
	createTournament: async ({ locals: { user }, request }) => {
		if (!user) return;
		const form = await request.formData();
		const href = form.get('href') as string;
		console.log('🚀 ~ createTournament: ~ href:', href);
		redirect(303, `${href}`);
	}
};
