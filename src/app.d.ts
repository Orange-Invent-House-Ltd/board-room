// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { UserWithStats } from '$lib/types';
import type { Session, User } from './lib/server/db/schema';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

// for information about these interfaces
type Schema = typeof import('./lib/server/db/schema');
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
			db: DrizzleD1Database<Schema>;
		}
		interface PageData {
			userWithStats: UserWithStats;
		}
		// interface PageState {}
		interface Platform {
			env: {
				DB: D1Database;
				bucket: R2Bucket;
			};
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
}

export {};
