export const load = async (event) => {
	const {
		locals: { db },
		url
	} = event;
	const gameName = url.searchParams.get('gameName') as string;
	console.log('🚀 ~ load ~ gameName:', gameName);
	const tournaments = await db.query.tournamentsTable.findMany({
		orderBy: (t, { desc }) => desc(t.createdAt),
		where: (t, { eq, and }) =>
			and(eq(t.type, 'public'), gameName ? eq(t.gameName, gameName) : undefined)
	});
	return {
		tournaments
	};
};
