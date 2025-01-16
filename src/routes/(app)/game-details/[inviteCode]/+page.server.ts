import { friendGameInvitationsTable } from '$lib/server/db/schema';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params, locals: { db } }) => {
	const { inviteCode } = params;

	const gameInvitation = await db.query.friendGameInvitationsTable.findFirst({
		where: (t, { eq }) => eq(t.inviteCode, inviteCode),
		with: {
			initiator: true,
			invitedUser: true
		}
	});
	if (!gameInvitation) {
		error(404, 'Not found');
	}
	return {
		gameInvitation
	};
};


export const actions = {
	 acceptInvite : async({ request, locals: { db, user } })=> {
		const formData = await request.formData();
		const inviteCode = formData.get('inviteCode') as string;
		const gameInvitation = await db.query.friendGameInvitationsTable.findFirst({
			where: (t, { eq }) => eq(t.inviteCode, inviteCode),
			with: {
				initiator: true,
				invitedUser: true
			}
		});
		if (!gameInvitation) {
			error(404, 'Not found');
		}
		if (gameInvitation.invitedUserId !== user?.id) {
			error(403, 'Forbidden');
		}
		if(gameInvitation.status !== 'PENDING') {
			return fail(400,{ message: 'this invite can not be accepted anymore' } ) 
			// error(400, '');
		}
		await db.update(friendGameInvitationsTable).set({ status: 'ACCEPTED' }).where(eq(friendGameInvitationsTable.inviteCode, inviteCode));
		 redirect(303, `/rps/room/${inviteCode}`);
	},
	 declineInvite:async({ request, locals: { db, user } })=> {
		const formData = await request.formData();
		const inviteCode = formData.get('inviteCode') as string;
		const gameInvitation = await db.query.friendGameInvitationsTable.findFirst({
			where: (t, { eq }) => eq(t.inviteCode, inviteCode),
			with: {
				initiator: true,
				invitedUser: true
			}
		});
		if (!gameInvitation) {
			error(404, 'Not found');
		}
		if (gameInvitation.invitedUserId !== user?.id) {
			error(403, 'Forbidden');
		}
		if(gameInvitation.status !== 'PENDING') {
			return fail(400,{ message: 'this invite can not be changed anymore' } ) 
		}
		
		await db.update(friendGameInvitationsTable).set({ status: 'DECLINED' }).where(eq(friendGameInvitationsTable.inviteCode, inviteCode));
		return fail(400,{ message: 'You have rejected this invite' } ) 

		
	}
};
