import { db } from '$lib/server/db/index.js';
import { usersTable } from '$lib/server/db/schema.js';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals: { user } }) => {
	console.log('🚀 ~ load ~ user:', user);
	if (!user) {
		redirect(308, '/login');
	}

	return {
		user
	};
};

export const actions = {
	default: async ({ locals: { user, db }, request }) => {
		if (!user) redirect(308, '/login');
		const form = await request.formData();
		const platform = form.get('platform') as string;
		const handle = form.get('handle') as string;

		switch (platform) {
			case 'twitter':
				await db
					.update(usersTable)
					.set({
						xHandle: handle
					})
					.where(eq(usersTable.id, user.id));
				console.log('🚀 ~ default: ~ platform:', platform);
				return { handle };
			case 'facebook':
				await db
					.update(usersTable)
					.set({
						facebookHandle: handle
					})
					.where(eq(usersTable.id, user.id));
				break;
			case 'instagram':
				await db
					.update(usersTable)
					.set({
						instagramHandle: handle
					})
					.where(eq(usersTable.id, user.id));
				break;

			default:
				break;
		}
	}
};
