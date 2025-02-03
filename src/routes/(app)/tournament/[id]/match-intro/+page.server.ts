import { matches } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq, and, or } from 'drizzle-orm';
import type { User } from '$lib/server/db/schema'; // Import the User type
import { PUBLIC_WORKERS_URL } from '$env/static/public';

export const load = async ({ locals: { db, user }, params }) => {
	if (!user) error(401, 'Unauthorized');

	const tournamentId = Number(params.id);
	console.log('🔍 [LOAD] Current user:', {
		id: user.id,
		username: user.username
	});

	// Find the current match for the user
	const currentMatch = await db.query.matches.findFirst({
		where: (m, { eq, and }) =>
			and(
				eq(m.tournamentId, tournamentId),
				or(eq(m.player1Id, user.id), eq(m.player2Id, user.id)),
				or(eq(m.status, 'SCHEDULED'), eq(m.status, 'READY'))
			),
		with: {
			player1: true,
			player2: true
		}
	});

	if (!currentMatch) {
		error(404, 'No active match found');
	}

	console.log('🎯 [LOAD] Found match:', {
		matchId: currentMatch.id,
		player1: {
			id: currentMatch.player1?.id,
			username: currentMatch.player1?.username
		},
		player2: {
			id: currentMatch.player2?.id,
			username: currentMatch.player2?.username
		},
		currentUserId: user.id
	});

	// Determine opponent
	let opponent: User | null = null;
	if (currentMatch.player1Id === user.id) {
		opponent = currentMatch.player2;
		console.log('👥 [LOAD] User is player1, opponent is player2');
	} else if (currentMatch.player2Id === user.id) {
		opponent = currentMatch.player1;
		console.log('👥 [LOAD] User is player2, opponent is player1');
	}

	if (!opponent) {
		console.error('❌ [LOAD] Failed to determine opponent:', {
			matchDetails: currentMatch,
			userId: user.id
		});
		error(404, 'Opponent not found');
	}

	console.log('✅ [LOAD] Determined opponent:', {
		id: opponent.id,
		username: opponent.username
	});

	return {
		opponent,
		matchId: currentMatch.id,
		tournamentId
	};
};

export const actions = {
	ready: async ({ locals: { db, user }, request, params }) => {
		if (!user) error(401, 'Unauthorized');

		const formData = await request.formData();
		const matchId = Number(formData.get('matchId'));
		if (!matchId) error(400, 'Match ID is required');

		const tournamentId = Number(params.id);

		// First, notify the tournament DO about player readiness
		const response = await fetch(`http://${PUBLIC_WORKERS_URL}/tournament/${tournamentId}/ready`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				playerId: user.id,
				matchId: matchId
			})
		});

		if (!response.ok) {
			error(500, 'Failed to notify tournament about player readiness');
		}

		// Update local database for persistence
		await db
			.update(matches)
			.set({ status: 'READY' })
			.where(eq(matches.id, Number(matchId)));

		return { success: true };
	},

	abort: async ({ locals: { db, user }, params, request }) => {
		if (!user) error(401, 'Unauthorized');

		const tournamentId = Number(params.id);
		const formData = await request.formData();
		const matchId = Number(formData.get('matchId'));
		if (!matchId) error(400, 'Match ID is required');

		// First, notify the tournament DO about the forfeit
		const response = await fetch(
			`http://${PUBLIC_WORKERS_URL}/tournament/${tournamentId}/forfeit`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					playerId: user.id,
					matchId: matchId // You'll need to get the matchId from somewhere
				})
			}
		);

		if (!response.ok) {
			error(500, 'Failed to notify tournament about forfeit');
		}

		// Update local database for persistence
		await db
			.delete(matches)
			.where(
				and(
					eq(matches.tournamentId, tournamentId),
					or(eq(matches.player1Id, user.id), eq(matches.player2Id, user.id))
				)
			);

		return { success: true };
	}
};
