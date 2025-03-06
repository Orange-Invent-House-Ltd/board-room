// import { json } from '@sveltejs/kit';
// import { matches } from '$lib/server/db/schema';

// export async function POST({ request, locals, params }) {
// 	const id = Number(params.id);
// 	const { user } = locals;
// 	const { db } = locals;

// 	const {
// 		tournamentId,
// 		matches: matchesData
// 	}: {
// 		tournamentId: number;
// 		matches: {
// 			roundNumber: number;
// 			player1Id: number;
// 			player2Id: number;
// 			status: 'LIVE' | 'COMPLETED' | 'SCHEDULED' | 'READY';
// 			isBye: boolean;
// 		}[];
// 	} = await request.json();

// 	// Insert matches into database
// 	await db.insert(matches).values(
// 		matchesData.map((m) => ({
// 			tournamentId: id,
// 			roundNumber: m.roundNumber,
// 			player1Id: m.player1Id,
// 			player2Id: m.player2Id,
// 			status: m.status,
// 			isBye: m.isBye,
// 			id: m.id
// 		}))
// 	);

// 	return json({ success: true });
// }
