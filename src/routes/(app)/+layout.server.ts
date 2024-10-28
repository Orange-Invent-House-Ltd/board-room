import { getUserWithStats } from '$lib/server/helpers';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { user, db } }) => {
	if (!user) {
		redirect(308, '/login');
	}
	const userWithStats = await getUserWithStats(db, user.id);
	return {
		user,
		userWithStats
	};
};
