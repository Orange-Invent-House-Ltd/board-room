import { getTournaments } from '$lib/server/actions/queries';

export const load = async (event) => {
	const tournaments = await getTournaments(event);
	return {
		tournaments
	};
};
