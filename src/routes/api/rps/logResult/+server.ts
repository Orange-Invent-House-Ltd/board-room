import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db'; // Assuming you have a database connection setup
import { gameHistoryTable } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request,locals:{db} }) => {
    try {
        const { roomId, overallResult, won, lost, draw } = await request.json();

        // Validate the received data
        if (!roomId || !overallResult || won === undefined || lost === undefined || draw === undefined) {
            return json({ error: 'Invalid data' }, { status: 400 });
        }

        // Insert the result into the game history table
        await db.insert(gameHistoryTable).values({
            gameId: roomId, // Assuming roomId maps to gameId
            playerOneId: 1, // Placeholder for actual player ID
            playerTwoId: 2, // Placeholder for actual player ID
            winner: overallResult === 'win' ? 1 : (overallResult === 'lose' ? 2 : null), // Determine winner ID
            status: 'COMPLETED',
            stakingAmount: 0, // Adjust as necessary
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // Respond with a success message
        return json({ message: 'Game result logged successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error logging game result:', error);
        return json({ error: 'Failed to log game result' }, { status: 500 });
    }
};