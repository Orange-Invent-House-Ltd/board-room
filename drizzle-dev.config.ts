import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	verbose: true,
	strict: true,
	dialect: 'sqlite',
	out: './migrations',
	casing: 'snake_case',
	dbCredentials: {
		url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/70f4d26f49cefbb0e7ad6f9402e845b80193be0418e7d027051c1b8f7b7e8ac0.sqlite'
	}
});
