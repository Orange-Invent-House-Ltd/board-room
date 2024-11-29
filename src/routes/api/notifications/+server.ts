import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { notificationsTable } from '$lib/server/db/schema';
import { and, desc, eq, gt, gte } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, locals }) => {
	const since = url.searchParams.get('since');
	const { db, user } = locals;
	if (!user) error(401, 'Unauthorized');
	try {
		// Your database query here
		// Example using prisma:
		const notifications = await db
			.select()
			.from(notificationsTable)
			.where(and(eq(notificationsTable.receiverId, user.id)))
			.orderBy(desc(notificationsTable.createdAt));

		return json(notifications);
	} catch (error) {
		console.error('Failed to fetch notifications:', error);
		return new Response('Failed to fetch notifications', { status: 500 });
	}
};
