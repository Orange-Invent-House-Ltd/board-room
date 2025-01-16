export const load = async (event) => {
	const {
		locals: { db },
		url
	} = event;
	const gameName = url.searchParams.get('gameName') as string;
	const tournaments = await db.query.tournamentsTable.findMany({
		orderBy: (t, { desc }) => desc(t.createdAt),
		where: (t, { eq, and }) =>
			and(eq(t.type, 'public'), gameName ? eq(t.gameName, gameName) : undefined)
	});
	const games = await db.query.gamesTable.findMany({
		orderBy: (t, { desc }) => desc(t.createdAt)
	});

	return {
		tournaments,
		games
	};
};
