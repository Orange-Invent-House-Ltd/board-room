import { notificationsTable } from '$lib/server/db/schema';
import { and, desc, eq, gt, gte } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const { db, user } = locals;
	if (!user) error(401, 'Unauthorized');

	const notifications = await db.query.notificationsTable.findMany({
		where: and(eq(notificationsTable.receiverId, user.id)),
		with: {
			sender: true
		}
	});
	return {
		notifications
	};
};
