import { pusherServer } from '$lib/pusher';

export async function POST({ request }: { request: Request }) {
	const { roomId, choice, playerId } = await request.json();
	console.log('🚀 ~ POST ~ roomId, choice, playerId:', { roomId, choice, playerId });

	// Broadcast the player's move
	pusherServer.trigger(`rps-room-${roomId}`, 'player-move', {
		player: playerId,
		choice
	});

	return new Response(JSON.stringify({ success: true }), {
		headers: { 'Content-Type': 'application/json' }
	});
}
