import { BASE_URL } from '$env/static/private';
import { CatRpsSchema, PwfRpsSchema } from '$lib/formSchema.js';
import {
	friendGameInvitationsTable,
	gameHistoryTable,
	notificationsTable,
	participantsTable,
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
		const gameHistoryId = Number(form.get('gameHistoryId'));
		if (!user) error(401, 'Unauthorized');
		if (!gameHistoryId) error(400, 'error');
		try {
			// First get the game state
			const gameHistory = await db.query.gameHistoryTable.findFirst({
				where: and(
					eq(gameHistoryTable.id, gameHistoryId),
					eq(gameHistoryTable.status, 'IN_PROGRESS')
				)
			});
			console.log(gameHistory);
			if (!gameHistory) {
				error(400, 'Game not found or already finished');
			}

			// Verify user is part of the game
			if (gameHistory.playerOneId !== user.id && gameHistory.playerTwoId !== user.id) {
				error(400, 'User not part of this game');
			}

			// Prepare winner based on conditions
			const winner =
				gameHistory.opponentType === 'COMPUTER'
					? null
					: user.id === gameHistory.playerOneId
						? gameHistory.playerTwoId
						: gameHistory.playerOneId;

			await db
				.update(gameHistoryTable)
				.set({
					status: 'ABORTED',
					winner
				})
				.where(eq(gameHistoryTable.id, gameHistory.id));

			await db
				.insert(statsTable)
				.values({
					globalRanking: 1000,
					userId: user.id,
					gamesPlayed: 1,
					gamesLost: 1,
					gameName: 'rps'
				})
				.onConflictDoUpdate({
					target: [statsTable.userId, statsTable.gameName],
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
	cat: async ({ locals: { db, user }, request, fetch }) => {
		if (!user) error(401, 'Unauthorized');
		const form = await superValidate(request, zod(CatRpsSchema));
		const { data, valid } = form;
		if (!valid) return fail(400, { form });
		const convertedDate = new Date(data.startTime);

		const startTimeUnixSeconds = convertedDate.getTime();
		const res = await db
			.insert(tournamentsTable)
			.values({
				type: data.type,
				startTime: convertedDate,
				name: data.name,
				maxPlayers: data.maximumPlayers,
				status: 'UPCOMING',
				fee: data.fee,
				gameName: 'rps',
				userId: user.id
			})
			.returning()
			.get();
		await db.insert(participantsTable).values({
			userId: user.id,
			tournamentId: res.id
		});
		const info = await fetch('http://127.0.0.1:8787/tournament/initialize', {
			method: 'POST',
			body: JSON.stringify({
				...res,
				startTime: startTimeUnixSeconds,
				username: user.username,
				userId: user.id
			})
		});
		console.log(await info.json());
		return message(form, res);
	},
	pwf: async ({ locals: { db, user }, request, fetch }) => {
		if (!user) error(401, 'Unauthorized');
		const form = await superValidate(request, zod(PwfRpsSchema));
		const { data, valid } = form;
		if (!valid) return fail(400, { form });
		const friendUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.username, data.username))
			.get();
		if (!friendUser) {
			return message(form, { type: 'error', text: "Friend's username not found" });
		}
		if (friendUser.username === user.username) {
			return message(form, { type: 'error', text: 'You cannot invite yourself' });
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
		// if (existingInvitation) {
		// 	return message(form, { type: 'error', text: 'Pending invitation already exists' });
		// }
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
					gameName: 'rps',
					inviteCode: inviteCode,
					numberOfRounds: data.numberOfRounds
				})
				.returning()
				.get();
			const n = await db
				.insert(notificationsTable)
				.values({
					message: `is inviting you to a rps game`,
					receiverId: friendUser.id,
					senderId: user.id,
					inviteCode,
					type: 'FRIEND_INVITATION'
				})
				.returning()
				.get();
			const notification = await db.query.notificationsTable.findFirst({
				where: ({ id }) => eq(id, n.id),
				with: {
					sender: true
				}
			});
			const r = await fetch('http://127.0.0.1:8787/send-notification', {
				method: 'POST',
				body: JSON.stringify({ notification })
			});
			console.log('this is from the do', r);

			return message(form, { type: 'success', text: inviteCode });
			// return { success: true, message: 'Invitation sent successfully', inviteCode };
		} catch (err) {
			console.error('Error creating game invitation:', err);
			return message(form, { text: 'internal serval error', type: 'error' });
		}
	}
};
