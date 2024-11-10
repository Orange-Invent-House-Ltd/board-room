import { eq } from 'drizzle-orm';
import { usersTable, type User } from '../db/schema';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { nanoid } from 'nanoid';
type Schema = typeof import('../db/schema');

export async function createUser(
	googleId: string,
	email: string,
	name: string,
	picture: string,
	db: DrizzleD1Database<Schema>
): Promise<User> {
	const nano = nanoid(5);
	const user = await db
		.insert(usersTable)
		.values({
			googleId,
			email,
			name,
			picture,
			username: '@' + name + nano
		})
		.returning()
		.get();

	if (user.id === null) {
		throw new Error('Unexpected error');
	}

	return user;
}

export async function getUserFromGoogleId(
	googleId: string,
	db: DrizzleD1Database<Schema>
): Promise<User | null> {
	const user = await db.query.usersTable.findFirst({
		where: eq(usersTable.googleId, googleId)
	});
	if (!user) {
		return null;
	}

	return user;
}
