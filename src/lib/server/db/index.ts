// import { drizzle } from 'drizzle-orm/connect';
import { drizzle } from 'drizzle-orm/d1';

import * as schema from './schema';

export async function createClient(dbInstance: D1Database) {
	// const db = await drizzle('d1', {
	// 	casing: 'snake_case',
	// 	schema,
	// 	connection: dbInstance
	// });
	const db = drizzle(dbInstance, { schema, casing: 'snake_case' });
	// const db = drizzle(dbInstance, { schema });
	return db;
}
