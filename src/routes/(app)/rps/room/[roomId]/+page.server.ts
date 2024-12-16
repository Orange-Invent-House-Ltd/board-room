import { friendGameInvitationsTable } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params, locals:{db} }) => {
    const roomId = params.roomId;
    const friendGame = await db
        .select()
        .from(friendGameInvitationsTable)
        .where(eq(friendGameInvitationsTable.inviteCode, roomId))
        .get();
    if (!friendGame) {
         error(404, 'Game not found');
    }
    return { friendGame };
};