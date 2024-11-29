import { error } from '@sveltejs/kit';

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
