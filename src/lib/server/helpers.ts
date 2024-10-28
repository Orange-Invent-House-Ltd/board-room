import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { gamesTable, statsTable, usersTable } from './db/schema';
import { and, desc, eq } from 'drizzle-orm';
type Schema = typeof import('./db/schema');

export async function getUserWithStats(db: DrizzleD1Database<Schema>, userId: number) {
	const user = await db.query.usersTable.findFirst({
		where: (users) => eq(users.id, userId),
		with: {
			stats: {
				with: {
					game: true
				}
			}
		}
	});
	return user;
}

// Get all stats for a player
export async function getAllPlayerStats(db: DrizzleD1Database<Schema>, userId: number) {
	return await db.query.statsTable.findMany({
		where: eq(statsTable.userId, userId),
		with: {
			user: true
		}
	});
}

// Get leaderboard for a specific game
export async function getGameLeaderboard(db: DrizzleD1Database<Schema>, gameName: string) {
	return await db.query.statsTable.findMany({
		where: eq(gamesTable.name, gameName),
		with: {
			user: true
		},
		orderBy: desc(statsTable.globalRanking)
	});
}

// const userWithStats = await db.query.usersTable.findFirst({
// 	where: eq(usersTable.id, userId),
// 	with: {
// 		stats: {
// 			with: {
// 				game: true
// 			}
// 		}
// 	}
// });
