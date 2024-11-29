import type { ServerLoadEvent } from '@sveltejs/kit';

export async function getTournaments(event: ServerLoadEvent) {
	const {
		locals: { db }
	} = event;

	const tournaments = await db.query.tournamentsTable.findMany({
		orderBy: (t, { desc }) => desc(t.createdAt),
		where: (t, { eq }) => eq(t.type, 'public')
	});
	return {
		tournaments
	};
}
