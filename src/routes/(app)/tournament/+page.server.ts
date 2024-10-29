import { error } from '@sveltejs/kit';

export const load = async ({ locals: { db, user } }) => {
	if (!user) error(401, 'Unauthorized');
	const tournaments = await db.query.tournamentsTable.findMany();
	return {
		tournaments
	};
};
