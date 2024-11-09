import { BASE_URL } from '$env/static/private';
import { CatRpsSchema, PwfRpsSchema } from '$lib/formSchema.js';
import {
	friendGameInvitationsTable,
	gameHistoryTable,
	statsTable,
	tournamentsTable,
	usersTable
} from '$lib/server/db/schema.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { sql, and, eq } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { nanoid } from 'nanoid';

type Schema = typeof import('$lib/server/db/schema');

export const load = async () => {
	const catForm = await superValidate(zod(CatRpsSchema));
	const pwfForm = await superValidate(zod(PwfRpsSchema));
	return {
		catForm,
		pwfForm
	};
};

export const actions = {
	abortGame: async ({ locals: { db, user }, request }) => {
		const form = await request.formData();
		const gameHistoryId = Number(form.get('gh'));
		if (!user) error(401, 'Unauthorized');
		if (!gameHistoryId) error(400, 'error');
		try {
			// First get the game state
			const game = await db.query.gameHistoryTable.findFirst({
				where: and(
					eq(gameHistoryTable.id, gameHistoryId),
					eq(gameHistoryTable.status, 'IN_PROGRESS')
				)
			});

			if (!game) {
				error(400, 'Game not found or already finished');
			}

			// Verify user is part of the game
			if (game.playerOneId !== user.id && game.playerTwoId !== user.id) {
				error(400, 'User not part of this game');
			}

			// Prepare winner based on conditions
			const winner = game.isComputerOpponent
				? null
				: user.id === game.playerOneId
					? game.playerTwoId
					: game.playerOneId;

			await db
				.update(gameHistoryTable)
				.set({
					status: 'ABORTED',
					winner
				})
				.where(eq(gameHistoryTable.id, game.id));

			await db
				.insert(statsTable)
				.values({
					gameId: 4,
					globalRanking: 1000,
					userId: user.id,
					gamesPlayed: 1,
					gamesLost: 1
				})
				.onConflictDoUpdate({
					target: [statsTable.userId, statsTable.gameId],
					set: {
						gamesPlayed: sql`games_played + 1`,
						gamesLost: sql`games_lost + 1`,
						globalRanking: sql`global_ranking + 10`
					}
				});
		} catch (err) {
			console.log('🚀 ~ abortGame: ~ error:', err);
			// error(500, 'something went wrong');
		}
		redirect(303, '/rps');
	},
	cat: async ({ locals: { db, user }, request }) => {
		if (!user) error(401, 'Unauthorized');
		const form = await superValidate(request, zod(CatRpsSchema));
		const { data, valid } = form;
		if (!valid) return fail(400, { form });
		const res = await db
			.insert(tournamentsTable)
			.values({
				type: data.type,
				duration: data.duration,
				name: data.name,
				maxPlayers: data.maximumPlayers,
				status: 'LIVE',
				fee: data.fee,
				gameId: 4,
				userId: user.id
			})
			.returning()
			.get();
		return message(form, res);
	},
	pwf: async ({ locals: { db, user }, request }) => {
		if (!user) error(401, 'Unauthorized');
		const form = await superValidate(request, zod(PwfRpsSchema));
		const { data, valid } = form;
		if (!valid) return fail(400, { form });
		const friendUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, data.friendEmail))
			.get();
		if (!friendUser) {
			return message(form, { type: 'error', text: 'Friend username not found' });
		}
		const existingInvitation = await db
			.select()
			.from(friendGameInvitationsTable)
			.where(
				and(
					eq(friendGameInvitationsTable.initiatorId, user.id),
					eq(friendGameInvitationsTable.invitedUserId, friendUser.id),
					eq(friendGameInvitationsTable.status, 'PENDING')
				)
			)
			.get();
		if (existingInvitation) {
			return message(form, { type: 'error', text: 'Pending invitation already exists' });
		}
		const inviteCode = nanoid();
		// Set expiration to 24 hours from now
		try {
			await db
				.insert(friendGameInvitationsTable)
				.values({
					initiatorId: user.id,
					invitedUserId: friendUser.id,
					stakingAmount: data.stakingAmount,
					status: 'PENDING',
					gameId: 4,
					inviteCode: inviteCode
				})
				.returning()
				.get();

			return message(form, { type: 'success', text: inviteCode });
			// return { success: true, message: 'Invitation sent successfully', inviteCode };
		} catch (err) {
			console.error('Error creating game invitation:', err);
			return message(form, { text: 'internal serval error', type: 'error' });
		}
	}
};
