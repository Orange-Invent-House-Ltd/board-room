import { pusherServer } from '$lib/pusher';

export const POST = async () => {
	console.log('woking');
	pusherServer.trigger('rps', 'upcoming-message', {
		message: 'player made his move'
	});
	return new Response(JSON.stringify({ success: true }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
