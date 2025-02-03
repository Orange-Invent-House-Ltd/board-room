import { friendGameInvitationsTable } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const load = async ({ params, locals: { db } }) => {
	const roomId = params.roomId;
	// const friendGame = await db
	//     .select()
	//     .from(friendGameInvitationsTable)
	//     .where(and(eq(friendGameInvitationsTable.inviteCode, roomId),eq(friendGameInvitationsTable.status, 'ACCEPTED')))
	//     .get();
	// if (!friendGame) {
	//      error(404, 'Game not found');
	// }
	return {
		// friendGame,
		roomId
	};
};
