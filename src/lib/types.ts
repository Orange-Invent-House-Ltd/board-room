import type { InferSelectModel } from 'drizzle-orm';
import type { gamesTable, statsTable, tournamentsTable, usersTable } from './server/db/schema';

// Base table types
export type User = InferSelectModel<typeof usersTable>;
export type Game = InferSelectModel<typeof gamesTable>;
export type Stats = InferSelectModel<typeof statsTable>;
export type Tournament = InferSelectModel<typeof tournamentsTable>;

// Type for stats with game info
type StatWithGame = Stats & {
	game: Game;
};

// Type for user with all stats
export type UserWithStats = User & {
	stats: StatWithGame[];
};
export type GoogleClaims = {
	iss: string; // The issuer, which should be "https://accounts.google.com" or "accounts.google.com"
	sub: string; // The user's Google ID
	aud: string; // The client ID of the application that requested the ID token
	iat: number; // The time the ID token was issued, represented as a Unix timestamp
	exp: number; // The expiration time of the ID token, represented as a Unix timestamp
	name: string; // The user's full name
	given_name: string; // The user's first name
	family_name: string; // The user's last name
	picture: string; // The user's profile picture URL
	email: string; // The user's email address
	email_verified: boolean; // Whether the user's email address has been verified
	locale: string; // The user's preferred locale
	// Additional claims may be present depending on the requested scopes
};
