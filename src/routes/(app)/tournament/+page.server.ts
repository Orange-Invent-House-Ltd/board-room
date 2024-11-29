export const load = async (event) => {
	const {
		locals: { db },
		url
	} = event;
	const gameId = url.searchParams.get('gameId') as unknown as number;
	const tournaments = await db.query.tournamentsTable.findMany({
		orderBy: (t, { desc }) => desc(t.createdAt),
		where: (t, { eq, and }) =>
			and(eq(t.type, 'public'), gameId > 0 ? eq(t.gameId, gameId) : undefined)
	});
	return {
		tournaments
	};
};
